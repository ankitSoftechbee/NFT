import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalCount, pageSize, onPageChange }) => {
    // Calculate total pages
    const totalPages = Math.ceil(totalCount / pageSize);

    // Generate page numbers
    const generatePageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        // Adjust start page if we're at the end
        if (endPage === totalPages) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    // Handler for page change
    const handlePageChange = page => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    // If total pages is 1 or less, don't show pagination
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex justify-center items-center space-x-2 my-4">
            {/* Previous Button */}
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`
                    p-2 rounded-lg transition-colors duration-300
                    ${currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-emerald-400 hover:bg-emerald-500/20 active:bg-emerald-500/30'}
                `}
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Page Numbers */}
            {generatePageNumbers().map(page => (
                <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`
                        w-9 h-9 rounded-lg text-sm font-medium transition-all duration-300
                        ${currentPage === page ? 'bg-emerald-500 text-black' : 'text-gray-300 hover:bg-emerald-500/20 hover:text-emerald-400'}
                    `}
                >
                    {page}
                </button>
            ))}

            {/* Next Button */}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`
                    p-2 rounded-lg transition-colors duration-300
                    ${currentPage === totalPages ? 'text-gray-500 cursor-not-allowed' : 'text-emerald-400 hover:bg-emerald-500/20 active:bg-emerald-500/30'}
                `}
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Pagination;
