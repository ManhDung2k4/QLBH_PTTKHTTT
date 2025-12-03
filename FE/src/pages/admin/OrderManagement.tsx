import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Package,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  totalAmount: number;
  finalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, searchQuery]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(searchQuery && { orderNumber: searchQuery }),
      });

      const response = await fetch(
        `http://localhost:3000/admin/orders?${params}`
      );
      const data = await response.json();

      if (data.success) {
        setOrders(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("vi-VN");
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<
      string,
      { bg: string; text: string; icon: React.ElementType }
    > = {
      pending: {
        bg: "bg-yellow-100 border-yellow-300",
        text: "text-yellow-700",
        icon: Clock,
      },
      confirmed: {
        bg: "bg-blue-100 border-blue-300",
        text: "text-blue-700",
        icon: Package,
      },
      shipping: {
        bg: "bg-purple-100 border-purple-300",
        text: "text-purple-700",
        icon: Package,
      },
      delivered: {
        bg: "bg-green-100 border-green-300",
        text: "text-green-700",
        icon: CheckCircle,
      },
      cancelled: {
        bg: "bg-red-100 border-red-300",
        text: "text-red-700",
        icon: XCircle,
      },
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    const labels: Record<string, string> = {
      pending: "Chờ xử lý",
      confirmed: "Đã xác nhận",
      shipping: "Đang giao",
      delivered: "Hoàn thành",
      cancelled: "Đã hủy",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg} ${badge.text} flex items-center gap-1 w-fit`}
      >
        <Icon size={14} />
        {labels[status]}
      </span>
    );
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/admin/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        fetchOrders();
        alert("Cập nhật trạng thái thành công!");
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Quản lý đơn hàng
        </h1>
        <p className="text-gray-600">
          Theo dõi và xử lý đơn hàng từ khách hàng
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm theo mã đơn hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border-2 border-gray-300 text-gray-800 placeholder-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-lg bg-white border-2 border-gray-300 text-gray-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="shipping">Đang giao</option>
            <option value="delivered">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-teal-500 to-teal-600 border-b-2 border-teal-700">
              <tr>
                <th className="px-6 py-4 text-left text-white font-semibold">
                  Mã đơn
                </th>
                <th className="px-6 py-4 text-left text-white font-semibold">
                  Khách hàng
                </th>
                <th className="px-6 py-4 text-left text-white font-semibold">
                  Tổng tiền
                </th>
                <th className="px-6 py-4 text-left text-white font-semibold">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-white font-semibold">
                  Thanh toán
                </th>
                <th className="px-6 py-4 text-left text-white font-semibold">
                  Ngày tạo
                </th>
                <th className="px-6 py-4 text-left text-white font-semibold">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="spinner mx-auto"></div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-600 font-medium"
                  >
                    Không tìm thấy đơn hàng
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-200 hover:bg-teal-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-gray-800 font-mono font-semibold">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-gray-800 font-semibold">
                          {order.customer.name}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {order.customer.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-teal-600 font-bold">
                        {formatPrice(order.finalAmount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.orderStatus)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          order.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                        }`}
                      >
                        {order.paymentStatus === "paid"
                          ? "Đã thanh toán"
                          : "Chưa thanh toán"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 text-sm font-medium">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            window.open(
                              `/admin/invoice?orderId=${order._id}`,
                              "_blank"
                            )
                          }
                          className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors shadow-md"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                        {order.orderStatus === "pending" && (
                          <button
                            onClick={() =>
                              updateOrderStatus(order._id, "confirmed")
                            }
                            className="px-3 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-semibold shadow-md"
                          >
                            Xác nhận
                          </button>
                        )}
                        {order.orderStatus === "confirmed" && (
                          <button
                            onClick={() =>
                              updateOrderStatus(order._id, "shipping")
                            }
                            className="px-3 py-1 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-xs font-semibold shadow-md"
                          >
                            Giao hàng
                          </button>
                        )}
                        {order.orderStatus === "shipping" && (
                          <button
                            onClick={() =>
                              updateOrderStatus(order._id, "delivered")
                            }
                            className="px-3 py-1 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold shadow-md"
                          >
                            Hoàn thành
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t-2 border-gray-200 bg-gray-50 flex items-center justify-between">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold transition-colors shadow-md"
            >
              Trang trước
            </button>
            <span className="text-gray-700 font-semibold">
              Trang {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold transition-colors shadow-md"
            >
              Trang sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
