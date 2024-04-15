import React, { useState, createContext, useEffect } from 'react';
import { useRouter } from 'next/router';

export const AuthContext = createContext({
  authenticated: false,
  setAuthenticated: () => {},
  user: { username: '', id: '' },
  setUser: () => {},
  handleLogin: () => {}, 
});

const AuthContextProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState({ username: '', id: '' });
  const [loading, setLoading] = useState(true); // Add loading state

  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('user_info');
    if (isAuthenticated) {
      setAuthenticated(true);
      setUser(JSON.parse(isAuthenticated));
    } else {
      setAuthenticated(false);
      setUser({ username: '', id: '' });
    }
    setLoading(false); // Set loading to false after checking authentication
  }, []);

  const handleLogin = async (data) => {
    setAuthenticated(true);
    router.push('/');
  };

  useEffect(() => {
    if (!loading && !authenticated && router.pathname !== '/login') {
      router.push('/login');
    }
  }, [authenticated, router.pathname, loading]);

  return (
    <AuthContext.Provider
      value={{
        authenticated: authenticated,
        setAuthenticated: setAuthenticated,
        user: user,
        setUser: setUser,
        handleLogin: handleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
