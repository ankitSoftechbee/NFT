import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import LoginForm from '@/components/forms/login-form';
import SignupForm from '@/components/forms/signup-form';
import LOGO from '../assets/logo.png';
import { NavLink, useNavigate } from 'react-router-dom';
const Login = () => {
    return (
        <main className="relative flex flex-col h-screen w-screen justify-center items-center bg-[#5356FB] text-gray-100 p-4 overflow-y-scroll">
            <div className="w-full max-w-md bg-[#161617] rounded-2xl shadow-2xl border border-emerald-500/20 p-6">
                <div className="flex items-center mb-5 gap-2">
                    <img src={LOGO} className="h-20 w-20 object-contain" />
                    <div className="text-yellow-500 text-lg">Welcome to NFT</div>
                </div>
                <Tabs defaultValue="Login" className="w-full">
                    <div className="flex justify-between items-center">
                        <TabsList className="p-0 bg-amber-700 rounded-full border border-amber-500/30 ">
                            {['Login'].map(curr => (
                                <TabsTrigger
                                    key={curr}
                                    value={curr}
                                    className="w-full px-6 py-2 text-base rounded-full 
                                                           transition-all duration-300
                                                           data-[state=active]:bg-emerald-600/30 
                                                           data-[state=active]:text-white"
                                >
                                    {curr}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>
                    <TabsContent value="Login">
                        <LoginForm />
                    </TabsContent>
                </Tabs>

                <div className="text-center mt-4 text-sm text-gray-500">
                    Don't have an account?
                    <NavLink to={'/register'} replace={true} onClick={() => setActiveTab('Register')} className="ml-2 text-emerald-400 hover:underline">
                        Register
                    </NavLink>
                </div>
            </div>
        </main>
    );
};

export default Login;
