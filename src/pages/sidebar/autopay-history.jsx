import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TablePagination } from '@mui/material';
import requestApi from '@/service/service';

const AutoPayHistory = () => {
    const [filter, setFilter] = useState({
        FromDate: "NULL",
        ToDate: "NULL",
        PageNumber: 1,
        PageSize: 10,
    });

    const [data, setData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);

    // State for managing Popover visibility
    const [isFromDateOpen, setIsFromDateOpen] = useState(false);
    const [isToDateOpen, setIsToDateOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, [filter]);

    const fetchData = async () => {
        try {
            const response = await requestApi.autoDepositeHistory(filter);
            setData(response?.data?.data || []);
            setTotalRecords(response?.data.totalRecord || 0);
        } catch (error) {
            console.error("Error fetching deposit history", error);
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
        setIsFromDateOpen(false); // Close the popover
    };

    const handleToDateSelect = (selectedDate) => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            ToDate: selectedDate || "NULL",
            PageNumber: 1,
        }));
        setIsToDateOpen(false); // Close the popover
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

            {/* Statements */}
            <h2 className="text-lg font-semibold text-white text-left mt-10">Statements</h2>
            <div className="space-y-4 mt-5">
                {totalRecords === 0 ? (
                    <div className="w-full mx-auto text-center text-white">No records found.</div>
                ) : (
                    data.map((item, index) => (
                        <div key={index} className="bg-[#1d1d1f] rounded-2xl border border-emerald-500/20 p-4 shadow-lg">
                            <div className="flex flex-col space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300 text-sm">
                                        Amount: <span className="text-emerald-400">{item.amount}</span>
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-gray-300 text-sm">
                                    <div>
                                        <span className="text-gray-500">Payment Mode</span>
                                        <p>{item.paymentMode}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Date</span>
                                        <p>{item.date}</p>
                                    </div>
                                </div>

                                {item.hashCode && (
                                    <div className="text-gray-300 text-sm">
                                        <span className="text-gray-500">Hash Code</span>
                                        <p className="truncate">{item.hashCode}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}

                {totalRecords > 0 && (
                    <TablePagination
                        component="div"
                        count={totalRecords}
                        page={filter.PageNumber - 1}
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

export default AutoPayHistory;
