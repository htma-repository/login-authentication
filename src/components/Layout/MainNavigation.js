import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthContext from "../../store/AuthContext";

import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
  const { logout, isLoggedIn } = useContext(AuthContext);

  const navigate = useNavigate();

  const logoutHandler = () => {
    logout();
    navigate("auth", { replace: true });
  };

  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          {!isLoggedIn ? (
            <li>
              <Link to="/auth">Login</Link>
            </li>
          ) : (
            <>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <button onClick={logoutHandler}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
