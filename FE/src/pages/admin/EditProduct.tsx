import { getProductById, updateProduct } from "@/services/ProductService";
import type { Product, ProductForm } from "@/types/Product";
import type { ApiResponse } from "@/types/Response";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack, MdSave, MdImage } from "react-icons/md";

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState<ProductForm>({
    title: "",
    description: "",
    price: "",
    discountPercentage: 0,
    rating: 5,
    stock: "",
    thumbnail: "",
    isActive: true,
    slug: "",
    brand: "",
    category: "",
    screen: "",
    os: "",
    camera: "",
    cameraFront: "",
    cpu: "",
    ram: "",
    rom: "",
    battery: "",
    sim: "",
    weight: "",
    colors: [],
    images: [],
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setFetching(true);
        const response: ApiResponse<Product> = await getProductById(id!);
        if (response.success && response.data) {
          const product = response.data;
          setFormData({
            title: product.title,
            description: product.description || "",
            price: product.price,
            discountPercentage: product.discountPercentage,
            rating: product.rating,
            stock: product.stock,
            thumbnail: product.thumbnail || "",
            isActive: product.isActive,
            slug: product.slug,
            brand: product.brand || "",
            category: product.category || "",
            screen: product.screen || "",
            os: product.os || "",
            camera: product.camera || "",
            cameraFront: product.cameraFront || "",
            cpu: product.cpu || "",
            ram: product.ram || "",
            rom: product.rom || "",
            battery: product.battery || "",
            sim: product.sim || "",
            weight: product.weight || "",
            colors: product.colors || [],
            images: product.images || [],
          });
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        alert("Không thể tải thông tin sản phẩm");
        navigate("/admin/products");
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.title || !formData.price || !formData.stock) {
        alert("Vui lòng điền đầy đủ thông tin bắt buộc");
        return;
      }

      const productData = {
        ...formData,
        _id: id,
        price: Number(formData.price),
        discountPercentage: Number(formData.discountPercentage),
        rating: Number(formData.rating),
        stock: Number(formData.stock),
      };
      console.log("Submitting product data:", productData);

      const response = await updateProduct(productData);
      console.log("Product updated:", response);

      if (!response.success) {
        alert("Cập nhật sản phẩm thất bại, vui lòng thử lại!");
        return;
      }

      alert("Cập nhật sản phẩm thành công!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/products")}
          className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <MdArrowBack size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Chỉnh sửa sản phẩm
          </h2>
          <p className="text-gray-500 mt-1">Cập nhật thông tin sản phẩm</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-200 pb-3">
                Thông tin cơ bản
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Tên sản phẩm <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="VD: Iphone 13 Pro Max 256GB"
                  required
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Đường dẫn (Slug)
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="Iphone-13-Pro-Max-256GB"
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Tự động tạo từ tên sản phẩm
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Mô tả chi tiết về sản phẩm..."
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
                />
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-200 pb-3">
                Giá & Khuyến mãi
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Giá bán (VNĐ) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="1800000"
                    min="0"
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Giảm giá (%)
                  </label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleChange}
                    placeholder="12"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              {formData.price && Number(formData.price) > 0 && (
                <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Giá sau giảm:</span>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-800">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(
                          Number(formData.price) -
                            (Number(formData.price) *
                              Number(formData.discountPercentage)) /
                              100
                        )}
                      </div>
                      {Number(formData.discountPercentage) > 0 && (
                        <div className="text-sm text-gray-500 line-through">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(Number(formData.price))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-200 pb-3">
                Tồn kho & Đánh giá
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Số lượng tồn kho <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="40"
                    min="0"
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Đánh giá (1-5 sao)
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    placeholder="4.8"
                    min="1"
                    max="5"
                    step="0.1"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-200 pb-3">
                Trạng thái
              </h3>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-2 border-gray-300 text-teal-600 focus:ring-2 focus:ring-teal-500/20"
                />
                <div>
                  <div className="text-gray-800 font-medium">
                    Hiển thị sản phẩm
                  </div>
                  <div className="text-sm text-gray-500">
                    Sản phẩm sẽ xuất hiện trên trang chủ
                  </div>
                </div>
              </label>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-200 pb-3">
                Hình ảnh
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  URL hình ảnh
                </label>
                <input
                  type="url"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              {formData.thumbnail ? (
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                  <img
                    src={formData.thumbnail}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square rounded-lg bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <MdImage className="mx-auto text-gray-600" size={48} />
                    <p className="mt-2 text-sm text-gray-500">
                      Chưa có hình ảnh
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MdSave size={20} />
                {loading ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
