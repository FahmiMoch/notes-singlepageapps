import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import {
  login,
  register,
  putAccessToken,
  getAccessToken,
  getUserLogged,
} from "../utils/api";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchUser = async () => {
      const token = getAccessToken();
      if (!token) {
        if (!ignore) setLoading(false);
        return;
      }

      try {
        const user = await getUserLogged();
        if (!ignore) {
          setAuthUser(user);
          setLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          setAuthUser(null);
          setLoading(false);
        }
        console.error("Failed to fetch user:", err?.message || err);
      }
    };

    fetchUser();

    return () => {
      ignore = true;
    };
  }, []);

  const handleLogin = useCallback(async ({ email, password }) => {
    try {
      const { accessToken } = await login({ email, password });
      putAccessToken(accessToken);

      const user = await getUserLogged();
      setAuthUser(user);

      return { success: true, user };
    } catch (err) {
      return {
        success: false,
        message: err?.response?.data?.message || err.message || "Login failed",
      };
    }
  }, []);

  const handleRegister = useCallback(async ({ name, email, password }) => {
    try {
      await register({ name, email, password });
      return { success: true, message: "Registration successful" };
    } catch (err) {
      return {
        success: false,
        message:
          err?.response?.data?.message || err.message || "Registration failed",
      };
    }
  }, []);

  const handleLogout = useCallback(() => {
    putAccessToken(null);
    setAuthUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        loading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export { AuthContext, AuthProvider, useAuth };
export default AuthProvider;
