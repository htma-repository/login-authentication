import { useContext } from "react";
import { Link } from "react-router-dom";

import AuthContext from "../../store/AuthContext";

import classes from "./StartingPageContent.module.css";

const StartingPageContent = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <section className={classes.starting}>
      <h1>Welcome on Board!</h1>
      {!isLoggedIn && (
        <Link to={"auth"}>
          <button>Login</button>
        </Link>
      )}
    </section>
  );
};

export default StartingPageContent;
