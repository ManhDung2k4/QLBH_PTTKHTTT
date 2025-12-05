import { Routes, Route, Navigate } from "react-router-dom";
import ClientLayout from "@/layouts/ClientLayout";
import AdminLayout from "@/layouts/AdminLayout";
import StaffLayout from "@/layouts/StaffLayout";
import HomePage from "@/pages/client/Home";
import Login from "@/pages/common/Login";
import Register from "@/pages/common/Register";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Product from "./pages/admin/Product";
import EditProduct from "./pages/admin/EditProduct";
import CreateProduct from "./pages/admin/CreateProduct";
import Dashboard from "./pages/admin/Dashboard";
import OrderManagement from "./pages/admin/OrderManagement";
import CustomerManagement from "./pages/admin/CustomerManagement";
import StaffDashboard from "./pages/staff/Dashboard";

import CartPage from "@/pages/client/Cart";
import ClientInvoice from "@/pages/client/Invoice";
import AdminInvoice from "@/pages/admin/Invoice";
import UserManagement from "@/pages/admin/User";
import ProfilePage from "@/pages/client/Profile";

function App() {
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user ? (
            <Navigate
              to={
                user.role === "admin"
                  ? "/admin"
                  : user.role === "staff"
                  ? "/staff"
                  : "/"
              }
            />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" /> : <Register />}
      />

      {/* Client Routes - chỉ cho user hoặc chưa đăng nhập */}
      <Route element={<ClientLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/cart"
          element={
            user?.role === "user" ? <CartPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/invoice"
          element={
            user?.role === "user" ? <ClientInvoice /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/profile"
          element={
            user?.role === "user" ? <ProfilePage /> : <Navigate to="/login" />
          }
        />
      </Route>

      {/* Admin Routes */}
      {user?.role === "admin" && (
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Product />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="products/new" element={<CreateProduct />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="invoice" element={<AdminInvoice />} />
          <Route path="users" element={<UserManagement />} />
        </Route>
      )}

      {/* Staff Routes */}
      {user?.role === "staff" && (
        <Route path="/staff" element={<StaffLayout />}>
          <Route index element={<StaffDashboard />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="invoice" element={<AdminInvoice />} />
        </Route>
      )}

      {/* Redirect based on role */}
      <Route
        path="*"
        element={
          <Navigate
            to={
              user?.role === "admin"
                ? "/admin"
                : user?.role === "staff"
                ? "/staff"
                : "/"
            }
          />
        }
      />
    </Routes>
  );
}

export default App;
