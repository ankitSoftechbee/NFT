import metaBullApi from '@/api/game-app';
import Pagination from '@/components/ui/pagination/Pagination';
import React, { useState } from 'react';

const TopupHistory = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const {
        data: result,
        isLoading,
        isFetching,
        isError,
        error,
    } = metaBullApi.useTopupHistoryQuery({
        pageNumber: currentPage,
    });

    const formatDate = dateString => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Error state
    if (isError) {
        return <div className="w-full mx-auto text-center text-red-500">Error in loading data: {error?.message || 'Unknown error'}</div>;
    }
    console.log(result);
    return (
        <div className="w-full mx-auto">
            <h2 className="text-lg font-semibold text-white text-left mt-5">Staking History</h2>

            <div className="space-y-4 mt-5">
                {result?.totalRecord === 0 ? (
                    <div className="w-full mx-auto text-center text-white">No records found.</div>
                ) : isLoading || isFetching ? (
                    <div className="w-full mx-auto text-center text-white">Loading statements...</div>
                ) : (
                    result.data.map(item => (
                        <div key={item.rid} className="bg-[#1d1d1f] rounded-2xl border border-emerald-500/20 p-4 shadow-lg">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end space-y-2 sm:space-y-0">
                                <div className="space-y-1 w-full">
                                    <div className="flex justify-between items-center">
                                        <div className="text-gray-300 text-sm">
                                            Pack Type: <span className="text-app-text-active">{item.packType}</span>
                                        </div>
                                        <span className="text-xs text-gray-500">{formatDate(item.dor)}</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2 mt-2">
                                        <div className="text-gray-300 text-sm">
                                            Amount: <span className="text-green-400">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.amount)}</span>
                                        </div>
                                        <div className="text-gray-300 text-sm">
                                            Working: <span className="text-yellow-400">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.working)}</span>
                                        </div>
                                        <div className="text-gray-300 text-sm">
                                            Non Working: <span className="text-yellow-400">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.nonWorking)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {result?.totalRecord > 0 && <Pagination currentPage={currentPage} totalCount={result.totalRecord} pageSize={10} onPageChange={setCurrentPage} />}
            </div>
        </div>
    );
};

export default TopupHistory;
