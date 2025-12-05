import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  DollarSign,
  Calendar,
  Edit2,
  Save,
  X,
} from "lucide-react";

interface UserProfile {
  _id: string;
  username: string;
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  role: string;
  totalOrders?: number;
  totalSpent?: number;
  lastOrderDate?: string;
  createdAt: string;
}

const ProfilePage: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/admin/users/${user._id}`
      );
      const data = await response.json();

      if (data.success) {
        setProfile(data.data);
        setFormData({
          fullName: data.data.fullName || "",
          email: data.data.email || "",
          phone: data.data.phone || "",
          address: data.data.address || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?._id) return;

    try {
      setSaving(true);
      const response = await fetch(
        `http://localhost:3000/admin/users/${user._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        setProfile(data.data);
        setIsEditing(false);
        alert("Cập nhật thông tin thành công!");
      } else {
        alert("Có lỗi xảy ra: " + data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Không thể cập nhật thông tin");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });
    }
    setIsEditing(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Chưa có";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "0₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-teal-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-teal-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-800 text-lg">
          Không tìm thấy thông tin người dùng
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Thông tin cá nhân
          </h1>
          <p className="text-gray-600">
            Quản lý thông tin và theo dõi hoạt động của bạn
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <User className="text-gray-800" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {profile.fullName}
              </h2>
              <p className="text-gray-500 text-sm mb-1">@{profile.username}</p>
              <span className="px-4 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md mt-2">
                {profile.role === "admin"
                  ? "Quản trị viên"
                  : profile.role === "staff"
                  ? "Nhân viên"
                  : "Khách hàng"}
              </span>
            </div>

            {profile.role === "user" && (
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Package size={16} />
                    Đơn hàng
                  </span>
                  <span className="text-gray-800 font-bold">
                    {profile.totalOrders || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center gap-2">
                    <DollarSign size={16} />
                    Tổng chi tiêu
                  </span>
                  <span className="text-gray-800 font-bold">
                    {formatCurrency(profile.totalSpent)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Calendar size={16} />
                    Đơn gần nhất
                  </span>
                  <span className="text-gray-800 text-sm">
                    {formatDate(profile.lastOrderDate)}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                Thành viên từ {formatDate(profile.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Information Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Thông tin chi tiết
              </h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg font-semibold transition-all shadow-md"
                >
                  <Edit2 size={16} />
                  Chỉnh sửa
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-gray-800 rounded-lg font-semibold transition-all shadow-md disabled:opacity-50"
                  >
                    <Save size={16} />
                    {saving ? "Đang lưu..." : "Lưu"}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-gray-800 rounded-lg font-semibold transition-all shadow-md disabled:opacity-50"
                  >
                    <X size={16} />
                    Hủy
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2 flex items-center gap-2">
                  <User size={16} />
                  Họ và tên
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white border border-teal-300 rounded-lg text-gray-800 placeholder-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 transition-all"
                    placeholder="Nhập họ và tên"
                  />
                ) : (
                  <p className="text-gray-800 text-lg">{profile.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2 flex items-center gap-2">
                  <Mail size={16} />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white border border-teal-300 rounded-lg text-gray-800 placeholder-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 transition-all"
                    placeholder="Nhập email"
                  />
                ) : (
                  <p className="text-gray-800 text-lg">
                    {profile.email || "Chưa cập nhật"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2 flex items-center gap-2">
                  <Phone size={16} />
                  Số điện thoại
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white border border-teal-300 rounded-lg text-gray-800 placeholder-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 transition-all"
                    placeholder="Nhập số điện thoại"
                  />
                ) : (
                  <p className="text-gray-800 text-lg">
                    {profile.phone || "Chưa cập nhật"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2 flex items-center gap-2">
                  <MapPin size={16} />
                  Địa chỉ
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 bg-white border border-teal-300 rounded-lg text-gray-800 placeholder-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 transition-all resize-none"
                    placeholder="Nhập địa chỉ"
                  />
                ) : (
                  <p className="text-gray-800 text-lg">
                    {profile.address || "Chưa cập nhật"}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <label className="block text-gray-600 text-sm font-medium mb-2">
                  Tên đăng nhập
                </label>
                <p className="text-gray-800 text-lg">{profile.username}</p>
                <p className="text-gray-500 text-xs mt-1">
                  Không thể thay đổi tên đăng nhập
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
