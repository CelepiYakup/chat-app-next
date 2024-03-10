import React, { useState, createContext, useEffect } from 'react';
import { useRouter } from 'next/router';

export const AuthContext = createContext({
  authenticated: false,
  setAuthenticated: () => {},
  user: { username: '', id: '' },
  setUser: () => {},
});

const AuthContextProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState({ username: '', id: '' });

  const router = useRouter();

  useEffect(() => {
    const userInfo = localStorage.getItem('user_info');

    if (!userInfo) {
      return; // No need to redirect if no user info
    }

    const user = JSON.parse(userInfo);
    if (user) {
      setUser({
        username: user.username,
        id: user.id,
      });
      setAuthenticated(true);
    }
  }, []);

  const handleLogin = async (data) => {
    // Implement your login logic here (using data.email & data.password)
    // Upon successful login, update user and authenticated state
    setUser({ username: 'example', id: 1 }); // Replace with actual user data
    setAuthenticated(true);

    // Redirect to chat app homepage after successful login (replace with your desired route)
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        authenticated: authenticated,
        setAuthenticated: setAuthenticated,
        user: user,
        setUser: setUser,
        handleLogin, // Add handleLogin function to context
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;