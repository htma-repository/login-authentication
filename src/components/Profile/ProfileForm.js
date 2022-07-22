import { useContext, useState } from "react";

import useAxios from "../../hooks/useAxios";
import AuthContext from "../../store/AuthContext";

import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [passwordData, setPasswordData] = useState({});
  const { token } = useContext(AuthContext);

  const { requestHttp, error, loading } = useAxios();

  console.log(passwordData);

  const passwordChangeHandler = (event) => {
    setNewPassword(event.target.value);
  };

  const passwordSubmitHandler = (event) => {
    event.preventDefault();

    if (newPassword.length < 6) {
      return;
    }

    requestHttp(
      {
        method: "POST",
        url: "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAPBQ3hlr9iKf5Bhw2hL426Z1Lqusolk6I",
        data: {
          idToken: token,
          password: newPassword,
          returnSecureToken: false,
        },
      },
      (data) => setPasswordData(data),
      {
        path: "/",
        replaceTo: {
          replace: true,
        },
      }
    );
    setNewPassword("");
  };

  return (
    <form className={classes.form} onSubmit={passwordSubmitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          onChange={passwordChangeHandler}
          value={newPassword}
        />
      </div>
      <div className={classes.action}>
        {loading.isLoading ? (
          <p>{loading.loadingMessage}</p>
        ) : (
          <button>Change Password</button>
        )}

        {error.isError && <p>{error.errorMessage}</p>}
      </div>
    </form>
  );
};

export default ProfileForm;
