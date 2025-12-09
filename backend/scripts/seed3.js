const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const db = require("../config/database");
const Category = require("../models/category.model");
const Amenity = require("../models/amenity.model");
const Place = require("../models/place.model");

// ============ DỮ LIỆU CATEGORY MỚI ============
const categoriesData = [
  { name: "Khu vui chơi trong nhà", code: "indoor_playground", icon: "toys" },
  { name: "Công viên ngoài trời", code: "outdoor_park", icon: "park" },
  { name: "Sở thú", code: "zoo", icon: "pets" },
  { name: "Trang trại", code: "farm", icon: "agriculture" },
  { name: "Bảo tàng", code: "museum", icon: "museum" },
  { name: "Khu giáo dục", code: "education_center", icon: "school" },
  { name: "Trải nghiệm STEM", code: "stem_experience", icon: "science" },
  { name: "Khu thể thao", code: "sports_center", icon: "sports_soccer" },
  { name: "Khu vui chơi giải trí", code: "entertainment_center", icon: "attractions" },
  { name: "Quán cafe có khu chơi", code: "kid_friendly_cafe", icon: "local_cafe" },
];

// ============ DỮ LIỆU AMENITY MỚI ============
const amenitiesData = [
  { name: "Có nhà để xe", code: "parking", icon: "local_parking" },
  { name: "Nhà vệ sinh", code: "restroom", icon: "wc" },
  { name: "Khu thay tã", code: "diaper_changing", icon: "baby_changing_station" },
  { name: "Khu nghỉ cho phụ huynh", code: "parent_lounge", icon: "weekend" },
  { name: "Nhà hàng / khu ăn uống", code: "restaurant", icon: "restaurant" },
  { name: "Hỗ trợ xe đẩy cho bé", code: "stroller_friendly", icon: "stroller" },
  { name: "Phòng y tế", code: "first_aid", icon: "medical_services" },
  { name: "Điều hòa", code: "air_conditioning", icon: "ac_unit" },
  { name: "Wi-Fi", code: "wifi", icon: "wifi" },
  { name: "Lối đi cho người khuyết tật", code: "wheelchair_accessible", icon: "accessible" },
  { name: "Khu để đồ / tủ khóa", code: "lockers", icon: "lock" },
  { name: "Khu vực an toàn cho trẻ", code: "child_safe_area", icon: "child_care" },
];

