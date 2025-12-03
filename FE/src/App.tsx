import { Routes, Route, Navigate } from "react-router-dom";
import ClientLayout from "@/layouts/ClientLayout";
import AdminLayout from "@/layouts/AdminLayout";
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

import CartPage from "@/pages/client/Cart";
import ClientInvoice from "@/pages/client/Invoice";
import AdminInvoice from "@/pages/admin/Invoice";
import UserManagement from "@/pages/admin/User";
import ProfilePage from "@/pages/client/Profile";

function App() {
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route
        path="/register"
        element={user ? <Navigate to="/" /> : <Register />}
      />

      <Route element={<ClientLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/invoice" element={<ClientInvoice />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

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

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
