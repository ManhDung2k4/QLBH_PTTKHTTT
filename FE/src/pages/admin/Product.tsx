import { deleteProduct, getAllProducts } from "@/services/ProductService";
import type { Product } from "@/types/Product";
import type { ApiResponse } from "@/types/Response";
import { useEffect, useState } from "react";
import {
  MdEdit,
  MdDelete,
  MdAdd,
  MdFileUpload,
  MdWarning,
} from "react-icons/md";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [importing, setImporting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [page, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`http://localhost:3000/products?${params}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!confirm("Bạn có chắc muốn import dữ liệu điện thoại mẫu?")) return;

    try {
      setImporting(true);
      const response = await fetch(
        "http://localhost:3000/admin/products/import",
        {
          method: "POST",
        }
      );
      const data = await response.json();

      if (data.success) {
        alert(`Import thành công ${data.data.count} sản phẩm!`);
        fetchProducts();
      } else {
        alert(data.message || "Import thất bại!");
      }
    } catch (error) {
      console.error("Failed to import:", error);
      alert("Import thất bại!");
    } finally {
      setImporting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/products/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    console.log("Deleting product with id:", id);
    if (!id) return;
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa sản phẩm này?"
    );
    if (confirmDelete) {
      try {
        const response = await deleteProduct(id);
        if (!response.success) {
          alert("Xóa sản phẩm thất bại, vui lòng thử lại!");
          return;
        }
        fetchProducts();
        alert("Xóa sản phẩm thành công!");
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("Xóa sản phẩm thất bại, vui lòng thử lại!");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Quản lý sản phẩm</h2>
          <p className="text-gray-500 mt-1">
            Quản lý danh sách điện thoại trong cửa hàng
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleImport}
            disabled={importing}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-gray-800 px-4 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50"
          >
            <MdFileUpload size={20} />
            {importing ? "Đang import..." : "Import dữ liệu"}
          </button>
          <button
            onClick={() => navigate("/admin/products/new")}
            className="flex items-center gap-2 btn-ocean px-6 py-3 rounded-lg font-semibold"
          >
            <MdAdd size={20} />
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 border border-teal-200/30">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-3 bg-white/50 border border-teal-200/50 rounded-lg text-gray-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-md border border-teal-200/30 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/20 border-b border-teal-200/30">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Sản phẩm
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Thông số
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Giá
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Đánh giá
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Tồn kho
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-800/20">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-white/10 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.thumbnail && (
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <div className="font-semibold text-gray-800">
                          {product.title}
                        </div>
                        {product.brand && (
                          <div className="text-xs text-gray-500 mt-1">
                            {product.brand}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {product.ram && (
                        <span className="badge badge-info text-xs">
                          {product.ram}GB
                        </span>
                      )}
                      {product.rom && (
                        <span className="badge badge-primary text-xs">
                          {product.rom}GB
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-semibold text-green-400">
                      {formatPrice(product.price)}
                    </div>
                    {product.discountPercentage > 0 && (
                      <div className="text-xs text-red-400">
                        -{product.discountPercentage}%
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-gray-800 font-medium">
                        {product.rating}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {product.stock < 10 && (
                        <MdWarning className="text-red-400" size={18} />
                      )}
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.stock > 20
                            ? "badge-success"
                            : product.stock > 0
                            ? "badge-warning"
                            : "badge-error"
                        }`}
                      >
                        {product.stock} sp
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(product._id)}
                        className="p-2 bg-blue-600 hover:bg-teal-50 text-gray-800 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <MdEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 bg-red-600 hover:bg-red-700 text-gray-800 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                Không tìm thấy sản phẩm nào
              </div>
            </div>
          )}
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
                className="p-2 bg-blue-700/50 hover:bg-teal-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-800" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 bg-blue-700/50 hover:bg-teal-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                <ChevronRight size={20} className="text-gray-800" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
