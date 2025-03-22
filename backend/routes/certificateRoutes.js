import express from "express";
import { authenticate, restrictTo } from "../middleware/authMiddleware.js";
import { verifyCertificate } from "../utils/blockchainService.js";
import FarmerDocument from "../models/FarmerDocument.js";
import User from "../models/userModel.js";

const router = express.Router();

// Verify a certificate by ID
router.get("/verify/:certificateId", authenticate, async (req, res) => {
  try {
    const { certificateId } = req.params;
    console.log(certificateId);

    // First check if the certificate exists in our database
    const document = await FarmerDocument.findOne({ certificateId });

    if (!document) {
      return res.status(404).json({
        message: "Certificate not found in database",
        isValid: false,
      });
    }

    // Check authorization - only the farmer or admin can view certificates
    if (req.user.role !== "admin" && req.user.id.toString() !== document.farmerId.toString()) {
      return res.status(403).json({
        message: "Not authorized to view this certificate",
        isValid: false,
      });
    }

    try {
      // Verify the certificate on the blockchain
      console.log("verifying certificate");
      const verificationResult = await verifyCertificate(certificateId);

      // Get the document hashes if available
      let aadhaarHash = null;
      let certificateHash = null;

      if (document.documents) {
        if (document.documents.aadhaar) {
          aadhaarHash = document.documents.aadhaar.fileHash;
        }

        if (document.documents.certificate) {
          certificateHash = document.documents.certificate.fileHash;
        }
      }

      // Combine blockchain and database information
      const certificateData = {
        certificateId,
        farmerId: document.farmerId,
        farmerName: verificationResult.farmerName,
        isValid: verificationResult.isValid,
        expiryDate: verificationResult.expiryDate,
        issuedDate: document.certificateIssueDate || document.verificationDate,
        transactionHash: document.blockchainTxId,
        aadhaarHash: aadhaarHash ? aadhaarHash.substring(0, 16) + "..." : null,
        certificateHash: certificateHash
          ? certificateHash.substring(0, 16) + "..."
          : null,
        verificationDate:
          document.documents?.aadhaar?.verificationDate ||
          document.verificationDate,
      };

      res.json(certificateData);
    } catch (error) {
      console.error("Blockchain verification error:", error);

      // Even if blockchain verification fails, return the information we have
      res.status(200).json({
        certificateId,
        farmerId: document.farmerId,
        isValid: false,
        error: "Blockchain verification failed",
        message: error.message,
        transactionHash: document.blockchainTxId,
      });
    }
  } catch (error) {
    console.error("Certificate verification error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all certificates for a farmer
router.get("/farmer/:farmerId", authenticate, async (req, res) => {
  try {
    const { farmerId } = req.params;

    // Check authorization
    if (req.user.role !== "admin" && req.user.id !== farmerId) {
      return res
        .status(403)
        .json({ message: "Not authorized to access these certificates" });
    }

    // Get all certificates
    const certificates = await FarmerDocument.find({
      farmerId,
      certificateId: { $ne: null },
    }).sort({ verificationDate: -1 });

    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all issued certificates (admin only) with pagination, filtering, sorting and search
router.get("/all", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortKey = req.query.sort || "certificateIssueDate";
    const sortDirection = req.query.direction === "asc" ? 1 : -1;
    const search = req.query.search || "";
    const filter = req.query.filter || "all";

    // Build the filter query
    const filterQuery = { certificateId: { $ne: null } };

    // Add status filter if specified
    if (filter !== "all") {
      filterQuery.verificationStatus = filter;
    }

    // Add search if specified
    if (search) {
      // Find farmers matching the search term
      const farmerIds = await User.find({
        name: { $regex: search, $options: "i" },
        role: "farmer",
      }).distinct("_id");

      // Add search conditions to filter query
      filterQuery.$or = [
        { farmerId: { $in: farmerIds } },
        { certificateId: { $regex: search, $options: "i" } },
      ];
    }

    // Count total matching documents for pagination
    const total = await FarmerDocument.countDocuments(filterQuery);

    // Create sort configuration
    const sortConfig = {};
    sortConfig[sortKey] = sortDirection;

    // Fetch certificates with pagination, sorting, and filtering
    let certificates = await FarmerDocument.find(filterQuery)
      .sort(sortConfig)
      .skip(skip)
      .limit(limit);

    // If we have farmer documents, populate them with farmer names
    if (certificates.length > 0) {
      // Extract all farmer IDs
      const farmerIds = certificates.map((cert) => cert.farmerId);

      // Find all farmers in one query using MongoDB
      const farmers = await User.find({
        _id: { $in: farmerIds },
        role: "farmer"
      }, { _id: 1, name: 1 });

      // Create a map of farmer ID to name for quick lookup
      const farmerMap = {};
      farmers.forEach((farmer) => {
        farmerMap[farmer._id.toString()] = farmer.name;
      });

      // Add farmer names to certificate objects
      certificates = certificates.map((certificate) => {
        const certificateObj = certificate.toObject();
        certificateObj.farmerName =
          farmerMap[certificate.farmerId] || "Unknown Farmer";

        // Add farmer type (placeholder)
        // In a real implementation, you would get this from the farmer's profile or other data
        certificateObj.farmerType = getFarmerType(certificate.farmerId);

        return certificateObj;
      });
    }

    res.json({
      certificates,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get verification statistics for farmers (admin only)
router.get("/statistics", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Get all users with role 'farmer'
    const allFarmers = await User.find(
      { role: "farmer" },
      { name: 1, email: 1 }
    );

    // Get all farmer documents
    const farmerDocs = await FarmerDocument.find({});

    // Initialize counters
    const stats = {
      totalFarmers: allFarmers.length,
      verified: 0,
      pending: 0,
      partial: 0,
      rejected: 0,
      certified: 0,
      notUploaded: 0
    };

    // Create a map for quick lookup
    const farmerDocsMap = {};
    farmerDocs.forEach(doc => {
      farmerDocsMap[doc.farmerId.toString()] = doc;
    });

    // Process each farmer to determine their status
    const farmers = {
      verified: [],
      pending: [],
      partial: [],
      rejected: [],
      certified: [],
      notUploaded: []
    };

    allFarmers.forEach(farmer => {
      const doc = farmerDocsMap[farmer._id.toString()];
      const farmerInfo = {
        id: farmer._id,
        name: farmer.name,
        email: farmer.email
      };

      if (!doc) {
        // Farmer has not uploaded any documents
        stats.notUploaded++;
        farmers.notUploaded.push(farmerInfo);
      } else {
        // Add document status to farmer info
        farmerInfo.verificationStatus = doc.verificationStatus;
        farmerInfo.uploadDate = doc.createdAt;
        
        if (doc.certificateId) {
          farmerInfo.certificateId = doc.certificateId;
          farmerInfo.certificateIssueDate = doc.certificateIssueDate;
        }

        // Increment the appropriate counter based on status
        switch (doc.verificationStatus) {
          case 'complete':
            stats.verified++;
            farmers.verified.push(farmerInfo);
            break;
          case 'pending':
            stats.pending++;
            farmers.pending.push(farmerInfo);
            break;
          case 'partial':
            stats.partial++;
            farmers.partial.push(farmerInfo);
            break;
          case 'rejected':
            stats.rejected++;
            farmers.rejected.push(farmerInfo);
            break;
          case 'certified':
            stats.certified++;
            farmers.certified.push(farmerInfo);
            break;
          default:
            break;
        }
      }
    });

    console.log("done");

    res.json({
      stats,
      farmers
    });
  } catch (error) {
    console.error("Error fetching farmer statistics:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get specific farmer's verification status (admin or the farmer themselves)
router.get("/verification-status/:farmerId", authenticate, async (req, res) => {
  try {
    const { farmerId } = req.params;

    // Check authorization
    if (req.user.role !== "admin" && req.user.id !== farmerId) {
      return res.status(403).json({ message: "Not authorized to access this information" });
    }

    // Get farmer information using MongoDB
    const farmer = await User.findById(
      farmerId,
      { name: 1, email: 1, role: 1 }
    );

    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    if (farmer.role !== "farmer") {
      return res.status(400).json({ message: "User is not a farmer" });
    }

    // Get farmer's document status
    const farmerDoc = await FarmerDocument.findOne({ farmerId });

    // Prepare response
    const result = {
      farmer: {
        id: farmer._id,
        name: farmer.name,
        email: farmer.email
      },
      documentStatus: {
        hasUploaded: !!farmerDoc,
        verificationStatus: farmerDoc ? farmerDoc.verificationStatus : "not_uploaded"
      }
    };

    // If documents exist, add more details
    if (farmerDoc) {
      result.documentStatus.uploadDate = farmerDoc.createdAt;
      
      // Add Aadhaar document details if available
      if (farmerDoc.documents?.aadhaar) {
        result.documentStatus.aadhaar = {
          status: farmerDoc.documents.aadhaar.status,
          uploadDate: farmerDoc.documents.aadhaar.uploadDate,
          verificationDate: farmerDoc.documents.aadhaar.verificationDate || null,
          verifiedBy: farmerDoc.documents.aadhaar.verifiedBy || null,
          remarks: farmerDoc.documents.aadhaar.remarks || null
        };
      }

      // Add certificate document details if available
      if (farmerDoc.documents?.certificate) {
        result.documentStatus.certificate = {
          status: farmerDoc.documents.certificate.status,
          uploadDate: farmerDoc.documents.certificate.uploadDate,
          verificationDate: farmerDoc.documents.certificate.verificationDate || null,
          verifiedBy: farmerDoc.documents.certificate.verifiedBy || null,
          remarks: farmerDoc.documents.certificate.remarks || null
        };
      }

      // Add blockchain certificate details if available
      if (farmerDoc.certificateId) {
        result.documentStatus.blockchain = {
          certificateId: farmerDoc.certificateId,
          transactionId: farmerDoc.blockchainTxId,
          issueDate: farmerDoc.certificateIssueDate
        };
      }
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching farmer verification status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Helper function to determine farmer type (placeholder)
// In a real implementation, this would come from your database
function getFarmerType(farmerId) {
  // Sample farmer types (this is just a placeholder)
  const farmerTypes = [
    "Organic",
    "Natural",
    "Pesticide-free",
    "Biodynamic",
    "Permaculture",
  ];

  // Use a hash of the farmerId to consistently assign the same type to the same farmer
  const hash = Array.from(farmerId.toString()).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );

  return farmerTypes[hash % farmerTypes.length];
}

export const certificateRoutes = router;

