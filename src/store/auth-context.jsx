import React, { useState } from 'react';

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  login: token => {},
  logout: () => {},
});

export const AuthContextProvider = props => {
  const [token, setToken] = useState('');

  // if token is not an empty string, isLoggedIn will return true, and vice-versa
  const isLoggedIn = !!token;

  const login = token => setToken(token);
  const logout = () => setToken('');

  const contextValue = { token, isLoggedIn, login, logout };

  return (
    <AuthContextProvider value={contextValue}>
      {props.children}
    </AuthContextProvider>
  );
};

export default AuthContext;
