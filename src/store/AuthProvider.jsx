import React, { useState } from "react";

import AuthContext from "./AuthContext";

/* function loadFromCookie() {
  try {
    const token = document.cookie
      .split(";")
      .find((cookie) => cookie.startsWith("token"))
      .split("=")[1];
    return token;
  } catch (err) {
    console.log("No cookie found.");
  }
} */

const calculateAutoLogoutTime = (expireDate) => {
  const currentTimeInMilliseconds = new Date().getTime();
  const expireTimeInMilliseconds = new Date(expireDate).getTime();

  const remainingAutoLogoutTime =
    expireTimeInMilliseconds - currentTimeInMilliseconds;

  console.log(
    `currentTimeInMilliseconds = ${currentTimeInMilliseconds}, expireTimeInMilliseconds = ${expireTimeInMilliseconds}, remainingAutoLogoutTime = ${remainingAutoLogoutTime}`
  );

  return remainingAutoLogoutTime;
};

const AuthProvider = ({ children }) => {
  const storageToken = JSON.parse(localStorage.getItem("auth_token")) || null;
  console.log(storageToken?.expire_token);
  // const storageToken = loadFromCookie();
  const [token, setToken] = useState(storageToken?.id_token);

  const isLoggedIn = !!token;

  const logoutHandler = () => {
    localStorage.removeItem("auth_token");
    // document.cookie = "token=";
    setToken(null);
  };

  const loginHandler = (newToken, expireDate) => {
    localStorage.setItem(
      "auth_token",
      JSON.stringify({
        id_token: newToken,
        expire_token: expireDate,
      })
    );
    // document.cookie = `token=${newToken.idToken}`;
    setToken(newToken);

    const autoLogout = calculateAutoLogoutTime(expireDate);

    console.log(`autoLogout = ${autoLogout}`);

    setTimeout(logoutHandler, autoLogout);
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
