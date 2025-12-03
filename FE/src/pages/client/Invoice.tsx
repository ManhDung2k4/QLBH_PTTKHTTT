import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import {
  FileText,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  CheckCircle,
  Eye,
  ShoppingBag,
} from "lucide-react";

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

const ClientInvoice: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const [order, setOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    } else if (user) {
      fetchUserOrders();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, user]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/admin/orders?phone=${user?.phone || ""}`
      );
      const data = await response.json();

      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrder = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/admin/orders/${orderId}`
      );
      const data = await response.json();

      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
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
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "text-yellow-600",
      confirmed: "text-blue-600",
      shipping: "text-purple-600",
      delivered: "text-green-600",
      cancelled: "text-red-600",
    };
    return colors[status] || "text-gray-400";
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      shipping: "Đang giao hàng",
      delivered: "Đã giao hàng",
      cancelled: "Đã hủy",
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-teal-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-teal-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!orderId) {
    if (!user) {
      return (
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <FileText className="mx-auto text-teal-600 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Vui lòng đăng nhập
            </h2>
            <p className="text-gray-600">Đăng nhập để xem đơn hàng của bạn</p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 btn-ocean px-6 py-2 rounded-lg font-semibold"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <ShoppingBag className="mx-auto text-teal-600 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Chưa có đơn hàng
            </h2>
            <p className="text-gray-600 mb-6">Bạn chưa có đơn hàng nào</p>
            <button
              onClick={() => navigate("/")}
              className="btn-ocean px-6 py-2 rounded-lg font-semibold"
            >
              Mua sắm ngay
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-shadow-gray-300 mb-2">
              Đơn hàng của tôi
            </h1>
            <p className="text-gray-600">
              Quản lý và theo dõi đơn hàng của bạn
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {orders.map((orderItem) => (
            <div
              key={orderItem._id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-teal-200 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-3 rounded-lg">
                    <Package className="text-gray-800" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      Đơn hàng #{orderItem.orderNumber}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {formatDate(orderItem.createdAt)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          orderItem.orderStatus
                        )} bg-gray-50`}
                      >
                        <CheckCircle size={14} />
                        {getStatusText(orderItem.orderStatus)}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          orderItem.paymentStatus === "paid"
                            ? "text-green-600 bg-green-900/30"
                            : "text-yellow-600 bg-yellow-900/30"
                        }`}
                      >
                        {orderItem.paymentStatus === "paid"
                          ? "Đã thanh toán"
                          : "Chưa thanh toán"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">
                    {formatPrice(orderItem.finalAmount)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {orderItem.items.length} sản phẩm
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="space-y-2">
                  {orderItem.items.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.productName} x{item.quantity}
                      </span>
                      <span className="text-gray-800 font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                  {orderItem.items.length > 2 && (
                    <div className="text-sm text-teal-600">
                      +{orderItem.items.length - 2} sản phẩm khác
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => navigate(`/invoice?orderId=${orderItem._id}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg font-semibold transition-all shadow-md"
                >
                  <Eye size={16} />
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <FileText className="mx-auto text-teal-600 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Không tìm thấy đơn hàng
          </h2>
          <p className="text-gray-600 mb-6">
            Vui lòng kiểm tra lại mã đơn hàng
          </p>
          <button
            onClick={() => navigate("/invoice")}
            className="btn-ocean px-6 py-2 rounded-lg font-semibold"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/invoice")}
        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        ← Quay lại danh sách đơn hàng
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-4 rounded-xl">
              <FileText className="text-gray-800" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Hóa đơn điện tử
              </h1>
              <p className="text-gray-600 mt-1">Cảm ơn bạn đã mua hàng!</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Mã đơn hàng</div>
            <div className="text-2xl font-mono font-bold text-teal-600">
              {order.orderNumber}
            </div>
            <div
              className={`inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                order.orderStatus
              )} bg-gray-50`}
            >
              <CheckCircle size={16} />
              {getStatusText(order.orderStatus)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
          <div className="flex items-start gap-3">
            <Calendar className="text-teal-600 mt-1" size={20} />
            <div>
              <div className="text-sm text-gray-600">Ngày đặt hàng</div>
              <div className="text-gray-800 font-medium">
                {formatDate(order.createdAt)}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CreditCard className="text-teal-600 mt-1" size={20} />
            <div>
              <div className="text-sm text-gray-600">
                Phương thức thanh toán
              </div>
              <div className="text-gray-800 font-medium">
                {order.paymentMethod || "COD"}
              </div>
              <div
                className={`text-sm ${
                  order.paymentStatus === "paid"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {order.paymentStatus === "paid"
                  ? "Đã thanh toán"
                  : "Chưa thanh toán"}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Package className="text-teal-600 mt-1" size={20} />
            <div>
              <div className="text-sm text-gray-600">Trạng thái giao hàng</div>
              <div className="text-gray-800 font-medium">
                {getStatusText(order.orderStatus)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <User size={20} className="text-teal-600" />
            Thông tin khách hàng
          </h3>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600">Họ tên</div>
              <div className="text-gray-800 font-medium">
                {order.customer.name}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Phone size={16} className="text-teal-600 mt-1" />
              <div>
                <div className="text-sm text-gray-600">Số điện thoại</div>
                <div className="text-gray-800 font-medium">
                  {order.customer.phone}
                </div>
              </div>
            </div>
            {order.customer.email && (
              <div className="flex items-start gap-2">
                <Mail size={16} className="text-teal-600 mt-1" />
                <div>
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="text-gray-800 font-medium">
                    {order.customer.email}
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-teal-600 mt-1" />
              <div>
                <div className="text-sm text-gray-600">Địa chỉ nhận hàng</div>
                <div className="text-gray-800 font-medium">
                  {order.customer.address}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Package size={20} className="text-teal-600" />
            Chi tiết đơn hàng
          </h3>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0"
              >
                <div className="flex-1">
                  <div className="text-gray-800 font-medium">
                    {item.productName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatPrice(item.price)} x {item.quantity}
                  </div>
                </div>
                <div className="text-lg font-semibold text-green-600">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính:</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí vận chuyển:</span>
              <span className="text-green-600">Miễn phí</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="text-xl font-bold text-gray-800">
                Tổng cộng:
              </span>
              <span className="text-2xl font-bold text-green-600">
                {formatPrice(order.finalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
        <div className="text-center text-gray-600">
          <p className="mb-2">
            Cảm ơn quý khách đã tin tưởng và mua sắm tại PhoneStore!
          </p>
          <p className="text-sm">
            Mọi thắc mắc vui lòng liên hệ hotline:{" "}
            <span className="text-teal-600 font-semibold">1900 xxxx</span>
          </p>
        </div>
      </div>

      {/* Print Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => window.print()}
          className="btn-ocean px-8 py-3 rounded-lg font-semibold"
        >
          In hóa đơn
        </button>
      </div>
    </div>
  );
};

export default ClientInvoice;
