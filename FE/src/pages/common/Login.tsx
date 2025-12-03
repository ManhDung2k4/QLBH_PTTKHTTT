import { loginUser } from "@/services/UserService";
import type { AppDispatch, RootState } from "@/store/store";
import { setUser } from "@/store/UserReducer";
import type { ApiResponse } from "@/types/Response";
import type { User } from "@/types/User";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (!user) return;
    if (user.role === "user") navigate("/home");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response: ApiResponse<User> = await loginUser(username, password);
      if (response.success && response.data) {
        dispatch(setUser(response.data));
      }
    } catch (error: any) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white relative flex items-center justify-center">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #14b8a6 100%)`,
          backgroundSize: "100% 100%",
        }}
      />
      <div className="relative z-10 bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-2xl w-full max-w-md border border-teal-200">
        <div className="text-center mb-6">
          <div className="inline-block p-4 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full shadow-lg mb-4">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Đăng nhập</h1>
          <p className="text-gray-600 mt-2">Chào mừng đến với PhoneStore</p>
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-teal-300 bg-white py-3 px-4 text-gray-800 placeholder-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 transition-all"
              placeholder="Nhập tên đăng nhập của bạn"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-teal-300 bg-white py-3 px-4 text-gray-800 placeholder-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 transition-all"
              placeholder="Nhập mật khẩu của bạn"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:shadow-teal-500/50 transform hover:-translate-y-0.5"
          >
            Đăng nhập
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Chưa có tài khoản?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-teal-600 hover:text-teal-700 font-semibold transition-colors"
            >
              Đăng ký ngay
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
