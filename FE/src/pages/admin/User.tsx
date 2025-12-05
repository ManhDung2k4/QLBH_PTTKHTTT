import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUserShield,
  FaUser,
  FaKey,
} from "react-icons/fa";

interface User {
  _id: string;
  username: string;
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  role: "admin" | "staff" | "user";
  isActive: boolean;
  totalOrders?: number;
  totalSpent?: number;
  lastOrderDate?: string;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    role: "user" as "admin" | "staff" | "user",
    isActive: true,
  });
  const [passwordData, setPasswordData] = useState({
    userId: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(
        `http://localhost:3000/admin/users?${params}`
      );
      const data = await response.json();

      if (data.success) {
        setUsers(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        password: "",
        fullName: user.fullName,
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        role: user.role,
        isActive: user.isActive,
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: "",
        password: "",
        fullName: "",
        email: "",
        phone: "",
        address: "",
        role: "user",
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingUser
        ? `http://localhost:3000/admin/users/${editingUser._id}`
        : "http://localhost:3000/admin/users";

      const method = editingUser ? "PATCH" : "POST";

      const body = editingUser
        ? {
            fullName: formData.fullName,
            email: formData.email,
            role: formData.role,
            isActive: formData.isActive,
          }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        fetchUsers();
        setShowModal(false);
        alert(
          editingUser
            ? "Cập nhật người dùng thành công!"
            : "Tạo người dùng thành công!"
        );
      } else {
        alert(data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Có lỗi xảy ra khi lưu người dùng");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/admin/users/${passwordData.userId}/password`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setShowPasswordModal(false);
        setPasswordData({
          userId: "",
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        alert("Đổi mật khẩu thành công!");
      } else {
        alert(data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Có lỗi xảy ra khi đổi mật khẩu");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Bạn có chắc muốn vô hiệu hóa người dùng này?")) return;

    try {
      const response = await fetch(
        `http://localhost:3000/admin/users/${userId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        fetchUsers();
        alert("Đã vô hiệu hóa người dùng");
      } else {
        alert(data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Có lỗi xảy ra khi vô hiệu hóa người dùng");
    }
  };

  const openPasswordModal = (userId: string) => {
    setPasswordData({
      userId,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPasswordModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-3 rounded-lg">
            <FaUsers className="text-gray-800 text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Quản lý người dùng
            </h1>
            <p className="text-gray-500 text-sm">
              Quản lý tài khoản admin và user
            </p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-ocean px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
        >
          <FaPlus /> Thêm người dùng
        </button>
      </div>

      {/* Search */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl border border-teal-200/30 p-4 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Tìm theo tên, username, email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-white/50 border border-teal-200/50 rounded-lg text-gray-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl border border-teal-200/30 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="spinner mx-auto"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <FaUsers className="mx-auto text-slate-600 mb-4" size={64} />
            <p className="text-gray-500">Không tìm thấy người dùng nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/50 border-b border-teal-200/30">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Username
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Họ tên
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    SĐT / Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Vai trò
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Đơn hàng
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-800/30">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-white/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {user.role === "admin" ? (
                          <FaUserShield className="text-yellow-400" />
                        ) : (
                          <FaUser className="text-blue-400" />
                        )}
                        <span className="text-gray-800 font-medium">
                          {user.username}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.fullName}</td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="text-sm">
                        <div>{user.phone || "-"}</div>
                        <div className="text-gray-500 text-xs">
                          {user.email || "-"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.role === "admin" ? (
                        <span className="px-3 py-1 rounded-full text-sm bg-yellow-500/20 text-yellow-400 font-semibold">
                          Admin
                        </span>
                      ) : user.role === "staff" ? (
                        <span className="px-3 py-1 rounded-full text-sm bg-teal-500/20 text-teal-400 font-semibold">
                          Nhân viên
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-400">
                          Khách hàng
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.role === "user" ? (
                        <div className="text-sm">
                          <div className="text-gray-800 font-medium">
                            {user.totalOrders || 0} đơn
                          </div>
                          <div className="text-gray-500 text-xs">
                            {(user.totalSpent || 0).toLocaleString()}đ
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.isActive ? (
                        <span className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400">
                          Hoạt động
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-sm bg-red-500/20 text-red-400">
                          Bị khóa
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenModal(user)}
                          className="p-2 hover:bg-teal-50/50 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
                          title="Chỉnh sửa"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => openPasswordModal(user._id)}
                          className="p-2 hover:bg-teal-50/50 rounded-lg transition-colors text-green-400 hover:text-green-300"
                          title="Đổi mật khẩu"
                        >
                          <FaKey size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2 hover:bg-teal-50/50 rounded-lg transition-colors text-red-400 hover:text-red-300"
                          title="Vô hiệu hóa"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-teal-200/30">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-800/50 text-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-50/50 transition-colors"
            >
              Trước
            </button>
            <span className="text-gray-600">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-800/50 text-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-50/50 transition-colors"
            >
              Sau
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white/90 backdrop-blur-md rounded-2xl border border-teal-200/30 p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              {editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  disabled={!!editingUser}
                  required
                  className="w-full px-4 py-2 bg-white/50 border border-teal-200/50 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 bg-white/50 border border-teal-200/50 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Họ tên
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 bg-white/50 border border-teal-200/50 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/50 border border-teal-200/50 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {formData.role === "user" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-white/50 border border-teal-200/50 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Địa chỉ
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      rows={2}
                      className="w-full px-4 py-2 bg-white/50 border border-teal-200/50 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Vai trò
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as "admin" | "user",
                    })
                  }
                  className="w-full px-4 py-2 bg-white/50 border border-teal-200/50 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {editingUser && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-600">
                    Tài khoản hoạt động
                  </label>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 btn-ocean py-2 rounded-lg font-semibold"
                >
                  {editingUser ? "Cập nhật" : "Tạo mới"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-blue-700 hover:bg-slate-600 text-gray-800 rounded-lg transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            className="bg-white/90 backdrop-blur-md rounded-2xl border border-teal-200/30 p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Đổi mật khẩu
            </h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Mật khẩu cũ
                </label>
                <input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      oldPassword: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-2 bg-white/50 border border-teal-200/50 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-2 bg-white/50 border border-teal-200/50 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-2 bg-white/50 border border-teal-200/50 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 btn-ocean py-2 rounded-lg font-semibold"
                >
                  Đổi mật khẩu
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-6 py-2 bg-blue-700 hover:bg-slate-600 text-gray-800 rounded-lg transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
