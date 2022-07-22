import { useContext } from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import UserProfile from "./components/Profile/UserProfile";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import AuthContext from "./store/AuthContext";

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="profile"
          element={isLoggedIn ? <UserProfile /> : <AuthPage />}
        />
        <Route
          path="auth"
          element={!isLoggedIn ? <AuthPage /> : <HomePage />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
