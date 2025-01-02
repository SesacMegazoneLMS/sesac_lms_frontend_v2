import { useState, useEffect } from "react";
import { CourseService } from "../../infrastructure/services/CourseService";
import CourseCard from "../../shared/components/CourseCard";
import {
  getCategoryOptions,
  getLevelOptions,
  getSortOptions,
} from "../../infrastructure/constants/courseConstants";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

function FreeCourses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState(() => ({
    category: searchParams.get("category") || "",
    level: searchParams.get("level") || "",
    sort: searchParams.get("sort") || "newest",
    search: searchParams.get("search") || "",
    page: parseInt(searchParams.get("page")) || 0,
    size: 12,
  }));

  const fetchCourses = async (currentFilters) => {
    setIsLoading(true);
    try {
      const response = await CourseService.getFreeCourses();
      setCourses(response || []);
      setTotalPages(response.totalPages || 0);
      setCurrentPage(response.currentPage || 0);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("강좌 목록을 불러오는데 실패했습니다.");
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const newFilters = {
      category: searchParams.get("category") || "",
      level: searchParams.get("level") || "",
      sort: searchParams.get("sort") || "newest",
      search: searchParams.get("search") || "",
      page: parseInt(searchParams.get("page")) || 0,
      size: 12,
    };
    setFilters(newFilters);
    fetchCourses(newFilters);
  }, [searchParams]);

  const handleFilterChange = (name, value) => {
    const newValue = value === "all" ? "" : value;
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (newValue) {
        newParams.set(name, newValue);
      } else {
        newParams.delete(name);
      }
      if (name === "sort" && !newValue) {
        newParams.set("sort", "newest");
      }
      newParams.delete("page"); // 필터 변경 시 페이지 초기화
      return newParams;
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", newPage.toString());
      return newParams;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">무료 강좌 목록</h1>

      {/* 필터 섹션 */}
      <div className="flex gap-4 mb-8">
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          {getCategoryOptions().map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={filters.level}
          onChange={(e) => handleFilterChange("level", e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          {getLevelOptions().map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={filters.sort}
          onChange={(e) => handleFilterChange("sort", e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          {getSortOptions().map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="text-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {/* 강좌 목록 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {!isLoading && courses.length === 0 ? (
          <div className="col-span-4 text-center py-8 text-gray-500">
            검색 결과가 없습니다.
          </div>
        ) : (
          courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center mt-8">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              className={`mx-1 px-4 py-2 rounded ${
                currentPage === i ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default FreeCourses;