// ============ DỮ LIỆU PLACE MẪU MỚI ============
const placesData = [
  {
    name: "tiNiWorld Royal City",
    description: "Khu vui chơi trong nhà lớn nhất Hà Nội với nhiều trò chơi hấp dẫn cho trẻ em mọi lứa tuổi",
    address: "Tầng B2, TTTM Royal City, 72A Nguyễn Trãi",
    city: "Hà Nội",
    area: "Thanh Xuân",
    district: "Thanh Xuân",
    location: { type: "Point", coordinates: [105.8142, 21.0024] },
    opening_hours: {
      mon: "09:00-21:30", tue: "09:00-21:30", wed: "09:00-21:30",
      thu: "09:00-21:30", fri: "09:00-22:00", sat: "09:00-22:00", sun: "09:00-21:30"
    },
    open_on_holidays: true,
    price_range: "150.000đ - 250.000đ",
    min_price: 150000,
    max_price: 250000,
    categoryCode: "indoor_playground",
    amenityCodes: ["parking", "restroom", "diaper_changing", "restaurant", "air_conditioning", "wifi", "lockers", "child_safe_area"],
    images: [{ url: "https://images.unsplash.com/photo-1566454825481-f0e3e093c993?w=600", alt_text: "Khu vui chơi tiNiWorld" }],
    age_limit: { min: 1, max: 12 },
    crowd_level: "high",
    avg_rating: 4.5,
    total_reviews: 128
  },
  {
    name: "Công viên Thủ Lệ",
    description: "Vườn thú và công viên giải trí với nhiều loài động vật và khu vui chơi ngoài trời",
    address: "Đường Bưởi, Ba Đình",
    city: "Hà Nội",
    area: "Ba Đình",
    district: "Ba Đình",
    location: { type: "Point", coordinates: [105.8087, 21.0307] },
    opening_hours: {
      mon: "07:00-18:00", tue: "07:00-18:00", wed: "07:00-18:00",
      thu: "07:00-18:00", fri: "07:00-18:00", sat: "07:00-18:30", sun: "07:00-18:30"
    },
    open_on_holidays: true,
    price_range: "30.000đ - 50.000đ",
    min_price: 30000,
    max_price: 50000,
    categoryCode: "zoo",
    amenityCodes: ["parking", "restroom", "restaurant", "stroller_friendly", "wheelchair_accessible"],
    images: [{ url: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=600", alt_text: "Công viên Thủ Lệ" }],
    age_limit: { min: 1, max: 99 },
    crowd_level: "high",
    avg_rating: 4.2,
    total_reviews: 256
  },
  {
    name: "Jump Arena Trampoline Park",
    description: "Công viên nhảy bạt lò xo với nhiều khu vực vui chơi, thể thao cho cả gia đình",
    address: "Tầng 5, Mipec Long Biên",
    city: "Hà Nội",
    area: "Long Biên",
    district: "Long Biên",
    location: { type: "Point", coordinates: [105.8653, 21.0456] },
    opening_hours: {
      mon: "09:00-21:00", tue: "09:00-21:00", wed: "09:00-21:00",
      thu: "09:00-21:00", fri: "09:00-22:00", sat: "09:00-22:00", sun: "09:00-21:00"
    },
    open_on_holidays: true,
    price_range: "150.000đ - 200.000đ",
    min_price: 150000,
    max_price: 200000,
    categoryCode: "entertainment_center",
    amenityCodes: ["parking", "restroom", "lockers", "first_aid", "air_conditioning", "wifi"],
    images: [{ url: "https://images.unsplash.com/photo-1626716493137-b67fe9501e76?w=600", alt_text: "Jump Arena" }],
    age_limit: { min: 3, max: 45 },
    crowd_level: "high",
    avg_rating: 4.4,
    total_reviews: 95
  },
  {
    name: "Trang trại giáo dục Erahouse",
    description: "Trang trại trải nghiệm thiên nhiên, học hỏi về nông nghiệp và động vật cho trẻ em",
    address: "Xã Phú Cường, Sóc Sơn",
    city: "Hà Nội",
    area: "Sóc Sơn",
    district: "Khu vực khác",
    location: { type: "Point", coordinates: [105.8456, 21.2534] },
    opening_hours: {
      mon: "08:00-17:00", tue: "08:00-17:00", wed: "08:00-17:00",
      thu: "08:00-17:00", fri: "08:00-17:00", sat: "08:00-17:30", sun: "08:00-17:30"
    },
    open_on_holidays: true,
    price_range: "100.000đ - 150.000đ",
    min_price: 100000,
    max_price: 150000,
    categoryCode: "farm",
    amenityCodes: ["parking", "restroom", "restaurant", "first_aid", "stroller_friendly"],
    images: [{ url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600", alt_text: "Trang trại Erahouse" }],
    age_limit: { min: 2, max: 15 },
    crowd_level: "low",
    avg_rating: 4.3,
    total_reviews: 67
  },
  {
    name: "Khu vui chơi STEM Lab Kids",
    description: "Trung tâm trải nghiệm STEM với các thí nghiệm khoa học, robot và công nghệ cho trẻ",
    address: "Tầng 3, Vincom Mega Mall Times City",
    city: "Hà Nội",
    area: "Hai Bà Trưng",
    district: "Hai Bà Trưng",
    location: { type: "Point", coordinates: [105.8682, 20.9952] },
    opening_hours: {
      mon: "09:30-21:00", tue: "09:30-21:00", wed: "09:30-21:00",
      thu: "09:30-21:00", fri: "09:30-21:30", sat: "09:30-21:30", sun: "09:30-21:00"
    },
    open_on_holidays: true,
    price_range: "200.000đ - 350.000đ",
    min_price: 200000,
    max_price: 350000,
    categoryCode: "stem_experience",
    amenityCodes: ["parking", "restroom", "air_conditioning", "wifi", "child_safe_area"],
    images: [{ url: "https://images.unsplash.com/photo-1567168544230-db21da69727c?w=600", alt_text: "STEM Lab Kids" }],
    age_limit: { min: 4, max: 14 },
    crowd_level: "medium",
    avg_rating: 4.7,
    total_reviews: 43
  },
  {
    name: "Bể bơi Olympia",
    description: "Khu thể thao bơi lội với bể bơi riêng cho trẻ em và các lớp học bơi",
    address: "Trung Kính, Cầu Giấy",
    city: "Hà Nội",
    area: "Cầu Giấy",
    district: "Cầu Giấy",
    location: { type: "Point", coordinates: [105.7925, 21.0178] },
    opening_hours: {
      mon: "06:00-21:00", tue: "06:00-21:00", wed: "06:00-21:00",
      thu: "06:00-21:00", fri: "06:00-21:00", sat: "06:00-21:00", sun: "06:00-21:00"
    },
    open_on_holidays: false,
    price_range: "80.000đ - 120.000đ",
    min_price: 80000,
    max_price: 120000,
    categoryCode: "sports_center",
    amenityCodes: ["parking", "restroom", "lockers", "first_aid", "stroller_friendly"],
    images: [{ url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600", alt_text: "Bể bơi Olympia" }],
    age_limit: { min: 3, max: 99 },
    crowd_level: "medium",
    avg_rating: 4.1,
    total_reviews: 112
  },
  {
    name: "The Coffee House Kids Corner",
    description: "Quán cafe với khu vui chơi dành riêng cho trẻ em, phụ huynh có thể thư giãn trong khi trẻ chơi",
    address: "72 Trần Duy Hưng, Cầu Giấy",
    city: "Hà Nội",
    area: "Cầu Giấy",
    district: "Cầu Giấy",
    location: { type: "Point", coordinates: [105.7873, 21.0127] },
    opening_hours: {
      mon: "07:00-22:00", tue: "07:00-22:00", wed: "07:00-22:00",
      thu: "07:00-22:00", fri: "07:00-23:00", sat: "07:00-23:00", sun: "07:00-22:00"
    },
    open_on_holidays: true,
    price_range: "50.000đ - 150.000đ",
    min_price: 50000,
    max_price: 150000,
    categoryCode: "kid_friendly_cafe",
    amenityCodes: ["parking", "restroom", "diaper_changing", "parent_lounge", "air_conditioning", "wifi", "child_safe_area"],
    images: [{ url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600", alt_text: "Coffee House Kids Corner" }],
    age_limit: { min: 1, max: 10 },
    crowd_level: "low",
    avg_rating: 4.4,
    total_reviews: 78
  },
  {
    name: "Công viên Hồ Tây",
    description: "Công viên nước và khu vui chơi ngoài trời rộng lớn ven Hồ Tây",
    address: "614 Lạc Long Quân, Tây Hồ",
    city: "Hà Nội",
    area: "Tây Hồ",
    district: "Tây Hồ",
    location: { type: "Point", coordinates: [105.8234, 21.0678] },
    opening_hours: {
      mon: "08:00-18:00", tue: "08:00-18:00", wed: "08:00-18:00",
      thu: "08:00-18:00", fri: "08:00-19:00", sat: "08:00-19:00", sun: "08:00-19:00"
    },
    open_on_holidays: true,
    price_range: "Miễn phí - 100.000đ",
    min_price: 0,
    max_price: 100000,
    categoryCode: "outdoor_park",
    amenityCodes: ["parking", "restroom", "restaurant", "stroller_friendly"],
    images: [{ url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600", alt_text: "Công viên Hồ Tây" }],
    age_limit: { min: 0, max: 99 },
    crowd_level: "medium",
    avg_rating: 4.0,
    total_reviews: 203
  },
  {
    name: "Trung tâm giáo dục KidsWorld",
    description: "Trung tâm học tập và vui chơi kết hợp với các chương trình giáo dục sáng tạo",
    address: "25 Lý Thường Kiệt, Hoàn Kiếm",
    city: "Hà Nội",
    area: "Hoàn Kiếm",
    district: "Hoàn Kiếm",
    location: { type: "Point", coordinates: [105.8492, 21.0245] },
    opening_hours: {
      mon: "08:00-17:00", tue: "08:00-17:00", wed: "08:00-17:00",
      thu: "08:00-17:00", fri: "08:00-17:00", sat: "08:00-12:00", sun: "closed"
    },
    open_on_holidays: false,
    price_range: "300.000đ - 500.000đ",
    min_price: 300000,
    max_price: 500000,
    categoryCode: "education_center",
    amenityCodes: ["restroom", "air_conditioning", "wifi", "child_safe_area", "first_aid"],
    images: [{ url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600", alt_text: "KidsWorld Education" }],
    age_limit: { min: 3, max: 12 },
    crowd_level: "low",
    avg_rating: 4.8,
    total_reviews: 34
  },
  {
    name: "Bảo tàng Lịch sử Quốc gia",
    description: "Bảo tàng trưng bày lịch sử Việt Nam từ thời tiền sử đến hiện đại, có khu tương tác cho trẻ em",
    address: "25 Tông Đản, Hoàn Kiếm",
    city: "Hà Nội",
    area: "Hoàn Kiếm",
    district: "Hoàn Kiếm",
    location: { type: "Point", coordinates: [105.8589, 21.0245] },
    opening_hours: {
      mon: "closed", tue: "08:00-17:00", wed: "08:00-17:00",
      thu: "08:00-17:00", fri: "08:00-17:00", sat: "08:00-17:00", sun: "08:00-17:00"
    },
    open_on_holidays: true,
    price_range: "40.000đ",
    min_price: 40000,
    max_price: 40000,
    categoryCode: "museum",
    amenityCodes: ["restroom", "wheelchair_accessible", "air_conditioning"],
    images: [{ url: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600", alt_text: "Bảo tàng Lịch sử" }],
    age_limit: { min: 5, max: 99 },
    crowd_level: "low",
    avg_rating: 4.3,
    total_reviews: 89
  }
];

// ============ MAIN SEED FUNCTION - UPSERT (Thêm mới, không xóa cũ) ============
(async function seedNewData() {
  try {
    await db.connect();
    console.log("🚀 Bắt đầu seed dữ liệu mới (giữ nguyên dữ liệu cũ)...\n");

    // ===== 1. UPSERT CATEGORIES =====
    console.log("📂 Đang cập nhật Categories...");
    let categoryAddedCount = 0;
    let categoryUpdatedCount = 0;
    
    for (const cat of categoriesData) {
      const result = await Category.findOneAndUpdate(
        { name: cat.name }, // Tìm theo tên
        { $set: { code: cat.code, icon: cat.icon } }, // Cập nhật code và icon
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      
      if (result.isNew) {
        categoryAddedCount++;
      } else {
        categoryUpdatedCount++;
      }
    }
    console.log(`✅ Categories: ${categoryAddedCount} thêm mới, ${categoryUpdatedCount} cập nhật\n`);

    // Lấy tất cả categories để tạo map
    const allCategories = await Category.find({});
    const categoryMap = {};
    allCategories.forEach(cat => {
      if (cat.code) categoryMap[cat.code] = cat._id;
      categoryMap[cat.name] = cat._id; // Backup theo tên
    });

    // ===== 2. UPSERT AMENITIES =====
    console.log("🛠️ Đang cập nhật Amenities...");
    let amenityAddedCount = 0;
    let amenityUpdatedCount = 0;
    
    for (const am of amenitiesData) {
      const existing = await Amenity.findOne({ code: am.code });
      if (existing) {
        await Amenity.updateOne({ code: am.code }, { $set: { name: am.name, icon: am.icon } });
        amenityUpdatedCount++;
      } else {
        await Amenity.create(am);
        amenityAddedCount++;
      }
    }
    console.log(`✅ Amenities: ${amenityAddedCount} thêm mới, ${amenityUpdatedCount} cập nhật\n`);

    // Lấy tất cả amenities để tạo map
    const allAmenities = await Amenity.find({});
    const amenityMap = {};
    allAmenities.forEach(am => {
      amenityMap[am.code] = am._id;
    });

    // ===== 3. UPSERT PLACES =====
    console.log("📍 Đang cập nhật Places...");
    let placeAddedCount = 0;
    let placeSkippedCount = 0;

    for (const place of placesData) {
      // Kiểm tra place đã tồn tại chưa (theo tên)
      const existingPlace = await Place.findOne({ name: place.name });
      
      if (existingPlace) {
        console.log(`   ⏭️ Bỏ qua (đã tồn tại): ${place.name}`);
        placeSkippedCount++;
        continue;
      }

      // Tạo place mới
      const { categoryCode, amenityCodes, ...placeData } = place;
      const newPlace = {
        ...placeData,
        category_id: categoryMap[categoryCode],
        amenities: amenityCodes.map(code => amenityMap[code]).filter(Boolean)
      };

      await Place.create(newPlace);
      console.log(`   ✅ Thêm mới: ${place.name}`);
      placeAddedCount++;
    }
    console.log(`\n✅ Places: ${placeAddedCount} thêm mới, ${placeSkippedCount} bỏ qua (đã tồn tại)\n`);

    // ===== 4. IN THỐNG KÊ =====
    const totalCategories = await Category.countDocuments();
    const totalAmenities = await Amenity.countDocuments();
    const totalPlaces = await Place.countDocuments();

    console.log("📊 THỐNG KÊ TỔNG:");
    console.log("=".repeat(50));
    console.log(`Categories trong DB: ${totalCategories}`);
    console.log(`Amenities trong DB: ${totalAmenities}`);
    console.log(`Places trong DB: ${totalPlaces}`);
    console.log("=".repeat(50));

    console.log("\n🎉 Seed dữ liệu hoàn tất (dữ liệu cũ được giữ nguyên)!");
    
  } catch (error) {
    console.error("❌ Seed thất bại:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
})();