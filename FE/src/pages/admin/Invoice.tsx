import React, { useState, useEffect } from "react";
import {
  FaFileInvoice,
  FaSearch,
  FaPrint,
  FaEye,
  FaFilter,
} from "react-icons/fa";

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
  };
  items: OrderItem[];
  totalAmount: number;
  finalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
}

const AdminInvoice: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter, paymentFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(statusFilter && { status: statusFilter }),
        ...(paymentFilter && { paymentStatus: paymentFilter }),
      });

      const response = await fetch(
        `http://localhost:3000/admin/orders?${params}`
      );
      const data = await response.json();

      if (data.success) {
        setOrders(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { text: string; class: string }> = {
      pending: {
        text: "Chờ xác nhận",
        class: "bg-yellow-500/20 text-yellow-400",
      },
      confirmed: { text: "Đã xác nhận", class: "bg-blue-500/20 text-blue-400" },
      shipping: {
        text: "Đang giao",
        class: "bg-purple-500/20 text-purple-400",
      },
      delivered: { text: "Đã giao", class: "bg-green-500/20 text-green-400" },
      cancelled: { text: "Đã hủy", class: "bg-red-500/20 text-red-400" },
    };

    const config = statusConfig[status] || {
      text: status,
      class: "bg-gray-500/20 text-gray-400",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const getPaymentBadge = (status: string) => {
    return status === "paid" ? (
      <span className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400">
        Đã thanh toán
      </span>
    ) : (
      <span className="px-3 py-1 rounded-full text-sm bg-orange-500/20 text-orange-400">
        Chưa thanh toán
      </span>
    );
  };

  const printInvoice = (order: Order) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Hóa đơn ${order.orderNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Arial', sans-serif; padding: 40px; background: white; color: #333; }
          .invoice-header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #0c4a6e; padding-bottom: 20px; }
          .company-name { font-size: 28px; font-weight: bold; color: #0c4a6e; margin-bottom: 5px; }
          .company-info { font-size: 14px; color: #666; }
          .invoice-title { font-size: 24px; font-weight: bold; margin: 20px 0; text-align: center; color: #0c4a6e; }
          .invoice-details { display: flex; justify-content: space-between; margin: 20px 0; }
          .detail-section { flex: 1; }
          .detail-label { font-weight: bold; color: #0c4a6e; margin-bottom: 5px; }
          .detail-value { margin-bottom: 10px; color: #333; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background: #0c4a6e; color: white; padding: 12px; text-align: left; font-weight: bold; }
          td { padding: 10px; border-bottom: 1px solid #ddd; }
          tr:hover { background: #f5f5f5; }
          .text-right { text-align: right; }
          .total-section { margin-top: 20px; text-align: right; }
          .total-row { display: flex; justify-content: flex-end; padding: 8px 0; }
          .total-label { width: 150px; font-weight: bold; }
          .total-value { width: 200px; text-align: right; }
          .grand-total { font-size: 20px; color: #0c4a6e; border-top: 2px solid #0c4a6e; padding-top: 10px; margin-top: 10px; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <div class="company-name">PHONESTORE</div>
          <div class="company-info">Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</div>
          <div class="company-info">Hotline: 1900 xxxx | Email: contact@phonestore.vn</div>
        </div>

        <div class="invoice-title">HÓA ĐƠN BÁN HÀNG</div>

        <div class="invoice-details">
          <div class="detail-section">
            <div class="detail-label">Mã đơn hàng:</div>
            <div class="detail-value">${order.orderNumber}</div>
            <div class="detail-label">Ngày đặt hàng:</div>
            <div class="detail-value">${formatDate(order.createdAt)}</div>
            <div class="detail-label">Phương thức thanh toán:</div>
            <div class="detail-value">${order.paymentMethod || "COD"}</div>
          </div>
          <div class="detail-section">
            <div class="detail-label">Khách hàng:</div>
            <div class="detail-value">${order.customer.name}</div>
            <div class="detail-label">Số điện thoại:</div>
            <div class="detail-value">${order.customer.phone}</div>
            <div class="detail-label">Địa chỉ:</div>
            <div class="detail-value">${order.customer.address}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên sản phẩm</th>
              <th class="text-right">Đơn giá</th>
              <th class="text-right">Số lượng</th>
              <th class="text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${order.items
              .map(
                (item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.productName}</td>
                <td class="text-right">${formatPrice(item.price)}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">${formatPrice(
                  item.price * item.quantity
                )}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="total-section">
          <div class="total-row">
            <div class="total-label">Tạm tính:</div>
            <div class="total-value">${formatPrice(order.totalAmount)}</div>
          </div>
          <div class="total-row">
            <div class="total-label">Phí vận chuyển:</div>
            <div class="total-value">Miễn phí</div>
          </div>
          <div class="total-row grand-total">
            <div class="total-label">Tổng cộng:</div>
            <div class="total-value">${formatPrice(order.finalAmount)}</div>
          </div>
        </div>

        <div class="footer">
          <p>Cảm ơn quý khách đã mua hàng tại PhoneStore!</p>
          <p>Mọi thắc mắc vui lòng liên hệ hotline: 1900 xxxx</p>
        </div>
        
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.phone.includes(searchTerm)
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-3 rounded-lg">
            <FaFileInvoice className="text-gray-800 text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quản lý hóa đơn</h1>
            <p className="text-gray-500 text-sm">Xem và in hóa đơn đơn hàng</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl border border-teal-200/30 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm theo mã đơn, tên, SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 border border-teal-200/50 rounded-lg text-gray-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-white/50 border border-teal-200/50 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="shipping">Đang giao</option>
              <option value="delivered">Đã giao</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-white/50 border border-teal-200/50 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Tất cả thanh toán</option>
              <option value="paid">Đã thanh toán</option>
              <option value="unpaid">Chưa thanh toán</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl border border-teal-200/30 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="spinner mx-auto"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <FaFileInvoice className="mx-auto text-slate-600 mb-4" size={64} />
            <p className="text-gray-500">Không tìm thấy hóa đơn nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/50 border-b border-teal-200/30">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Mã đơn
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Khách hàng
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Ngày đặt
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Thanh toán
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-800/30">
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-white/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-ocean-blue-400 font-semibold">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-800 font-medium">
                        {order.customer.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.customer.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-green-400 font-semibold">
                      {formatPrice(order.finalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.orderStatus)}
                    </td>
                    <td className="px-6 py-4">
                      {getPaymentBadge(order.paymentStatus)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 hover:bg-teal-50/50 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
                          title="Xem chi tiết"
                        >
                          <FaEye size={18} />
                        </button>
                        <button
                          onClick={() => printInvoice(order)}
                          className="p-2 hover:bg-teal-50/50 rounded-lg transition-colors text-green-400 hover:text-green-300"
                          title="In hóa đơn"
                        >
                          <FaPrint size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-teal-200/30">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-800/50 text-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-50/50 transition-colors"
            >
              Trước
            </button>
            <span className="text-gray-600">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-800/50 text-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-50/50 transition-colors"
            >
              Sau
            </button>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white/90 backdrop-blur-md rounded-2xl border border-teal-200/30 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Chi tiết hóa đơn</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-800"
              >
                <svg
                  className="w-6 h-6"
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

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Mã đơn hàng</div>
                  <div className="text-gray-800 font-mono font-semibold">
                    {selectedOrder.orderNumber}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Ngày đặt</div>
                  <div className="text-gray-800">
                    {formatDate(selectedOrder.createdAt)}
                  </div>
                </div>
              </div>

              <div className="border-t border-teal-200/30 pt-4">
                <h4 className="text-gray-800 font-semibold mb-2">
                  Thông tin khách hàng
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="text-gray-600">
                    Tên:{" "}
                    <span className="text-gray-800">
                      {selectedOrder.customer.name}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    SĐT:{" "}
                    <span className="text-gray-800">
                      {selectedOrder.customer.phone}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    Địa chỉ:{" "}
                    <span className="text-gray-800">
                      {selectedOrder.customer.address}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-teal-200/30 pt-4">
                <h4 className="text-gray-800 font-semibold mb-2">Sản phẩm</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.productName} x{item.quantity}
                      </span>
                      <span className="text-gray-800 font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-teal-200/30 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-800">Tổng cộng:</span>
                  <span className="text-green-400">
                    {formatPrice(selectedOrder.finalAmount)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => printInvoice(selectedOrder)}
                  className="flex-1 btn-ocean py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  <FaPrint /> In hóa đơn
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2 bg-blue-700 hover:bg-slate-600 text-gray-800 rounded-lg transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInvoice;
