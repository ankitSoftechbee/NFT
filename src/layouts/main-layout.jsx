import BottomBar from '@/components/home/bottom-bar';
import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = ({}) => {
    return (
        <main className="relative flex flex-col h-screen w-screen justify-between lg:w-[500px] mx-auto overflow-hidden bg-black">
            <Outlet />
            <BottomBar />
        </main>
    );
};

export default MainLayout;
