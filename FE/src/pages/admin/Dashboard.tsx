import { useEffect, useState } from "react";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  AlertTriangle,
  Activity,
} from "lucide-react";

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalCustomers: number;
  avgOrderValue: number;
}

interface BestSellingProduct {
  _id: string;
  productName: string;
  productImage: string;
  totalQuantity: number;
  totalRevenue: number;
}

interface RevenueData {
  _id: { year: number; month: number; day?: number };
  totalRevenue: number;
  totalOrders: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [bestSelling, setBestSelling] = useState<BestSellingProduct[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [customerStats, setCustomerStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [orderStats, bestSellingRes, revenueRes, customerRes] =
        await Promise.all([
          fetch("http://localhost:3000/admin/orders/stats").then((r) =>
            r.json()
          ),
          fetch("http://localhost:3000/admin/orders/best-selling?limit=5").then(
            (r) => r.json()
          ),
          fetch(
            "http://localhost:3000/admin/orders/revenue?period=day&limit=7"
          ).then((r) => r.json()),
          fetch("http://localhost:3000/admin/customers/stats").then((r) =>
            r.json()
          ),
        ]);

      console.log("Dashboard data:", {
        orderStats,
        bestSellingRes,
        revenueRes,
        customerRes,
      });

      if (orderStats.success) setStats(orderStats.data);
      if (bestSellingRes.success) {
        console.log("Best selling products:", bestSellingRes.data);
        setBestSelling(bestSellingRes.data);
      }
      if (revenueRes.success) setRevenueData(revenueRes.data.slice(0, 7));
      if (customerRes.success) setCustomerStats(customerRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Tổng quan hoạt động cửa hàng điện thoại</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
              <DollarSign className="text-white" size={24} />
            </div>
            <span className="text-green-600 text-sm font-bold bg-green-50 px-3 py-1 rounded-full">
              +12.5%
            </span>
          </div>
          <h3 className="text-gray-600 text-sm mb-1 font-medium">
            Tổng doanh thu
          </h3>
          <p className="text-2xl font-bold text-gray-800">
            {formatPrice(stats?.totalRevenue || 0)}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
              <ShoppingCart className="text-white" size={24} />
            </div>
            <span className="text-blue-600 text-sm font-bold bg-blue-50 px-3 py-1 rounded-full">
              {stats?.pendingOrders || 0} chờ
            </span>
          </div>
          <h3 className="text-gray-600 text-sm mb-1 font-medium">
            Tổng đơn hàng
          </h3>
          <p className="text-2xl font-bold text-gray-800">
            {stats?.totalOrders || 0}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl shadow-lg">
              <Users className="text-white" size={24} />
            </div>
            <span className="text-purple-600 text-sm font-bold bg-purple-50 px-3 py-1 rounded-full">
              Khách hàng
            </span>
          </div>
          <h3 className="text-gray-600 text-sm mb-1 font-medium">
            Tổng khách hàng
          </h3>
          <p className="text-2xl font-bold text-gray-800">
            {customerStats?.overview.totalCustomers || 0}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl shadow-lg">
              <Activity className="text-white" size={24} />
            </div>
            <span className="text-orange-600 text-sm font-bold bg-orange-50 px-3 py-1 rounded-full">
              TB
            </span>
          </div>
          <h3 className="text-gray-600 text-sm mb-1 font-medium">
            Giá trị đơn TB
          </h3>
          <p className="text-2xl font-bold text-gray-800">
            {formatPrice(customerStats?.overview.avgOrderValue || 0)}
          </p>
        </div>
      </div>

      {/* Charts & Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
          <h3 className="text-gray-800 font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="text-teal-600" size={20} />
            Doanh thu 7 ngày gần nhất
          </h3>
          <div className="space-y-3">
            {revenueData.map((item, index) => {
              const maxRevenue = Math.max(
                ...revenueData.map((d) => d.totalRevenue)
              );
              const percentage = (item.totalRevenue / maxRevenue) * 100;
              return (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 font-medium">
                      {item._id.day}/{item._id.month}/{item._id.year}
                    </span>
                    <span className="text-gray-800 font-bold">
                      {formatPrice(item.totalRevenue)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-teal-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best Selling Products */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
          <h3 className="text-gray-800 font-bold text-lg mb-4 flex items-center gap-2">
            <Package className="text-teal-600" size={20} />
            Sản phẩm bán chạy nhất
          </h3>
          <div className="space-y-3">
            {bestSelling.map((product, index) => (
              <div
                key={product._id}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-teal-50 border border-gray-200 hover:border-teal-300 transition-all"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                  {index + 1}
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                  {product.productImage ? (
                    <img
                      src={product.productImage}
                      alt={product.productName}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-2xl">📱</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 font-semibold text-sm line-clamp-1">
                    {product.productName}
                  </p>
                  <p className="text-gray-600 text-xs">
                    Đã bán: {product.totalQuantity} sản phẩm
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-teal-600 font-bold text-sm">
                    {formatPrice(product.totalRevenue)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Status & Top Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
          <h3 className="text-gray-800 font-bold text-lg mb-4 flex items-center gap-2">
            <ShoppingCart className="text-teal-600" size={20} />
            Trạng thái đơn hàng
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-yellow-50 border-2 border-yellow-200">
              <div>
                <p className="text-yellow-700 text-sm font-medium">Chờ xử lý</p>
                <p className="text-gray-800 text-2xl font-bold">
                  {stats?.pendingOrders || 0}
                </p>
              </div>
              <AlertTriangle className="text-yellow-600" size={32} />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 border-2 border-green-200">
              <div>
                <p className="text-green-700 text-sm font-medium">Hoàn thành</p>
                <p className="text-gray-800 text-2xl font-bold">
                  {stats?.completedOrders || 0}
                </p>
              </div>
              <Package className="text-green-600" size={32} />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border-2 border-red-200">
              <div>
                <p className="text-red-700 text-sm font-medium">Đã hủy</p>
                <p className="text-gray-800 text-2xl font-bold">
                  {stats?.cancelledOrders || 0}
                </p>
              </div>
              <AlertTriangle className="text-red-600" size={32} />
            </div>
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
          <h3 className="text-gray-800 font-bold text-lg mb-4 flex items-center gap-2">
            <Users className="text-teal-600" size={20} />
            Khách hàng VIP
          </h3>
          <div className="space-y-3">
            {customerStats?.topCustomers
              .slice(0, 5)
              .map((customer: any, index: number) => (
                <div
                  key={customer.phone || index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 hover:border-purple-400 transition-all"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {customer.fullName?.charAt(0) || "K"}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-semibold text-sm">
                      {customer.fullName || "Khách hàng"}
                    </p>
                    <p className="text-gray-600 text-xs">
                      {customer.phone} • {customer.totalOrders} đơn
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-purple-600 font-bold text-sm">
                      {formatPrice(customer.totalSpent)}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
