import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdInventory,
  MdLogout,
  MdMenu,
  MdClose,
  MdPerson,
  MdKeyboardArrowDown,
  MdHome,
  MdShoppingCart,
  MdPeople,
  MdReceipt,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/UserReducer";
import type { RootState } from "@/store/store";

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-white relative flex">
      {/* Teal Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #14b8a6 100%)`,
          backgroundSize: "100% 100%",
        }}
      />

      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white/80 backdrop-blur-md border-r border-teal-200/50 transition-all duration-300 flex flex-col fixed h-full z-20 shadow-lg`}
      >
        <div className="p-4 border-b border-teal-200/50">
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-2 rounded-lg shadow-lg">
                  <MdInventory className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold text-gray-800">
                  PhoneStore Admin
                </span>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-2 rounded-lg mx-auto shadow-lg">
                <MdInventory className="text-white" size={24} />
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
              }`
            }
          >
            <MdHome size={20} />
            {sidebarOpen && <span className="font-medium">Trang chủ</span>}
          </NavLink>

          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
              }`
            }
          >
            <MdDashboard size={20} />
            {sidebarOpen && <span className="font-medium">Dashboard</span>}
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
              }`
            }
          >
            <MdInventory size={20} />
            {sidebarOpen && <span className="font-medium">Sản phẩm</span>}
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
              }`
            }
          >
            <MdShoppingCart size={20} />
            {sidebarOpen && <span className="font-medium">Đơn hàng</span>}
          </NavLink>

          <NavLink
            to="/admin/customers"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
              }`
            }
          >
            <MdPeople size={20} />
            {sidebarOpen && <span className="font-medium">Khách hàng</span>}
          </NavLink>

          <NavLink
            to="/admin/invoice"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
              }`
            }
          >
            <MdReceipt size={20} />
            {sidebarOpen && <span className="font-medium">Hóa đơn</span>}
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
              }`
            }
          >
            <MdPerson size={20} />
            {sidebarOpen && <span className="font-medium">Người dùng</span>}
          </NavLink>
        </nav>

        <div className="p-4 border-t border-teal-200/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all w-full"
          >
            <MdLogout size={20} />
            {sidebarOpen && <span className="font-medium">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      <div
        className={`flex-1 flex flex-col transition-all duration-300 relative z-10 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <header className="bg-white/80 backdrop-blur-md border-b border-teal-200/50 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-700 hover:text-teal-600 transition-colors"
              >
                {sidebarOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
              </button>
              <h1 className="text-xl font-semibold text-gray-800">
                Quản lý cửa hàng
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition-colors"
                >
                  <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-2 rounded-lg shadow-md">
                    <MdPerson size={20} className="text-white" />
                  </div>
                  <span className="font-medium hidden md:block">
                    {user?.fullName || "Admin"}
                  </span>
                  <MdKeyboardArrowDown
                    size={20}
                    className={`transition-transform ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-teal-200 rounded-lg shadow-xl overflow-hidden">
                    <a
                      href="#"
                      className="block px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <MdPerson size={18} />
                        <span>Tài khoản</span>
                      </div>
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <MdLogout size={18} />
                        <span>Đăng xuất</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        <footer className="bg-white/60 backdrop-blur-sm border-t border-teal-200/50 py-4 px-6">
          <div className="text-center text-gray-600 text-sm">
            &copy; 2025 PhoneStore Admin Dashboard. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
