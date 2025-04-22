// Simplified auth service that uses localStorage for edit mode instead of Firebase auth

// Check if edit mode is enabled
export const isAuthenticated = () => {
  return localStorage.getItem('editModeEnabled') === 'true';
};

// No real authentication - just store the edit mode state
export const signIn = async () => {
  localStorage.setItem('editModeEnabled', 'true');
  return { success: true };
};

// Sign out
export const logOut = async () => {
  localStorage.setItem('editModeEnabled', 'false');
  return { success: true };
};

// Get current user - simplified mock
export const getCurrentUser = () => {
  if (isAuthenticated()) {
    return {
      uid: 'admin',
      displayName: 'Admin User',
      email: 'admin@example.com'
    };
  }
  return null;
};

// Reset password - no-op
export const resetPassword = async () => {
  return { success: true };
};

// Listen to auth state changes - simplified mock
export const onAuthStateChange = (callback) => {
  // Simple implementation to satisfy the API
  const unsubscribe = () => {};
  return unsubscribe;
}; 