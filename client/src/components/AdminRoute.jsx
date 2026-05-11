import {
  Navigate
} from "react-router-dom";

import {
  useAuth
} from "../context/authContext"

const AdminRoute = ({
  children
}) => {

  const {
    user,
    loading
  } = useAuth();

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!user?.isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;