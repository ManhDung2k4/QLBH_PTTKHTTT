import React, { useEffect, useState } from "react";
import {
  MdShoppingCart,
  MdPeople,
  MdReceipt,
  MdTrendingUp,
  MdCheckCircle,
  MdPending,
  MdLocalShipping,
} from "react-icons/md";

interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
  };
  orderStatus: string;
  finalAmount: number;
  createdAt: string;
}

const StaffDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    pendingOrders: 0,
    processingOrders: 0,
    completedToday: 0,
    totalCustomers: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch tất cả đơn hàng
      const ordersResponse = await fetch(
        "http://localhost:3000/admin/orders?limit=100"
      );
      const ordersData = await ordersResponse.json();

      // Fetch tất cả users để đếm customers
      const usersResponse = await fetch(
        "http://localhost:3000/admin/users?limit=1000"
      );
      const usersData = await usersResponse.json();

      if (ordersData.success && usersData.success) {
        const orders = ordersData.data || [];
        const users = usersData.data || [];

        // Đếm khách hàng (role = "user")
        const totalCustomers = users.filter(
          (u: any) => u.role === "user"
        ).length;

        // Đếm đơn hàng theo trạng thái
        const pendingOrders = orders.filter(
          (o: any) => o.orderStatus === "pending"
        ).length;
        const processingOrders = orders.filter(
          (o: any) =>
            o.orderStatus === "confirmed" || o.orderStatus === "shipping"
        ).length;

        // Đếm đơn hoàn thành hôm nay
        const today = new Date().toISOString().split("T")[0];
        const completedToday = orders.filter((o: any) => {
          if (o.orderStatus !== "delivered") return false;
          const orderDate = new Date(o.updatedAt).toISOString().split("T")[0];
          return orderDate === today;
        }).length;

        setStats({
          pendingOrders,
          processingOrders,
          completedToday,
          totalCustomers,
        });

        // Lấy 3 đơn hàng gần nhất
        const recent = orders.slice(0, 3);
        setRecentOrders(recent);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${diffDays} ngày trước`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium flex items-center gap-1">
            <MdPending size={16} />
            Chờ duyệt
          </span>
        );
      case "confirmed":
        return (
          <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium flex items-center gap-1">
            <MdCheckCircle size={16} />
            Đã duyệt
          </span>
        );
      case "shipping":
        return (
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center gap-1">
            <MdLocalShipping size={16} />
            Đang giao
          </span>
        );
      case "delivered":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
            <MdCheckCircle size={16} />
            Hoàn thành
          </span>
        );
      case "cancelled":
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            Đã hủy
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Bảng điều khiển</h2>
        <p className="text-gray-500 mt-1">Tổng quan công việc hôm nay</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Đơn chờ duyệt</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {stats.pendingOrders}
              </p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <MdPending className="text-yellow-600" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Đang xử lý</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {stats.processingOrders}
              </p>
            </div>
            <div className="bg-teal-100 p-4 rounded-lg">
              <MdShoppingCart className="text-teal-600" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Hoàn thành hôm nay
              </p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {stats.completedToday}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <MdCheckCircle className="text-green-600" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Tổng khách hàng
              </p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {stats.totalCustomers}
              </p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <MdPeople className="text-purple-600" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">Đơn hàng gần đây</h3>
          <a
            href="/staff/orders"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Xem tất cả →
          </a>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Đang tải dữ liệu...
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Chưa có đơn hàng nào
            </div>
          ) : (
            recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-teal-100 p-3 rounded-lg">
                    <MdShoppingCart className="text-teal-600" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {order.orderNumber}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.customer.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-bold text-gray-800">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(order.finalAmount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {getTimeAgo(order.createdAt)}
                    </p>
                  </div>
                  {getStatusBadge(order.orderStatus)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          href="/staff/orders"
          className="bg-gradient-to-br from-teal-500 to-teal-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <div className="flex items-center gap-4">
            <MdShoppingCart size={40} />
            <div>
              <p className="font-bold text-lg">Quản lý đơn hàng</p>
              <p className="text-teal-100 text-sm">Xử lý đơn hàng mới</p>
            </div>
          </div>
        </a>

        <a
          href="/staff/customers"
          className="bg-gradient-to-br from-teal-400 to-teal-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <div className="flex items-center gap-4">
            <MdPeople size={40} />
            <div>
              <p className="font-bold text-lg">Tra cứu khách hàng</p>
              <p className="text-teal-100 text-sm">Xem thông tin khách hàng</p>
            </div>
          </div>
        </a>

        <a
          href="/staff/invoice"
          className="bg-gradient-to-br from-teal-600 to-teal-700 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <div className="flex items-center gap-4">
            <MdReceipt size={40} />
            <div>
              <p className="font-bold text-lg">Quản lý hóa đơn</p>
              <p className="text-teal-100 text-sm">Xuất và in hóa đơn</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default StaffDashboard;
