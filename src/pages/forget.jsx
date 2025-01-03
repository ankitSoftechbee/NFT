import React from 'react';
import LOGO from '../assets/logo.png';
import ForgetForm from '@/components/forms/forget-form';

const Forget = () => {
    return (
        <main className="relative flex flex-col h-screen w-screen justify-center items-center bg-[#121212] text-gray-100 p-4 overflow-y-scroll">
            <div className="w-full max-w-md bg-[#161617] rounded-2xl shadow-2xl border border-emerald-500/20 p-6">
                <div className="flex items-center mb-5 gap-2">
                    <img src={LOGO} className="h-20 w-20 object-contain" />
                    <div className="text-yellow-500 text-lg">Welcome to MetaBull</div>
                </div>
                <ForgetForm />
            </div>
        </main>
    );
};

export default Forget;
