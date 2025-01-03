import metaBullApi from '@/api/game-app';
import Pagination from '@/components/ui/pagination/Pagination';
import React, { useState } from 'react';

import { format } from 'date-fns';
import { CalendarIcon, PhoneIcon, UserIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const DirectAffiliate = () => {
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
    } = metaBullApi.useDirectAffiliateQuery({
        pageNumber: currentPage,
        fromDate: formattedFromDate,
        toDate: formattedToDate,
    });

    const formatDate = dateString => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
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

    // Error state
    // if (isError) {
    //     return <div className="w-full mx-auto text-center text-red-500">Error in loading data: {error?.message || 'Unknown error'}</div>;
    // }

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

            <h2 className="text-lg font-semibold text-white text-left mt-10">My Direct</h2>

            <div className="space-y-4 mt-5">
                {result?.totalRecord === 0 ? (
                    <div className="w-full mx-auto text-center text-white">No team members found.</div>
                ) : isLoading || isFetching ? (
                    <div className="w-full mx-auto text-center text-white">Loading team members...</div>
                ) : (
                    result.data.map((member, index) => (
                        <div key={index} className="bg-[#1d1d1f] rounded-2xl border border-emerald-500/20 p-4 shadow-lg">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end space-y-2 sm:space-y-0">
                                <div className="space-y-2 w-full">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <UserIcon className="h-5 w-5 text-emerald-500" />
                                            <div className="text-white font-medium">{member.username}</div>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs ${member.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {member.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-300 mt-3  border-t border-emerald-500/20 pt-3">
                                        <div>
                                            <span className="text-gray-500 block mb-1">Name</span>
                                            {member.name}
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block mb-1">Mobile</span>
                                            <div className="flex items-center space-x-2">{member.mobile}</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block mb-1">Referrer</span>
                                            {member.reffname}
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block mb-1">Referrer ID</span>
                                            {member.reffid}
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block mb-1">Joined</span>
                                            {formatDate(member.dateofjoin)}
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

export default DirectAffiliate;
