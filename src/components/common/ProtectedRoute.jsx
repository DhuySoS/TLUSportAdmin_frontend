import { Navigate } from "react-router-dom";
import { isAdminAuthenticated } from "@/lib/auth";

const ProtectedRoute = ({ children }) => {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
