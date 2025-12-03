import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import {
  LuFacebook,
  LuInstagram,
  LuLayoutDashboard,
  LuShoppingBag,
  LuTwitter,
  LuUser,
} from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { logout } from "@/store/UserReducer";

const ClientLayout: React.FC = () => {
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user.user);

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-white relative flex flex-col">
      {/* Teal Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #14b8a6 100%)`,
          backgroundSize: "100% 100%",
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="bg-white/80 backdrop-blur-md border-b border-teal-200/50 shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <NavLink to="/" className="flex items-center gap-3 group">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-3 rounded-xl group-hover:shadow-lg group-hover:shadow-teal-500/50 transition-all">
                  <LuShoppingBag className="text-white" size={28} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    PhoneStore
                  </h1>
                  <p className="text-xs text-teal-600">Điện thoại chính hãng</p>
                </div>
              </NavLink>

              {/* Navigation Menu */}
              <nav className="hidden lg:flex items-center gap-6">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `relative py-2 px-4 font-semibold transition-colors ${
                      isActive
                        ? "text-teal-600"
                        : "text-gray-700 hover:text-teal-600"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      Trang chủ
                      {isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-teal-500 to-teal-600" />
                      )}
                    </>
                  )}
                </NavLink>
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `relative py-2 px-4 font-semibold transition-colors ${
                      isActive
                        ? "text-teal-600"
                        : "text-gray-700 hover:text-teal-600"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      Giỏ hàng
                      {isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-teal-500 to-teal-600" />
                      )}
                    </>
                  )}
                </NavLink>
                <NavLink
                  to="/invoice"
                  className={({ isActive }) =>
                    `relative py-2 px-4 font-semibold transition-colors ${
                      isActive
                        ? "text-teal-600"
                        : "text-gray-700 hover:text-teal-600"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      Hóa đơn
                      {isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-teal-500 to-teal-600" />
                      )}
                    </>
                  )}
                </NavLink>
                {user && (
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `relative py-2 px-4 font-semibold transition-colors ${
                        isActive
                          ? "text-teal-600"
                          : "text-gray-700 hover:text-teal-600"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        Thông tin cá nhân
                        {isActive && (
                          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-teal-500 to-teal-600" />
                        )}
                      </>
                    )}
                  </NavLink>
                )}
              </nav>

              {/* <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full py-3 px-5 pr-12 rounded-lg bg-blue-800 border border-blue-700 text-white placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600 transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-700 text-white p-2 rounded-lg hover:bg-slate-600 transition-colors">
                  <LuSearch size={20} />
                </button>
              </div>
            </div> */}

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {user?.role === "admin" && (
                  <button
                    onClick={() => navigate("/admin")}
                    className="text-white hover:shadow-lg transition-all flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 px-4 py-2 rounded-lg font-semibold shadow-md"
                  >
                    <LuLayoutDashboard size={18} /> Quản trị
                  </button>
                )}

                <button
                  onClick={() => (user ? handleLogout() : navigate("/login"))}
                  className="text-white hover:shadow-lg transition-all flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 px-4 py-2 rounded-lg font-semibold shadow-md"
                >
                  <LuUser size={18} /> {user ? "Đăng xuất" : "Đăng nhập"}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-8">
          <Outlet />
        </main>

        <section className="bg-white/60 backdrop-blur-sm border-y border-teal-200/50 py-12">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Đăng ký nhận bản tin
            </h2>
            <p className="mb-6 text-gray-600">
              Nhận các ưu đãi và cập nhật mới nhất về điện thoại chính hãng
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 py-3 px-5 rounded-lg bg-white border border-teal-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
              <button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all">
                Đăng ký
              </button>
            </div>
          </div>
        </section>

        <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
          <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-white font-bold text-lg mb-4">
                  Về PhoneStore
                </h3>
                <p className="text-sm leading-relaxed">
                  Cửa hàng điện thoại chính hãng đáng tin cậy với giá tốt nhất
                  thị trường. Cam kết 100% chính hãng, bảo hành toàn quốc.
                </p>
              </div>

              <div>
                <h3 className="text-white font-bold text-lg mb-4">
                  Hỗ trợ khách hàng
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="#"
                      className="hover:text-teal-400 transition-colors"
                    >
                      Chính sách bảo hành
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-teal-400 transition-colors"
                    >
                      Hướng dẫn mua hàng
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-teal-400 transition-colors"
                    >
                      Câu hỏi thường gặp
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-teal-400 transition-colors"
                    >
                      Liên hệ: 1900-2600
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-bold text-lg mb-4">
                  Chính sách
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="#"
                      className="hover:text-teal-400 transition-colors"
                    >
                      Chính sách đổi trả
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-teal-400 transition-colors"
                    >
                      Chính sách bảo mật
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-teal-400 transition-colors"
                    >
                      Điều khoản sử dụng
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-teal-400 transition-colors"
                    >
                      Vận chuyển - Giao hàng
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-bold text-lg mb-4">
                  Kết nối với chúng tôi
                </h3>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="bg-gray-800 p-3 text-center rounded-lg hover:bg-teal-600 transition-colors"
                  >
                    <LuFacebook size={20} />
                  </a>
                  <a
                    href="#"
                    className="bg-gray-800 p-3 rounded-lg hover:bg-teal-600 transition-colors"
                  >
                    <LuTwitter size={20} />
                  </a>
                  <a
                    href="#"
                    className="bg-gray-800 p-3 rounded-lg hover:bg-teal-600 transition-colors"
                  >
                    <LuInstagram size={20} />
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
              <p>
                &copy; 2025 PhoneStore. Bảo lưu mọi quyền. - Điện thoại chính
                hãng giá tốt nhất
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ClientLayout;
