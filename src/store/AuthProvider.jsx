import React, { useState } from "react";

import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const isLoggedIn = !!token;

  const loginHandler = (newToken) => {
    setToken(newToken);
  };

  const logoutHandler = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const value = {
    token,
    isLoggedIn,
    setToken,
    login: loginHandler,
    logout: logoutHandler,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
