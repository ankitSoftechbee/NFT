import metaBullApi from '@/api/game-app';
import Pagination from '@/components/ui/pagination/Pagination';
import React, { useState } from 'react';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const FundSummary = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [fromPopoverOpen, setFromPopoverOpen] = useState(false);
    const [toPopoverOpen, setToPopoverOpen] = useState(false);

    // Format dates for API query
    const formattedFromDate = fromDate ? format(fromDate, 'yyyy-MM-dd') : 'NULL';
    const formattedToDate = toDate ? format(toDate, 'yyyy-MM-dd') : 'NULL';

    const {
        data: result,
        isLoading,
        isFetching,
        isError,
        error,
    } = metaBullApi.useFundSummaryQuery({
        pageNumber: currentPage,
        fromDate: formattedFromDate,
        toDate: formattedToDate,
    });

    console.log(result);

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

    const handleFromDateSelect = selectedDate => {
        setFromDate(selectedDate);
        setFromPopoverOpen(false);
    };

    const handleToDateSelect = selectedDate => {
        setToDate(selectedDate);
        setToPopoverOpen(false);
    };

    return (
        <div className="w-full mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                {/* From Date Selector */}
                <div className="flex-1">
                    <Popover open={fromPopoverOpen} onOpenChange={setFromPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal bg-[#1d1d1f] border border-emerald-500/20', !fromDate && 'text-muted-foreground')}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {fromDate ? format(fromDate, 'LLL dd, y') : 'Pick from date'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={fromDate} onSelect={handleFromDateSelect} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* To Date Selector */}
                <div className="flex-1">
                    <Popover open={toPopoverOpen} onOpenChange={setToPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal bg-[#1d1d1f] border border-emerald-500/20', !toDate && 'text-muted-foreground')}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {toDate ? format(toDate, 'LLL dd, y') : 'Pick to date'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={toDate} onSelect={handleToDateSelect} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <h2 className="text-lg font-semibold text-white text-left mt-10">Statements</h2>

            <div className="space-y-4 mt-5">
                {result?.totalRecord === 0 ? (
                    <div className="w-full mx-auto text-center text-white">No records found.</div>
                ) : isLoading || isFetching ? (
                    <div className="w-full mx-auto text-center text-white">Loading statements...</div>
                ) : (
                    result.data.map((item, index) => (
                        <div key={index} className="bg-[#1d1d1f] rounded-2xl border border-emerald-500/20 p-4 shadow-lg">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end space-y-2 sm:space-y-0">
                                <div className="space-y-1">
                                    <div className="text-gray-300 text-sm">
                                        Particular: <span className="text-app-text-active">{item.remark}</span>
                                    </div>
                                    <div className="text-gray-300 text-sm">
                                        Credit: <span className="text-green-400">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.credit)}</span>
                                    </div>
                                    <div className="text-gray-300 text-sm">
                                        Debit: <span className="text-red-400">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.debit)}</span>
                                    </div>
                                    <div className="text-gray-300 text-sm">
                                        Type: <span className="text-white">{item.type}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-end items-end space-y-2">
                                    <span className="text-xs text-gray-500">{formatDate(item.date)}</span>
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

export default FundSummary;
