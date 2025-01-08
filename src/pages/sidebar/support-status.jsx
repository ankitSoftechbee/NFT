import React, { useEffect, useState } from 'react';
import { Clock, MessageCircle, User } from 'lucide-react';
import Pagination from '@/components/ui/pagination/Pagination';
import metaBullApi from '@/api/game-app';
import { v4 as uuidv4 } from 'uuid';
import requestApi from '@/service/service';
import { TablePagination } from '@mui/material';

const SupportStatus = () => {
    const [filter, setFilter] = useState({
        PageNumber: 1,
        PageSize: 10,
    });

    const [data, setData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);

    useEffect(() => {
        fetchData();
    }, [filter]);

    const fetchData = async () => {
        try {
            const response = await requestApi.supportRaiseList(filter);
            setData(response?.data?.data || []);
            setTotalRecords(response?.data.totalRecord || 0);
        } catch (error) {
            toast.error("Error fetching deposit history");
            setData([]);
            setTotalRecords(0);
        }
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



    return (
        <div className="w-full mx-auto">

            <h2 className="text-lg font-semibold text-white text-left mt-10">Statements</h2>
            <div className="space-y-4 mt-5">
                {totalRecords === 0 ? (
                    <div className="w-full mx-auto text-center text-white">No records found.</div>
                ) : (
                    data.map((item, index) => (
                        <div key={uuidv4()} className="bg-[#1d1d1f] rounded-xl border border-emerald-500/20 p-4">
                            <div className="flex flex-col space-y-3">
                                {/* Header */}
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        <User className="w-5 h-5 text-app-text-primary" />
                                        <span className="text-gray-300 font-medium">{item?.username || ''}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                        <span className="text-xs text-gray-500">{item?.doi || ''}</span>
                                    </div>
                                </div>

                                {/* Subject and Message */}
                                <div className="border-t border-emerald-500/20 pt-3">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <MessageCircle className="w-5 h-5 text-app-text-primary" />
                                        <h3 className="text-lg font-semibold text-white">{item?.subject || ''}</h3>
                                    </div>
                                    <p className="text-gray-400 text-sm">{item?.message || ''}</p>
                                </div>

                                {/* Status and Response */}
                                <div className="bg-[#2a2a2c] rounded-lg p-3">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-500">Status:</span>
                                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">{item.status}</span>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-gray-400 text-sm italic">"{item?.response || ''}"</div>
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

export default SupportStatus;
