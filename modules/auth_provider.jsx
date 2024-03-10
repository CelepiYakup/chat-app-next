import React, { useState, createContext, useEffect } from 'react';
import { useRouter } from 'next/router';

export const AuthContext = createContext({
  authenticated: false,
  setAuthenticated: () => {},
  user: { username: '', id: '' },
  setUser: () => {},
  handleLogin: () => {}, // Define handleLogin in context
});

const AuthContextProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState({ username: '', id: '' });

  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('user_info');
    if (isAuthenticated) {
      setAuthenticated(true);
      setUser(JSON.parse(isAuthenticated));
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogin = async (data) => {
    // You can add login logic here
    // For now, just set authenticated to true
    setAuthenticated(true);
    // Also, you may want to set user info in localStorage
    // localStorage.setItem('user_info', JSON.stringify(data));

    router.push('/');
  };

  useEffect(() => {
    if (!authenticated) {
      router.push('/login');
    }
  }, [authenticated, router]);

  return (
    <AuthContext.Provider
      value={{
        authenticated: authenticated,
        setAuthenticated: setAuthenticated,
        user: user,
        setUser: setUser,
        handleLogin: handleLogin, // Add handleLogin function to context
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
