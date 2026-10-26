import React, { createContext, useCallback, useContext, useMemo } from 'react';

const AuthContext = createContext(null);

const publicAuthState = {
  user: null,
  isAuthenticated: false,
  isLoadingAuth: false,
  isLoadingPublicSettings: false,
  authChecked: true,
  authError: null,
  appPublicSettings: null,
};

export const AuthProvider = ({ children }) => {
  const checkAppState = useCallback(() => {}, []);
  const checkUserAuth = useCallback(async () => {}, []);
  const logout = useCallback(() => {}, []);
  const navigateToLogin = useCallback(() => {}, []);

  const value = useMemo(() => ({
    ...publicAuthState,
    logout,
    navigateToLogin,
    checkAppState,
    checkUserAuth,
  }), [checkAppState, checkUserAuth, logout, navigateToLogin]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
