/**
 * Utility functions for handling MongoDB ObjectIDs in the frontend
 */

/**
 * Ensures that a MongoDB ObjectID is properly formatted as a string
 * @param {string|object} id - The ID to format (could be ObjectId or string)
 * @returns {string|null} - The formatted ID string or null if invalid
 */
export const formatMongoId = (id) => {
  if (!id) return null;
  
  // If it's already a string, return it
  if (typeof id === 'string') return id;
  
  // If it's an object with _id or id property, use that
  if (typeof id === 'object') {
    if (id._id) return id._id.toString();
    if (id.id) return id.id.toString();
    
    // If it has a toString method (might be an actual ObjectId)
    if (id.toString && typeof id.toString === 'function') {
      return id.toString();
    }
  }
  
  // If we can't format it, return null
  console.warn('Could not format MongoDB ID:', id);
  return null;
};

/**
 * Validates if a string is a valid MongoDB ObjectID
 * @param {string} id - The ID to validate
 * @returns {boolean} - Whether the ID is valid
 */
export const isValidMongoId = (id) => {
  if (!id) return false;
  
  // MongoDB ObjectIDs are 24 character hex strings
  return typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
}; 