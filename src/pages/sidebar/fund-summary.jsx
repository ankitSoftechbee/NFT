import metaBullApi from '@/api/game-app';
import Pagination from '@/components/ui/pagination/Pagination';
import React, { useEffect, useState } from 'react';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import requestApi from '@/service/service';
import { TablePagination } from '@mui/material';

const FundSummary = () => {
    const [filter, setFilter] = useState({
        FromDate: "NULL",
        ToDate: "NULL",
        PageNumber: 1,
        PageSize: 10,
    });

    const [data, setData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
       const [isFromDateOpen, setIsFromDateOpen] = useState(false);
        const [isToDateOpen, setIsToDateOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, [filter]);

    const fetchData = async () => {
        try {
            const response = await requestApi.fundSummary(filter);
            setData(response?.data?.data || []);
            setTotalRecords(response?.data.totalRecord || 0);
        } catch (error) {
            toast.error("Error fetching deposit history");
            setData([]);
            setTotalRecords(0);
        }
    };

    const handleFromDateSelect = (selectedDate) => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            FromDate: selectedDate || "NULL",
            PageNumber: 1,
        }));
    };

    const handleToDateSelect = (selectedDate) => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            ToDate: selectedDate || "NULL",
            PageNumber: 1,
        }));
    };

    const handlePageChange = (event, newPage) => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            PageNumber: newPage + 1,
        }));
    };

    const handleRowsPerPageChange = (event) => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            PageSize: parseInt(event.target.value, 10),
            PageNumber: 1,
        }));
    };

    const formatDateDisplay = (date) => {
        if (date === "NULL") return "Pick a date";
        return format(new Date(date), "LLL dd, y");
    };

    return (
        <div className="w-full mx-auto">
             <div className="flex flex-col sm:flex-row gap-4 mb-4">
                         {/* From Date Selector */}
                         <div className="flex-1">
                             <Popover open={isFromDateOpen} onOpenChange={setIsFromDateOpen}>
                                 <PopoverTrigger asChild>
                                     <Button
                                         variant={"outline"}
                                         className={cn(
                                             "w-full justify-start text-left font-normal bg-[#1d1d1f] border border-emerald-500/20",
                                             filter.FromDate === "NULL" && "text-muted-foreground"
                                         )}
                                     >
                                         <CalendarIcon className="mr-2 h-4 w-4" />
                                         {formatDateDisplay(filter.FromDate)}
                                     </Button>
                                 </PopoverTrigger>
                                 <PopoverContent className="w-auto p-0" align="start">
                                     <Calendar
                                         mode="single"
                                         selected={filter.FromDate === "NULL" ? null : new Date(filter.FromDate)}
                                         onSelect={handleFromDateSelect}
                                         initialFocus
                                     />
                                 </PopoverContent>
                             </Popover>
                         </div>
         
                         {/* To Date Selector */}
                         <div className="flex-1">
                             <Popover open={isToDateOpen} onOpenChange={setIsToDateOpen}>
                                 <PopoverTrigger asChild>
                                     <Button
                                         variant={"outline"}
                                         className={cn(
                                             "w-full justify-start text-left font-normal bg-[#1d1d1f] border border-emerald-500/20",
                                             filter.ToDate === "NULL" && "text-muted-foreground"
                                         )}
                                     >
                                         <CalendarIcon className="mr-2 h-4 w-4" />
                                         {formatDateDisplay(filter.ToDate)}
                                     </Button>
                                 </PopoverTrigger>
                                 <PopoverContent className="w-auto p-0" align="start">
                                     <Calendar
                                         mode="single"
                                         selected={filter.ToDate === "NULL" ? null : new Date(filter.ToDate)}
                                         onSelect={handleToDateSelect}
                                         initialFocus
                                     />
                                 </PopoverContent>
                             </Popover>
                         </div>
                     </div>

            <h2 className="text-lg font-semibold text-white text-left mt-10">Statements</h2>
            <div className="space-y-4 mt-5">
                {totalRecords === 0 ? (
                    <div className="w-full mx-auto text-center text-white">No records found.</div>
                ) : (
                    data.map((item, index) => (

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
                                    <span className="text-xs text-gray-500">{item?.date.split('T')[0]}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {totalRecords > 0 && (
                    <TablePagination
                        component="div"
                        count={totalRecords}
                        page={filter.PageNumber - 1} // Adjust for zero-based index
                        onPageChange={handlePageChange}
                        rowsPerPage={filter.PageSize}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        sx={{
                            color: 'white',
                            '& .MuiTablePagination-actions button': {
                                color: 'white',
                            },
                            '& .MuiSelect-select': {
                                color: 'white',
                            },
                            '& .MuiSvgIcon-root': {
                                color: 'white',
                            },
                            '& .MuiTablePagination-caption': {
                                color: 'white',
                            },
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default FundSummary;
