import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPen } from 'lucide-react';

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


                        <nav class="flex" aria-label="Breadcrumb" className='mb-4'>
                            <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                                <li class="inline-flex items-center">
                                    <a href="#" class="inline-flex items-center text-lg font-bold text-white-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                                       <UserPen className="w-6 h-6 mr-2" />
                                        LogIn
                                    </a>
                                </li>
                            </ol>
                        </nav>

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
