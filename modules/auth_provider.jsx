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
     
    setAuthenticated(true);
  
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
