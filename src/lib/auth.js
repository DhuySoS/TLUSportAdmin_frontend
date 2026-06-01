import { jwtDecode } from "jwt-decode";

export const isAdminAuthenticated = () => {
  const token = localStorage.getItem("adminAccessToken");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.roles;

    if (Array.isArray(userRole)) {
      return userRole.includes("ROLE_ADMIN") || userRole.includes("ROLE_STAFF");
    } else if (typeof userRole === "string") {
      return userRole === "ROLE_ADMIN" || userRole === "ROLE_STAFF";
    }

    return false;
  } catch (error) {
    return false;
  }
};

export const getAdminRole = () => {
  const token = localStorage.getItem("adminAccessToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.roles;

    if (Array.isArray(userRole)) {
      return userRole.includes("ROLE_ADMIN") ? "ROLE_ADMIN" : (userRole.includes("ROLE_STAFF") ? "ROLE_STAFF" : null);
    } else if (typeof userRole === "string") {
      return userRole;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const saveAdminTokens = ({ accessToken, refreshToken }) => {
  localStorage.setItem("adminAccessToken", accessToken);
  if (refreshToken) {
    localStorage.setItem("adminRefreshToken", refreshToken);
  }
};

export const clearAdminTokens = () => {
  localStorage.removeItem("adminAccessToken");
  localStorage.removeItem("adminRefreshToken");
};
