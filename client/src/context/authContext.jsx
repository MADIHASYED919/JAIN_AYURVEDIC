import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import axios from "../axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({
  children
}) => {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // LOAD USER
  // =========================

  useEffect(() => {

    const loadUser = async () => {

      try {

        const token =
          localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "/api/auth/me"
        );

        setUser(res.data.user);

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }
    };

    loadUser();

  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);