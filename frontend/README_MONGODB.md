# MongoDB Migration Guide for Frontend Developers

## Important Changes

The backend has been migrated from using PostgreSQL to exclusively using MongoDB. This affects how IDs are handled throughout the application.

### Key Changes

1. All user IDs are now MongoDB ObjectIDs (24-character hexadecimal strings)
2. The `farmerId` field in the FarmerDocument collection now references the User model with an ObjectID
3. The `verifiedBy` field in documents now stores admin ObjectIDs
4. All ID comparisons use `.toString()` for consistency

## How to Handle MongoDB ObjectIDs in the Frontend

### Sending IDs to the Backend

When sending user IDs or farmer IDs to the backend:

```javascript
// Always use the _id property from the user object
const userId = user._id;

// Example API call
axiosInstance.get(`/documents/farmer/${userId}`);

// When uploading documents
const formData = new FormData();
formData.append('farmerId', user._id);
```

### Comparing IDs

When comparing IDs (such as checking if the current user is the owner of a document):

```javascript
// Convert both IDs to strings before comparing
if (user._id.toString() === document.farmerId.toString()) {
  // User owns this document
}
```

### New Utility Functions

We've added utility functions in `src/utils/mongoIdHelper.js` to help with MongoDB ID handling:

```javascript
import { formatMongoId, isValidMongoId } from '../utils/mongoIdHelper';

// Format an ID (ensures it's a string)
const userId = formatMongoId(user._id);

// Validate if an ID is a valid MongoDB ObjectID
if (isValidMongoId(documentId)) {
  // It's a valid MongoDB ID
}
```

## Common Issues and Solutions

1. **Invalid ID Format**: Ensure all IDs sent to the backend are valid 24-character hexadecimal strings.
2. **ID Comparison Failing**: Always convert IDs to strings using `.toString()` before comparing.
3. **Accessing Properties**: MongoDB documents use `_id` instead of `id` for the primary key.

## Testing Your Changes

1. Test user authentication flows to ensure user IDs are correctly handled
2. Test document uploads to ensure farmer IDs are correctly passed
3. Test document verification to ensure admin IDs are correctly stored

If you encounter any issues with MongoDB IDs, please check the backend logs and ensure you're using the correct ID format. 