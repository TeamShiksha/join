import { ChangeEvent } from 'react';
import { Button } from './Button';
import { twMerge } from 'tailwind-merge';

interface SearchPaginationProps {
    total: number;
    page: number;
    limit: number;
    search: string;
    onSearchChange: (value: string) => void;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

export function SearchPagination({
    total,
    page,
    limit,
    search,
    onSearchChange,
    onPageChange,
    isLoading = false
}: SearchPaginationProps) {
    const totalPages = Math.ceil(total / limit);
    const showPagination = total > limit;

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
    };

    const getPaginationItems = () => {
        const items = [];
        const maxVisible = 5; // Show max 5 page numbers
        const halfVisible = Math.floor(maxVisible / 2);
        
        let startPage = Math.max(1, page - halfVisible);
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        // Adjust when near the end
        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        // Add first page and ellipsis if needed
        if (startPage > 1) {
            items.push(1);
            if (startPage > 2) items.push('...');
        }

        // Add page numbers
        for (let i = startPage; i <= endPage; i++) {
            items.push(i);
        }

        // Add last page and ellipsis if needed
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) items.push('...');
            items.push(totalPages);
        }

        return items;
    };

    return (
        <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
                <input
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search images..."
                    className={twMerge(
                        "w-full px-4 py-2 rounded-lg border border-gray-300",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                        "placeholder-gray-400 text-gray-900",
                        isLoading && "bg-gray-50"
                    )}
                    disabled={isLoading}
                />
                {isLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg 
                            className="animate-spin h-5 w-5 text-gray-400" 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24"
                        >
                            <circle 
                                className="opacity-25" 
                                cx="12" 
                                cy="12" 
                                r="10" 
                                stroke="currentColor" 
                                strokeWidth="4"
                            />
                            <path 
                                className="opacity-75" 
                                fill="currentColor" 
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {showPagination && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Showing {Math.min((page - 1) * limit + 1, total)} to{' '}
                        {Math.min(page * limit, total)} of {total} images
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(page - 1)}
                            disabled={page === 1 || isLoading}
                        >
                            Previous
                        </Button>

                        <div className="flex items-center space-x-2">
                            {getPaginationItems().map((item, index) => (
                                item === '...' ? (
                                    <span key={`ellipsis-${index}`} className="px-2">
                                        {item}
                                    </span>
                                ) : (
                                    <Button
                                        key={item}
                                        variant={page === item ? 'primary' : 'outline'}
                                        size="sm"
                                        onClick={() => onPageChange(item as number)}
                                        disabled={isLoading}
                                        className="min-w-[2.5rem]"
                                    >
                                        {item}
                                    </Button>
                                )
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(page + 1)}
                            disabled={page >= totalPages || isLoading}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}