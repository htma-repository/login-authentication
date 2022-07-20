import React, { useState } from "react";

import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
  const storageToken = JSON.parse(localStorage.getItem("token"));
  const [token, setToken] = useState(storageToken?.idToken);

  const isLoggedIn = !!token;

  console.log(isLoggedIn);

  const loginHandler = (newToken) => {
    localStorage.setItem(
      "token",
      JSON.stringify({ email: newToken.email, idToken: newToken.idToken })
    );
    setToken(newToken.idToken);
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
