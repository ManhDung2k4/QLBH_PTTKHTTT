import { clearCart, removeFromCart, updateQuantity } from "@/store/CartReducer";
import type { AppDispatch, RootState } from "@/store/store";
import type { Cart } from "@/types/Cart";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const cartList: Cart[] = useSelector((state: RootState) => state.cart);
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.username || "",
    phone: "",
    email: "",
    address: "",
  });

  const dispatch = useDispatch<AppDispatch>();

  const total: number = cartList.reduce(
    (total, item) => total + item.product.price * Number(item.quantity),
    0
  );

  const handleRemove = (productId: string) => {
    dispatch(removeFromCart({ productId }));
  };

  const handleClear = () => {
    dispatch(clearCart());
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    const qty = Number(newQuantity);
    if (qty < 1) return;
    dispatch(updateQuantity({ productId, quantity: qty }));
  };

  const handleCheckout = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      const orderData = {
        customer: customerInfo,
        items: cartList.map((item) => ({
          productId: item.product._id,
          quantity: Number(item.quantity),
        })),
        paymentMethod: "COD",
      };

      const response = await fetch("http://localhost:3000/admin/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        dispatch(clearCart());
        setShowCheckout(false);
        alert(`Đặt hàng thành công! Mã đơn: ${data.data.orderNumber}`);
        navigate(`/invoice?orderId=${data.data._id}`);
      } else {
        alert(data.message || "Đặt hàng thất bại!");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Đặt hàng thất bại!");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-3 rounded-xl">
            <ShoppingCart className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Giỏ hàng của bạn
            </h2>
            <p className="text-gray-600 mt-1">{cartList.length} sản phẩm</p>
          </div>
        </div>
        {cartList.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Trash2 size={18} />
            Xóa tất cả
          </button>
        )}
      </div>

      {cartList.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cartList.map((item) => {
              const currentQuantity = Number(item.quantity);

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-xl border-2 border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-teal-300 transition-all"
                >
                  <div className="flex gap-4">
                    <div className="h-24 w-24 overflow-hidden rounded-lg border-2 border-gray-200">
                      <img
                        src={item.product.thumbnail}
                        alt={item.product.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {item.product.title}
                          </h3>
                          {item.product.brand && (
                            <p className="text-sm text-gray-500 font-medium">
                              {item.product.brand}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemove(item.product._id)}
                          className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.product._id,
                                currentQuantity - 1
                              )
                            }
                            disabled={currentQuantity <= 1}
                            className="p-2 bg-gray-200 hover:bg-teal-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-lg transition-all border border-gray-300"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="text-lg font-bold text-gray-800 w-12 text-center">
                            {currentQuantity}
                          </span>

                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.product._id,
                                currentQuantity + 1
                              )
                            }
                            className="p-2 bg-gray-200 hover:bg-teal-500 hover:text-white text-gray-700 rounded-lg transition-all border border-gray-300"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {formatPrice(item.product.price)} x{" "}
                            {currentQuantity}
                          </p>
                          <p className="text-xl font-bold text-teal-600">
                            {formatPrice(item.product.price * currentQuantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 sticky top-24 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Tổng đơn hàng
              </h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính:</span>
                  <span className="font-semibold">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span className="text-green-600 font-semibold">Miễn phí</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-gray-800">
                  Tổng cộng:
                </span>
                <span className="text-2xl font-bold text-teal-600">
                  {formatPrice(total)}
                </span>
              </div>

              <button
                onClick={() => setShowCheckout(true)}
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg border-2 border-teal-600 transition-all"
              >
                <CreditCard size={20} />
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="bg-teal-100 p-6 rounded-full w-fit mx-auto mb-4">
            <ShoppingCart className="text-teal-600" size={64} />
          </div>
          <p className="text-xl font-bold text-gray-800">Giỏ hàng trống</p>
          <p className="text-gray-600 mt-2">Hãy thêm sản phẩm vào giỏ hàng!</p>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border-2 border-gray-200 w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Thông tin đặt hàng
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Họ tên *
                </label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border-2 border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Nhập họ tên"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, phone: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border-2 border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white border-2 border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Nhập email"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Địa chỉ nhận hàng *
                </label>
                <textarea
                  value={customerInfo.address}
                  onChange={(e) =>
                    setCustomerInfo({
                      ...customerInfo,
                      address: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-white border-2 border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  rows={3}
                  placeholder="Nhập địa chỉ chi tiết"
                />
              </div>
            </div>

            <div className="bg-teal-50 rounded-lg p-4 mb-6 border-2 border-teal-200">
              <div className="flex justify-between text-gray-800 font-semibold">
                <span>Tổng thanh toán:</span>
                <span className="text-teal-600 text-xl font-bold">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCheckout(false)}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-4 py-3 rounded-lg font-semibold shadow-lg transition-all"
              >
                Xác nhận đặt hàng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
