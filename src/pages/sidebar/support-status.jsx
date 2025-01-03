import React, { useEffect, useState } from 'react';
import { Clock, MessageCircle, User } from 'lucide-react';
import Pagination from '@/components/ui/pagination/Pagination';
import metaBullApi from '@/api/game-app';
import { v4 as uuidv4 } from 'uuid';

const SupportStatus = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [supportData, setSupportData] = useState({
        totalRecord: 0,
        data: [],
    });

    // Use the mutation hook with error handling
    const [supportStatusTrigger, { isLoading, isError, data, error }] = metaBullApi.useSupportStatusMutation();

    // Fetch data when component mounts or page changes
    useEffect(() => {
        const fetchSupportStatus = async () => {
            try {
                const response = await supportStatusTrigger({
                    pageNumber: currentPage,
                    pageSize: 10,
                }).unwrap();

                // Assuming the API returns an object with totalRecord and data
                if (response) {
                    setSupportData({
                        totalRecord: response.totalRecord || 0,
                        data: response.data || [],
                    });
                }
            } catch (err) {
                console.error('Failed to fetch support status:', err);
                // Optionally set an error state or show a toast
            }
        };

        fetchSupportStatus();
    }, [currentPage, supportStatusTrigger]);

    // Function to format date
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

    // Loading state
    if (isLoading) {
        return <div className="w-full mx-auto text-center text-white">Loading support tickets...</div>;
    }

    // Error state
    if (isError) {
        return <div className="w-full mx-auto text-center text-red-500">Error loading support tickets: {error?.message || 'Unknown error'}</div>;
    }

    return (
        <div className="w-full mx-auto">
            <h2 className="text-2xl font-bold text-center text-white mb-6">Support Ticket Status</h2>

            <div className="space-y-4">
                {supportData.data.length === 0 ? (
                    <div className="text-center text-gray-400">No support tickets found</div>
                ) : (
                    supportData.data.map(item => (
                        <div key={uuidv4()} className="bg-[#1d1d1f] rounded-xl border border-emerald-500/20 p-4">
                            <div className="flex flex-col space-y-3">
                                {/* Header */}
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        <User className="w-5 h-5 text-app-text-primary" />
                                        <span className="text-gray-300 font-medium">{item.username}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                        <span className="text-xs text-gray-500">{formatDate(item.doi)}</span>
                                    </div>
                                </div>

                                {/* Subject and Message */}
                                <div className="border-t border-emerald-500/20 pt-3">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <MessageCircle className="w-5 h-5 text-app-text-primary" />
                                        <h3 className="text-lg font-semibold text-white">{item.subject}</h3>
                                    </div>
                                    <p className="text-gray-400 text-sm">{item.message}</p>
                                </div>

                                {/* Status and Response */}
                                <div className="bg-[#2a2a2c] rounded-lg p-3">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-500">Status:</span>
                                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">{item.status}</span>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-gray-400 text-sm italic">"{item.response}"</div>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {supportData.totalRecord > 0 && <Pagination currentPage={currentPage} totalCount={supportData.totalRecord} pageSize={10} onPageChange={setCurrentPage} />}
            </div>
        </div>
    );
};

export default SupportStatus;
