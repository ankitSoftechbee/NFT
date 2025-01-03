import { BellDot, ChevronLeft, Filter, Menu } from 'lucide-react';
import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const OverlapScreenLayout = ({}) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <main className="relative flex flex-col h-screen w-screen justify-between lg:w-[500px]  mx-auto overflow-hidden bg-app-bg-secondary">
            <div className="flex items-center justify-between gap-3 mx-2 mt-2">
                <div className="flex justify-between items-center gap-2 w-full">
                    <div className="flex flex-col justify-center items-center bg-[#242427]/50 rounded-full p-3 md:p-4 active:scale-95" onClick={() => navigate(-1)}>
                        <ChevronLeft className="h-6 w-6 object-contain" />
                    </div>
                    <div className="grow text-lg font-medium text-app-text-primary">{location.state?.title}</div>
                </div>
            </div>
            <section className="flex flex-col h-full w-full overflow-y-scroll p-3 my-3">
                <Outlet />
            </section>
        </main>
    );
};

export default OverlapScreenLayout;
