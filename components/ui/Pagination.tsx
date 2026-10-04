import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  queryParams?: Record<string, string>;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  queryParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams(queryParams);
    params.set("page", page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex justify-center items-center space-x-1 mt-12" aria-label="Pagination">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={buildUrl(currentPage - 1)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          &laquo; Previous
        </Link>
      ) : (
        <span className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-400 bg-gray-50 cursor-not-allowed">
          &laquo; Previous
        </span>
      )}

      {/* Page Numbers */}
      {pages.map((p) => {
        const isActive = p === currentPage;
        return (
          <Link
            key={p}
            href={buildUrl(p)}
            className={`px-4 py-2 border text-sm font-medium rounded-md transition-colors ${
              isActive
                ? "bg-red-600 border-red-600 text-white shadow-sm"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {p}
          </Link>
        );
      })}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildUrl(currentPage + 1)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          Next &raquo;
        </Link>
      ) : (
        <span className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-400 bg-gray-50 cursor-not-allowed">
          Next &raquo;
        </span>
      )}
    </nav>
  );
}
