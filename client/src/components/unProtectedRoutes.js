import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../userConetext";
import { useContext } from "react";

function UnProtectedRoutes() {
  const { user, setUser } = useContext(UserContext);
  return !user ? <Outlet /> : <Navigate to="/" />;
}

export default UnProtectedRoutes;
