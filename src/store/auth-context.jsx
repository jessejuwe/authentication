import React, { useState, useEffect, useCallback } from 'react';

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  login: token => {},
  logout: () => {},
});

let logoutTimer;

const autoLogoutTime = expirationTime => {
  const currentTime = new Date().getTime();
  const newExpirationTime = new Date(expirationTime).getTime();

  const remainingTime = newExpirationTime - currentTime;
  return remainingTime;
};

const retrieveStoredData = () => {
  const storedToken = localStorage.getItem('token');
  const storedExirationTime = localStorage.getItem('expirationTime');

  const remainingTime = autoLogoutTime(storedExirationTime);

  if (remainingTime <= 60000) {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    return null;
  }

  return { token: storedToken, duration: remainingTime };
};

export const AuthContextProvider = props => {
  const storedData = retrieveStoredData();

  let intialToken;
  if (storedData) intialToken = storedData.token;

  const [token, setToken] = useState(intialToken);

  // if token is not an empty string, isLoggedIn will return true, and vice-versa
  const isLoggedIn = !!token;

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');

    if (logoutTimer) clearTimeout(logoutTimer);
  }, []);

  const login = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('expirationTime', expirationTime);

    const remainingTime = autoLogoutTime(expirationTime);

    logoutTimer = setTimeout(logout, remainingTime);
  };

  useEffect(() => {
    if (storedData) logoutTimer = setTimeout(logout, storedData.duration);
  }, [storedData, logout]);

  const contextValue = { token, isLoggedIn, login, logout };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
