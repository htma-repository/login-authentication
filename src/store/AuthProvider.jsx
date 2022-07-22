import React, { useState, useCallback, useEffect } from "react";

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

const getStorageItems = () => {
  const authToken = localStorage.getItem("auth_token");
  const expireToken = localStorage.getItem("expire_token");

  const remainingTime = calculateAutoLogoutTime(expireToken);

  if (remainingTime <= 60000) {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("expire_token");
    return null;
  }
  return {
    authToken,
    remainingTime,
  };
};

let logoutTimer = null;

const AuthProvider = ({ children }) => {
  // const storageToken = loadFromCookie();
  const storageData = getStorageItems();
  let storageToken;
  if (storageData) storageToken = storageData.authToken;

  const [token, setToken] = useState(storageToken);

  const isLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("expire_token");
    setToken(null);
    // document.cookie = "token=";

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (newToken, expireDate) => {
    localStorage.setItem("auth_token", newToken);
    localStorage.setItem("expire_token", expireDate);
    setToken(newToken);
    // document.cookie = `token=${newToken.idToken}`;

    const autoLogout = calculateAutoLogoutTime(expireDate);

    console.log(`autoLogout = ${autoLogout}`);

    logoutTimer = setTimeout(logoutHandler, autoLogout);
  };

  useEffect(() => {
    if (storageData) {
      console.log(storageData.remainingTime);
      logoutTimer = setTimeout(logoutHandler, storageData.remainingTime);
    }
  }, [storageData, logoutHandler]);

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
