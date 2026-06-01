import React, { useEffect, useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import userServices from "@/services/userServices";
import { toast } from "sonner";
import {
  UserPlus,
  Search,
  Shield,
  UserCheck,
  UserX,
  Edit3,
  Check,
  X,
  Loader2,
  Trash2,
  Lock,
  Unlock,
} from "lucide-react";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    roles: ["ROLE_USER"],
    isActive: true,
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await userServices.getAllUsers(page, pageSize);
      if (res && res.data) {
        // PageResponse structure
        setUsers(res.data.items || []);
        setTotalPages(res.data.totalPage || 1);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
      toast.error("Không thể tải danh sách người dùng từ hệ thống.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      roles: [role],
    }));
  };

  const openCreateModal = () => {
    setFormData({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      roles: ["ROLE_USER"],
      isActive: true,
    });
    setIsCreateOpen(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phoneNumber: user.phoneNumber || "",
      roles: user.roles ? Array.from(user.roles) : ["ROLE_USER"],
    });
    setIsEditOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await userServices.createUser(formData);
      toast.success("Tạo tài khoản người dùng thành công!");
      setIsCreateOpen(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Lỗi khi tạo tài khoản mới.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await userServices.updateUser(selectedUser.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        roles: formData.roles,
      });
      toast.success("Cập nhật thông tin tài khoản thành công!");
      setIsEditOpen(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Lỗi khi cập nhật tài khoản.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const actionText = user.isActive ? "khóa" : "kích hoạt";
    if (
      window.confirm(
        `Bạn có chắc chắn muốn ${actionText} tài khoản ${user.email}?`,
      )
    ) {
      try {
        await userServices.toggleUserStatus(user.id);
        toast.success(`Đã ${actionText} tài khoản thành công!`);
        fetchUsers();
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message || `Không thể ${actionText} tài khoản.`,
        );
      }
    }
  };

  // Filter users by email or phone or name in client search bar
  const filteredUsers = users.filter((u) => {
    const searchLower = searchQuery.toLowerCase();
    const emailMatch = u.email?.toLowerCase().includes(searchLower);
    const phoneMatch = u.phoneNumber?.includes(searchLower);
    const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
    const nameMatch = fullName.includes(searchLower);
    return emailMatch || phoneMatch || nameMatch;
  });

  const getRoleBadge = (role) => {
    const map = {
      ROLE_ADMIN: { label: "Admin", cls: "border-rose-300 text-neutral-700" },
      ROLE_STAFF: {
        label: "Nhân viên",
        cls: " text-neutral-700",
      },
      ROLE_USER: {
        label: "Khách hàng",
        cls: "border-neutral-300 text-neutral-600",
      },
    };
    const item = map[role] || {
      label: role,
      cls: "border-neutral-300 text-neutral-500",
    };
    return (
      <span
        key={role}
        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border bg-transparent ${item.cls}`}
      >
        {item.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageHeader
          badge="Thành viên"
          title="Quản lý người dùng"
          description="Quản lý và cấp quyền tài khoản Quản trị viên, Nhân viên và Khách hàng trong hệ thống."
        />
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-black text-white hover:bg-neutral-800 active:bg-black transition-all cursor-pointer shadow-sm"
        >
          <UserPlus size={18} />
          Thêm tài khoản
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-neutral-200 shadow-sm">
        <div className="relative flex-1 min-w-[280px] max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-full border border-neutral-300 outline-none focus:border-neutral-950 focus:ring-2 focus:ring-neutral-200 text-sm font-medium"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 size-5" />
        </div>
        <div className="text-xs font-bold text-neutral-400">
          Hiển thị: {filteredUsers.length} tài khoản
        </div>
      </div>

      {/* User Table list */}
      {isLoading ? (
        <div className="w-full text-center py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-neutral-500 size-8" />
          <span className="text-neutral-500 font-bold">
            Đang tải danh sách người dùng...
          </span>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-3xl border border-neutral-200 bg-white p-16 text-center shadow-sm">
          <h3 className="text-xl font-black text-neutral-900">
            Không tìm thấy tài khoản nào
          </h3>
          <p className="mt-2 text-sm font-medium text-neutral-500">
            Không có tài khoản nào phù hợp với tìm kiếm của bạn.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Họ và tên</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Số điện thoại</th>
                  <th className="px-6 py-4">Vai trò</th>
                  <th className="px-6 py-4">Ngày tạo</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-center w-36">Tác vụ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-sm">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-neutral-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-neutral-900">
                        {user.lastName} {user.firstName}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-neutral-700">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 font-semibold text-neutral-600">
                      {user.phoneNumber || (
                        <span className="text-neutral-300 italic text-xs">
                          Chưa cập nhật
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles ? (
                          Array.from(user.roles).map((role) =>
                            getRoleBadge(role),
                          )
                        ) : (
                          <span className="text-neutral-300 italic text-xs">
                            Chưa cập nhật
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-500 text-xs font-medium">
                      {user.createdAt ? (
                        new Date(user.createdAt).toLocaleDateString("vi-VN")
                      ) : (
                        <span className="text-neutral-300 italic text-xs">
                          Chưa cập nhật
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border bg-transparent ${
                          user.isActive
                            ? " text-neutral-700"
                            : " text-neutral-700"
                        }`}
                      >
                        {user.isActive ? "Hoạt động" : "Bị khóa"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(user)}
                          className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900 shadow-sm transition-colors cursor-pointer"
                          title="Sửa thông tin"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(user)}
                          className={`p-2 rounded-xl border shadow-sm transition-colors cursor-pointer ${
                            user.isActive
                              ? "border-rose-100 bg-white hover:bg-rose-50 text-rose-500 hover:text-rose-600"
                              : "border-emerald-100 bg-white hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700"
                          }`}
                          title={
                            user.isActive
                              ? "Khóa tài khoản"
                              : "Mở khóa tài khoản"
                          }
                        >
                          {user.isActive ? (
                            <Lock size={16} />
                          ) : (
                            <Unlock size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-neutral-200 bg-white px-6 py-4">
              <span className="text-xs font-bold text-neutral-500">
                Trang {page} / {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-xs font-bold hover:bg-neutral-50 active:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Trang trước
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  className="rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-xs font-bold hover:bg-neutral-50 active:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Trang sau
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Account Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl relative">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-600 size-6 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X size={16} />
            </button>

            <h3 className="text-xl font-black text-neutral-900 mb-6 flex items-center gap-2">
              <UserPlus className="text-blue-600" />
              Thêm tài khoản mới
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                    Họ
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-neutral-300 px-4 py-2.5 outline-none focus:border-neutral-950 focus:ring-2 focus:ring-neutral-200 text-sm font-semibold"
                    placeholder="Nguyễn"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                    Tên
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-neutral-300 px-4 py-2.5 outline-none focus:border-neutral-950 focus:ring-2 focus:ring-neutral-200 text-sm font-semibold"
                    placeholder="An"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-2.5 outline-none focus:border-neutral-950 focus:ring-2 focus:ring-neutral-200 text-sm font-semibold"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-2.5 outline-none focus:border-neutral-950 focus:ring-2 focus:ring-neutral-200 text-sm font-semibold"
                  placeholder="Tối thiểu 6 ký tự"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  required
                  pattern="^\d{10,11}$"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-2.5 outline-none focus:border-neutral-950 focus:ring-2 focus:ring-neutral-200 text-sm font-semibold"
                  placeholder="Ví dụ: 0987654321"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                  Vai trò hệ thống
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "ROLE_USER", label: "Khách hàng" },
                    { id: "ROLE_STAFF", label: "Nhân viên" },
                    { id: "ROLE_ADMIN", label: "Admin" },
                  ].map((roleOpt) => {
                    const isChecked = formData.roles.includes(roleOpt.id);
                    return (
                      <button
                        type="button"
                        key={roleOpt.id}
                        onClick={() => handleRoleChange(roleOpt.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isChecked
                            ? "bg-neutral-950 border-neutral-950 text-white"
                            : "bg-white border-neutral-250 text-neutral-600 hover:bg-neutral-50"
                        }`}
                      >
                        {roleOpt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="size-4 rounded accent-neutral-950 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-neutral-700 select-none">
                    Kích hoạt tài khoản ngay khi tạo
                  </span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="flex-1 rounded-2xl border border-neutral-300 bg-white py-2.5 text-sm font-bold text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100 transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 rounded-2xl bg-neutral-950 py-2.5 text-sm font-black text-white hover:bg-neutral-800 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="animate-spin size-4" />
                      Đang tạo...
                    </>
                  ) : (
                    "Tạo tài khoản"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Account Modal */}
      {isEditOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl relative">
            <button
              onClick={() => setIsEditOpen(false)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-600 size-6 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X size={16} />
            </button>

            <h3 className="text-xl font-black text-neutral-900 mb-2 flex items-center gap-2">
              <Edit3 className="text-blue-600" />
              Sửa tài khoản
            </h3>
            <p className="text-xs font-mono font-bold text-neutral-400 mb-6">
              {selectedUser.email}
            </p>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                    Họ
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-neutral-300 px-4 py-2.5 outline-none focus:border-neutral-950 focus:ring-2 focus:ring-neutral-200 text-sm font-semibold"
                    placeholder="Nguyễn"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                    Tên
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-neutral-300 px-4 py-2.5 outline-none focus:border-neutral-950 focus:ring-2 focus:ring-neutral-200 text-sm font-semibold"
                    placeholder="An"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  required
                  pattern="^\d{10,11}$"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-2.5 outline-none focus:border-neutral-950 focus:ring-2 focus:ring-neutral-200 text-sm font-semibold"
                  placeholder="Ví dụ: 0987654321"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                  Vai trò hệ thống
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "ROLE_USER", label: "Khách hàng" },
                    { id: "ROLE_STAFF", label: "Nhân viên" },
                    { id: "ROLE_ADMIN", label: "Admin" },
                  ].map((roleOpt) => {
                    const isChecked = formData.roles.includes(roleOpt.id);
                    return (
                      <button
                        type="button"
                        key={roleOpt.id}
                        onClick={() => handleRoleChange(roleOpt.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isChecked
                            ? "bg-neutral-950 border-neutral-950 text-white"
                            : "bg-white border-neutral-250 text-neutral-600 hover:bg-neutral-50"
                        }`}
                      >
                        {roleOpt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 rounded-2xl border border-neutral-300 bg-white py-2.5 text-sm font-bold text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100 transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 rounded-2xl bg-neutral-950 py-2.5 text-sm font-black text-white hover:bg-neutral-800 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="animate-spin size-4" />
                      Đang lưu...
                    </>
                  ) : (
                    "Lưu thay đổi"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
