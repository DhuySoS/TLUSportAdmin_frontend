import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { isAdminAuthenticated, saveAdminTokens } from "@/lib/auth";
import authServices from "@/services/authServices";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  if (isAdminAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    setCredentials({
      ...credentials,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const res = await authServices.login(credentials);

      const token = res.data?.accessToken || res.accessToken;
      if (!token) {
        throw new Error("Không tìm thấy token đăng nhập.");
      }

      const decoded = jwtDecode(token);
      console.log(decoded);
      const userRole = decoded.roles;

      let isAuthorized = false;
      if (Array.isArray(userRole)) {
        isAuthorized =
          userRole.includes("ROLE_ADMIN") || userRole.includes("ROLE_STAFF");
      } else if (typeof userRole === "string") {
        isAuthorized = userRole === "ROLE_ADMIN" || userRole === "ROLE_STAFF";
      }

      if (!isAuthorized) {
        throw new Error(
          "Tài khoản của bạn không có quyền truy cập trang quản trị!"
        );
      }

      saveAdminTokens(res.data);
      toast.success(res.message || "Đăng nhập thành công");
      navigate("/", { replace: true });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể đăng nhập Admin";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 text-neutral-950">
      <div className="w-full max-w-md bg-white rounded-3xl border border-neutral-200 p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex size-20 items-center justify-center rounded-2xl bg-neutral-100 p-3">
              <img
                src="/logo/TLUSportLogo.svg"
                alt="logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-3xl font-black text-neutral-900">
              Đăng nhập Admin
            </h2>
            <p className="mt-2 text-xs font-medium text-neutral-500 max-w-xs">
              Nhập tài khoản quản trị viên của bạn để quản lý hệ thống TLUSport.
            </p>
          </div>

          <label className="block space-y-2">
            <span className="ml-1 text-sm font-bold text-neutral-700">
              Email
            </span>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              className="w-full rounded-full border border-neutral-300 px-5 py-3 outline-none transition-all focus:border-neutral-950 focus:ring-2 focus:ring-neutral-200"
              placeholder="admin@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="ml-1 text-sm font-bold text-neutral-700">
              Mật khẩu
            </span>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full rounded-full border border-neutral-300 px-5 py-3 outline-none transition-all focus:border-neutral-950 focus:ring-2 focus:ring-neutral-200"
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              required
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-neutral-950 py-3.5 text-sm font-black text-white transition-all hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
