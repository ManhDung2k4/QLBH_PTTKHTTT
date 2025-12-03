import { getAllProducts } from "@/services/ProductService";
import { addToCart, updateQuantity } from "@/store/CartReducer";
import type { AppDispatch, RootState } from "@/store/store";
import type { Cart } from "@/types/Cart";
import type { Product } from "@/types/Product";
import type { ApiResponse } from "@/types/Response";
import {
  ShoppingCart,
  Star,
  Search,
  Filter,
  Smartphone,
  TrendingUp,
  Award,
  Truck,
  Zap,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const FilterSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-6">
    <h4 className="text-gray-700 font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
      {title}
    </h4>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
);

const FilterChip = ({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border ${
      active
        ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white border-teal-600 shadow-lg"
        : "bg-white text-gray-700 border-gray-200 hover:border-teal-400 hover:text-teal-600"
    }`}
  >
    {label}
  </button>
);

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedRam, setSelectedRam] = useState("all");
  const [selectedRom, setSelectedRom] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  const cart: Cart[] = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response: ApiResponse<Product[]> = await getAllProducts(1, 1000);
        if (response.success && response.data) {
          setProducts(response.data);
          setFilteredProducts(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];
    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedBrand !== "all")
      result = result.filter((p) => p.brand === selectedBrand);
    if (selectedRam !== "all")
      result = result.filter((p) => p.ram?.includes(selectedRam));
    if (selectedRom !== "all")
      result = result.filter((p) => p.rom?.includes(selectedRom));
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    setFilteredProducts(result);
    setCurrentPage(1);
  }, [
    products,
    searchQuery,
    selectedBrand,
    selectedRam,
    selectedRom,
    priceRange,
    sortBy,
  ]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleAddToCart = (product: Product) => {
    if (cart.some((item) => item._id === product._id)) {
      dispatch(updateQuantity({ productId: product._id, quantity: 1 }));
    } else {
      dispatch(addToCart({ product }));
    }
  };

  const calculateDiscountedPrice = (price: number, discount: number) =>
    price - (price * discount) / 100;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const brands = [
    "all",
    ...Array.from(new Set(products.map((p) => p.brand).filter(Boolean))),
  ];
  const rams = ["all", "4GB", "6GB", "8GB", "12GB", "16GB"];
  const roms = ["all", "64GB", "128GB", "256GB", "512GB", "1TB"];

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedBrand("all");
    setSelectedRam("all");
    setSelectedRom("all");
    setPriceRange([0, 50000000]);
    setSortBy("newest");
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

  return (
    <div className="space-y-8 pb-10">
      {/* --- HERO SECTION --- */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-teal-100 shadow-2xl">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[50%] -left-[20%] w-[80%] h-[150%] bg-teal-500/10 blur-[100px] rounded-full"></div>
          <div className="absolute top-[20%] -right-[20%] w-[60%] h-[100%] bg-teal-600/10 blur-[100px] rounded-full"></div>
        </div>

        <div className="relative z-10 px-6 py-12 md:py-16 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 text-xs font-bold uppercase tracking-wider mb-6">
            <Zap size={14} /> Official Store
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-800 mb-4 leading-tight tracking-tight">
            Công Nghệ{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-700">
              Đỉnh Cao
            </span>
            <br /> Trong Tầm Tay
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto font-light">
            Khám phá bộ sưu tập smartphone mới nhất với mức giá không thể tốt
            hơn. Bảo hành chính hãng, giao hàng siêu tốc.
          </p>

          <div className="relative max-w-xl mx-auto group">
            <div className="absolute inset-0 bg-teal-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center bg-white backdrop-blur-xl border-2 border-gray-200 rounded-full p-2 focus-within:border-teal-500 focus-within:shadow-lg focus-within:shadow-teal-500/20 transition-all">
              <Search className="ml-4 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Bạn đang tìm kiếm gì? (iPhone 15, S24 Ultra...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-gray-800 placeholder-gray-400 px-4 py-2 focus:ring-0 text-base"
              />
              <button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-6 py-2 rounded-full font-semibold transition-all shadow-lg">
                Tìm
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* --- SIDEBAR FILTER (Glass Effect) --- */}
        <div
          className={`lg:w-72 space-y-6 ${
            showFilters ? "block" : "hidden"
          } lg:block`}
        >
          <div className="sticky top-24 bg-white backdrop-blur-xl border border-gray-200 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
              <h3 className="text-gray-800 font-bold text-lg flex items-center gap-2">
                <Filter size={20} className="text-teal-600" />
                Bộ lọc tìm kiếm
              </h3>
              <button
                onClick={clearFilters}
                className="text-xs text-gray-600 hover:text-gray-800 underline decoration-dotted"
              >
                Làm mới
              </button>
            </div>

            <FilterSection title="Thương hiệu">
              {brands.map((brand) => (
                <FilterChip
                  key={brand}
                  label={brand === "all" ? "Tất cả" : brand}
                  active={selectedBrand === brand}
                  onClick={() => setSelectedBrand(brand)}
                />
              ))}
            </FilterSection>

            <FilterSection title="RAM">
              {rams.map((ram) => (
                <FilterChip
                  key={ram}
                  label={ram === "all" ? "Tất cả" : ram}
                  active={selectedRam === ram}
                  onClick={() => setSelectedRam(ram)}
                />
              ))}
            </FilterSection>

            <FilterSection title="Bộ nhớ trong">
              {roms.map((rom) => (
                <FilterChip
                  key={rom}
                  label={rom === "all" ? "Tất cả" : rom}
                  active={selectedRom === rom}
                  onClick={() => setSelectedRom(rom)}
                />
              ))}
            </FilterSection>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-gray-700 font-semibold text-sm uppercase tracking-wider">
                  Khoảng giá
                </h4>
                <span className="text-teal-600 text-xs font-mono">
                  {formatPrice(priceRange[1])}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50000000"
                step="500000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-teal-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="flex-1">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-white/90 p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden p-2 bg-teal-500 hover:bg-teal-600 rounded-lg text-white transition-colors"
              >
                <Filter size={20} />
              </button>
              <p className="text-gray-600">
                Tìm thấy{" "}
                <span className="text-teal-600 font-bold">
                  {currentProducts.length}
                </span>{" "}
                sản phẩm
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-gray-600 text-sm whitespace-nowrap hidden sm:block">
                Sắp xếp theo:
              </span>
              <div className="relative w-full sm:w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-700 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 cursor-pointer shadow-sm"
                >
                  <option value="newest"> ✨ Mới nhất</option>
                  <option value="price-asc"> 💰 Giá tăng dần</option>
                  <option value="price-desc"> 💎 Giá giảm dần</option>
                  <option value="rating"> ⭐ Đánh giá cao</option>
                  <option value="name"> 🔤 Tên A-Z</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
                  size={16}
                />
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-300">
              <div className="bg-teal-100 p-6 rounded-full mb-4">
                <Smartphone size={48} className="text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Không tìm thấy sản phẩm
              </h3>
              <p className="text-gray-600">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </p>
              <button
                onClick={clearFilters}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg font-semibold transition-all shadow-lg"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {currentProducts.map((product) => {
                  const discountedPrice = calculateDiscountedPrice(
                    product.price,
                    product.discountPercentage
                  );
                  const hasDiscount = product.discountPercentage > 0;

                  return (
                    <div
                      key={product._id}
                      className="group bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-teal-400 hover:shadow-xl hover:shadow-teal-500/20 transition-all duration-300 flex flex-col"
                    >
                      {/* Image Area */}
                      <div className="relative pt-[100%] bg-white overflow-hidden">
                        {hasDiscount && (
                          <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-3 py-1.5 z-10 rounded-br-xl shadow-lg">
                            -{product.discountPercentage}%
                          </div>
                        )}
                        <div className="absolute top-3 right-3 z-10">
                          <div className="bg-black/10 backdrop-blur-md p-1.5 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer text-slate-600">
                            {/* Example Heart Icon placeholder */}
                          </div>
                        </div>

                        {product.thumbnail ? (
                          <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="absolute inset-0 w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-500 ease-out"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-6xl">
                            📱
                          </div>
                        )}

                        {/* Quick Action Overlay (Desktop) */}
                        <div className="absolute inset-x-4 bottom-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-3 rounded-xl font-semibold backdrop-blur-sm flex items-center justify-center gap-2 shadow-xl"
                          >
                            <ShoppingCart size={18} /> Thêm nhanh
                          </button>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-xs font-semibold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                            {product.brand || "Generic"}
                          </div>
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star size={14} fill="currentColor" />
                            <span className="text-sm font-bold text-gray-700">
                              {product.rating}
                            </span>
                          </div>
                        </div>

                        <h3 className="text-gray-800 font-bold text-lg mb-2 line-clamp-2 leading-tight group-hover:text-teal-600 transition-colors">
                          {product.title}
                        </h3>

                        <div className="flex gap-2 mb-4">
                          {product.ram && (
                            <span className="text-[10px] font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full border border-gray-200">
                              RAM {product.ram}
                            </span>
                          )}
                          {product.rom && (
                            <span className="text-[10px] font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full border border-gray-200">
                              {product.rom}
                            </span>
                          )}
                        </div>

                        <div className="mt-auto pt-4 border-t border-teal-100">
                          <div className="flex flex-wrap items-baseline gap-2">
                            <span className="text-xl font-bold text-gray-800">
                              {formatPrice(
                                hasDiscount ? discountedPrice : product.price
                              )}
                            </span>
                            {hasDiscount && (
                              <span className="text-sm text-slate-500 line-through decoration-slate-600">
                                {formatPrice(product.price)}
                              </span>
                            )}
                          </div>
                          <div className="mt-3 flex items-center gap-2 text-xs text-green-600 font-medium">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            Còn {product.stock} sản phẩm
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8 pt-8 border-t border-teal-100">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border border-gray-300 hover:bg-teal-50 hover:border-teal-400 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                  >
                    Trước
                  </button>

                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 &&
                          pageNum <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                              currentPage === pageNum
                                ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg"
                                : "bg-white border border-gray-300 hover:bg-teal-50 hover:border-teal-400 text-gray-700"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === currentPage - 2 ||
                        pageNum === currentPage + 2
                      ) {
                        return (
                          <span key={pageNum} className="px-2 text-gray-600">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white border border-gray-300 hover:bg-teal-50 hover:border-teal-400 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* --- FOOTER FEATURES --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-teal-100">
        {[
          {
            icon: Award,
            title: "Chính hãng 100%",
            desc: "Bảo hành 12 tháng toàn quốc",
          },
          {
            icon: Truck,
            title: "Miễn phí vận chuyển",
            desc: "Cho đơn hàng trên 5 triệu",
          },
          {
            icon: TrendingUp,
            title: "Hỗ trợ trả góp 0%",
            desc: "Thủ tục nhanh gọn trong 5p",
          },
        ].map((feature, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 p-6 rounded-2xl bg-white border-2 border-gray-200 hover:border-teal-400 hover:shadow-lg transition-all"
          >
            <div className="p-3 rounded-xl bg-teal-100 text-teal-600">
              <feature.icon size={28} strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="text-gray-800 font-bold">{feature.title}</h4>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
