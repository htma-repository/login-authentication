import { useState, useContext, useEffect } from "react";

import useAxios from "../../hooks/useAxios";
import AuthContext from "../../store/AuthContext";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [emailPassword, setEmailPassword] = useState({
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validConfirmPassword, setValidConfirmPassword] = useState(false);
  const { requestHttp, loading, error } = useAxios();
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    // const getItem = JSON.parse(localStorage.getItem("token"));
    // authCtx.setToken(getItem.idToken);

    if (confirmPassword.length > 0 && emailPassword.password.length > 0) {
      setValidConfirmPassword(confirmPassword === emailPassword.password);
    }
  }, [emailPassword.password, confirmPassword, authCtx]);

  const emailFormHandler = (event) => {
    setEmailPassword((prevState) => {
      return { ...prevState, email: event.target.value };
    });
  };

  const passwordFormHandler = (event) => {
    setEmailPassword((prevState) => {
      return { ...prevState, password: event.target.value };
    });
  };

  const passwordMatchHandler = (event) => {
    setConfirmPassword(event.target.value);
  };

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    if (!validConfirmPassword && !isLogin) {
      return;
    }

    let URL = null;

    isLogin
      ? (URL =
          "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAPBQ3hlr9iKf5Bhw2hL426Z1Lqusolk6I")
      : (URL =
          "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAPBQ3hlr9iKf5Bhw2hL426Z1Lqusolk6I");

    requestHttp(
      {
        method: "POST",
        url: URL,
        data: {
          email: emailPassword.email,
          password: emailPassword.password,
          returnSecureToken: true,
        },
      },
      (data) => authCtx.login(data.idToken)
    );

    setEmailPassword({
      email: "",
      password: "",
    });
    setConfirmPassword("");
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input
            type="email"
            id="email"
            required
            onChange={emailFormHandler}
            value={emailPassword.email}
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            onChange={passwordFormHandler}
            value={emailPassword.password}
          />
        </div>
        {!isLogin && (
          <div className={classes.control}>
            <label htmlFor="password-match">Confirm Password</label>
            <input
              type="password"
              id="password-match"
              required
              onChange={passwordMatchHandler}
              value={confirmPassword}
            />
          </div>
        )}

        {validConfirmPassword && (
          <p style={{ color: "white" }}>Password match</p>
        )}

        <div className={classes.actions}>
          {loading.isLoading ? (
            <p style={{ color: "white" }}>{loading.loadingMessage}</p>
          ) : (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}

          {error.isError && (
            <p style={{ color: "white" }}>{error.errorMessage}</p>
          )}

          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
