// Re-export from the original context file
export * from '../context/authContext.jsx';

// Export a useAuth hook that can be used for convenience
import { useContext } from 'react';
import { AuthContext } from '../context/authContext.jsx';

export const useAuth = () => useContext(AuthContext); 