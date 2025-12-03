import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Users,
  DollarSign,
  ShoppingBag,
  Calendar,
} from "lucide-react";

interface Customer {
  _id: string;
  username: string;
  fullName: string;
  phone?: string;
  email?: string;
  address?: string;
  role: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  createdAt: string;
}

interface CustomerStats {
  totalCustomers: number;
  totalRevenue: number;
  avgOrderValue: number;
  avgOrdersPerCustomer?: number;
}

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [showOrderHistory, setShowOrderHistory] = useState(false);

  useEffect(() => {
    fetchCustomers();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(
        `http://localhost:3000/admin/customers?${params}`
      );
      const data = await response.json();

      if (data.success) {
        setCustomers(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/admin/customers/stats"
      );
      const data = await response.json();

      console.log("Stats response:", data);
      if (data.success && data.data.overview) {
        console.log("Setting stats:", data.data.overview);
        setStats(data.data.overview);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCustomers();
  };

  const viewOrderHistory = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowOrderHistory(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Chưa có";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            Quản lý Khách hàng
          </h1>
          <p className="text-gray-500 mt-1">
            Quản lý thông tin và lịch sử mua hàng của khách hàng
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 border border-teal-200/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Tổng khách hàng</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.totalCustomers || 0}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-4 rounded-xl">
                <Users className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 border border-teal-200/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {formatCurrency(stats.totalRevenue || 0)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-green-800 p-4 rounded-xl">
                <DollarSign className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 border border-teal-200/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Giá trị TB/Đơn</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {formatCurrency(stats.avgOrderValue || 0)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-600 to-orange-800 p-4 rounded-xl">
                <ShoppingBag className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 border border-teal-200/30">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, số điện thoại, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/50 border border-teal-200/50 rounded-lg text-gray-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            type="submit"
            className="btn-ocean px-6 py-3 rounded-lg font-medium"
          >
            Tìm kiếm
          </button>
        </form>
      </div>

      {/* Customers Table */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl border border-teal-200/30 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-teal-200/30 bg-white/20">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Khách hàng
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Liên hệ
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Đơn hàng
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Tổng chi tiêu
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Đơn cuối
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Ngày tham gia
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr
                      key={customer._id}
                      className="border-b border-teal-200/20 hover:bg-white/10 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-10 h-10 rounded-full flex items-center justify-center text-gray-800 font-semibold">
                            {customer.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {customer.fullName}
                            </p>
                            {customer.totalSpent > 50000000 && (
                              <span className="badge badge-gold text-xs mt-1">
                                VIP
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-gray-800">{customer.phone}</p>
                          {customer.email && (
                            <p className="text-gray-500 mt-1">
                              {customer.email}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <ShoppingBag
                            size={16}
                            className="text-ocean-blue-400"
                          />
                          <span className="font-semibold text-gray-800">
                            {customer.totalOrders}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-teal-600">
                          {formatCurrency(customer.totalSpent || 0)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={16} className="text-gray-500" />
                          {formatDate(customer.lastOrderDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {formatDate(customer.createdAt)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => viewOrderHistory(customer)}
                          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                          title="Xem lịch sử"
                        >
                          <Eye size={18} className="text-white" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-white/10 border-t border-teal-200/20 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Trang {page} / {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    <ChevronLeft size={20} className="text-white" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    <ChevronRight size={20} className="text-white" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order History Modal */}
      {showOrderHistory && selectedCustomer && (
        <OrderHistoryModal
          customer={selectedCustomer}
          onClose={() => {
            setShowOrderHistory(false);
            setSelectedCustomer(null);
          }}
        />
      )}
    </div>
  );
};

interface OrderHistoryModalProps {
  customer: Customer;
  onClose: () => void;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: Array<{ productName: string; quantity: number; price: number }>;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  customer,
  onClose,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrderHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/admin/customers/${customer.phone}/orders`
      );
      const data = await response.json();

      if (data.success) {
        setOrders(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching order history:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "badge-warning",
      confirmed: "badge-info",
      shipping: "badge-primary",
      delivered: "badge-success",
      cancelled: "badge-error",
    };
    return colors[status] || "badge-default";
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      shipping: "Đang giao",
      delivered: "Đã giao",
      cancelled: "Đã hủy",
    };
    return texts[status] || status;
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-teal-200/50 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-teal-200/30 bg-gradient-to-r from-blue-900/50 to-blue-800/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Lịch sử đơn hàng
              </h2>
              <p className="text-gray-600 mt-1">
                {customer.fullName} - {customer.phone}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-teal-50/50 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Khách hàng chưa có đơn hàng nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white/20 border border-teal-200/30 rounded-xl p-4 hover:bg-white/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-mono text-ocean-blue-400 font-semibold">
                        {order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(order.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`badge ${getStatusColor(order.orderStatus)}`}
                      >
                        {getStatusText(order.orderStatus)}
                      </span>
                      <span
                        className={`badge ${
                          order.paymentStatus === "paid"
                            ? "badge-success"
                            : "badge-warning"
                        }`}
                      >
                        {order.paymentStatus === "paid"
                          ? "Đã thanh toán"
                          : "Chưa thanh toán"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <p className="text-gray-600">
                          {item.productName}{" "}
                          <span className="text-slate-500">
                            x{item.quantity}
                          </span>
                        </p>
                        <p className="text-gray-800 font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-teal-200/30 flex items-center justify-between">
                    <p className="text-gray-500">Tổng cộng:</p>
                    <p className="text-xl font-bold text-teal-600">
                      {formatCurrency(order.totalAmount || 0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;
