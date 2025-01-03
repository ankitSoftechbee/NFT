import React, { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import metaBullApi from '@/api/game-app';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

const ForgetForm = ({ }) => {
    const [activeTab, setActiveTab] = useState('1');
    const [preCheckMutation] = metaBullApi.useLazyCheckPreForgetDetailsQuery();
    const [sendOtpMutation] = metaBullApi.useSendOtpMutation();
    const [verifyOtpMutation] = metaBullApi.useLazyVerifyOtpQuery();
    const [generatePasswordMutation] = metaBullApi.useGeneratePasswordMutation();
    const navigate = useNavigate();

    const formik1 = useFormik({
        initialValues: {
            email: '',
            username: '',
        },
        validationSchema: Yup.object().shape({
            username: Yup.string().min(2, 'Username must be at least 2 characters').required('Username is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
        }),
        onSubmit: (values, action) => {
            action.setSubmitting(false);

            toast.promise(
                preCheckMutation(values)
                    .unwrap()
                    .then(payload => {
                        if (payload.status === 1) {
                            action.setSubmitting(false);
                            setActiveTab('2');
                            sendOtpMutation({ username: formik1.values.username })
                                .unwrap()
                                .then(() => console.log('otp send'))
                                .catch(() => console.log('otp send failed'));
                            return payload; // Resolves as a success
                        } else {
                            throw new Error('Invalid details'); // Rejects the promise
                        }
                    })
                    .catch(error => {
                        action.setSubmitting(false);
                        console.error('Error in signup or other operations:', error);
                        throw error; // Passes the error to the toast's error handler
                    }),
                {
                    loading: 'Checking...',
                    success: 'Checking successful', // Only shown if the promise resolves
                    error: error => `Checking failed: ${error.message}`, // Handles rejected promises
                },
                { id: 1 }
            );
        },
    });

    const formik2 = useFormik({
        initialValues: {
            username: formik1.values.username,
            otp: '',
        },
        validationSchema: Yup.object().shape({
            otp: Yup.string().required('OTP is required'),
        }),
        onSubmit: (values, action) => {
            action.setSubmitting(false);
            console.log(values)
            toast.promise(
                verifyOtpMutation({
                    username: formik1.values.username,
                    otp: values.otp,
                })
                    .unwrap()
                    .then(payload => {
                        if (payload.status === 1) {
                            action.setSubmitting(false);
                            setActiveTab('3');
                            return payload; // Resolves as a success
                        } else if (payload.status === 2) {
                            setActiveTab('1');
                            throw new Error('OTP Expired'); // Rejects the promise
                        } else {
                            throw new Error('Invalid OTP'); // Rejects the promise
                        }
                    })
                    .catch(error => {
                        action.setSubmitting(false);
                        console.error('Error in signup or other operations:', error);
                        throw error; // Passes the error to the toast's error handler
                    }),
                {
                    loading: 'verifying...',
                    success: 'verify successful', // Only shown if the promise resolves
                    error: error => `verify failed: ${error.message}`, // Handles rejected promises
                },
                { id: 2 }
            );
        },
    });

    const formik3 = useFormik({
        initialValues: {
            username: formik1.values.username,
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object().shape({
            password: Yup.string().min(3, 'Password must be at least 3 characters').required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm Password is required'),
        }),
        onSubmit: (values, action) => {
            console.log(formik1.values.username)
            action.setSubmitting(false);

            toast.promise(
                generatePasswordMutation({
                    username: formik1.values.username,
                    password: values.password,
                })
                    .unwrap()
                    .then(payload => {
                        console.log(payload)
                        if (payload === 1) {
                            action.setSubmitting(false);
                            navigate('/');
                            return payload; // Resolves as a success
                        } else {
                            throw new Error('Failed to update'); // Rejects the promise
                        }
                    })
                    .catch(error => {
                        action.setSubmitting(false);
                        console.error('Error in signup or other operations:', error);
                        throw error; // Passes the error to the toast's error handler
                    }),
                {
                    loading: 'changing...',
                    success: 'Change successful', // Only shown if the promise resolves
                    error: error => `Change failed: ${error.message}`, // Handles rejected promises
                },
                { id: 3 }
            );
        },
    });

    return (
        <>
            <Tabs defaultValue="3" className="w-full" value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="1">
                    <form onSubmit={formik1.handleSubmit} className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-white">
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            onChange={formik1.handleChange}
                            onBlur={formik1.handleBlur}
                            value={formik1.values.email}
                            placeholder="Enter Email"
                            className={cn('form-input', formik1.errors.email && formik1.touched.email && 'focus:ring-0 ring-2 ring-red-600')}
                        />
                        {formik1.errors.email && formik1.touched.email && <div className="text-red-500">{formik1.errors.email}</div>}

                        <label htmlFor="username" className="text-white">
                            Username
                        </label>
                        <div className="flex items-center relative">
                            <input
                                id="username"
                                name="username"
                                type={'text'}
                                onChange={formik1.handleChange}
                                onBlur={formik1.handleBlur}
                                value={formik1.values.username}
                                placeholder="Username"
                                className={cn('form-input w-full', formik1.errors.username && formik1.touched.username && 'focus:ring-0 ring-2 ring-red-600')}
                            />
                        </div>
                        {formik1.errors.username && formik1.touched.username && <div className="text-red-500">{formik1.errors.username}</div>}

                        <button
                            type="submit"
                            className="w-full p-3 rounded-full 
                                            bg-emerald-600/20 hover:bg-emerald-600/40 
                                            text-emerald-300 font-semibold 
                                            transition-all duration-300 
                                            active:scale-[0.98]
                                            disabled:opacity-50 disabled:cursor-not-allowed mt-5"
                            disabled={formik1.isSubmitting}
                        >
                            Forget
                        </button>
                    </form>
                </TabsContent>
                <TabsContent value="2">
                    <form onSubmit={formik2.handleSubmit} className="flex flex-col gap-2">
                        <label htmlFor="otp" className="text-white">
                            OTP
                        </label>

                        <input
                            id="otp"
                            name="otp"
                            type="number"
                            onChange={formik2.handleChange}
                            onBlur={formik2.handleBlur}
                            value={formik2.values.otp}
                            placeholder="Enter OTP"
                            className={cn('form-input', formik2.errors.otp && formik2.touched.otp && 'focus:ring-0 ring-2 ring-red-600')}
                        />
                        {formik2.errors.otp && formik2.touched.otp && <div className="text-red-500">{formik2.errors.otp}</div>}

                        <button
                            type="submit"
                            className="w-full p-3 rounded-full 
                                            bg-emerald-600/20 hover:bg-emerald-600/40 
                                            text-emerald-300 font-semibold 
                                            transition-all duration-300 
                                            active:scale-[0.98]
                                            disabled:opacity-50 disabled:cursor-not-allowed mt-5"
                            disabled={formik2.isSubmitting}
                        >
                            Verify OTP
                        </button>
                    </form>
                </TabsContent>
                <TabsContent value="3">
                    <form onSubmit={formik3.handleSubmit} className="flex flex-col gap-2">
                        <label htmlFor="password" className="text-white">
                            New Password
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="text"
                            onChange={formik3.handleChange}
                            onBlur={formik3.handleBlur}
                            value={formik3.values.password}
                            placeholder="New Password"
                            className={cn('form-input', formik3.errors.password && formik3.touched.password && 'focus:ring-0 ring-2 ring-red-600')}
                        />
                        {formik3.errors.password && formik3.touched.password && <div className="text-red-500">{formik3.errors.password}</div>}

                        <label htmlFor="confirmPassword" className="text-white">
                            Confirm Password
                        </label>

                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="text"
                            onChange={formik3.handleChange}
                            onBlur={formik3.handleBlur}
                            value={formik3.values.confirmPassword}
                            placeholder="ConfirmPassword"
                            className={cn('form-input', formik3.errors.confirmPassword && formik3.touched.confirmPassword && 'focus:ring-0 ring-2 ring-red-600')}
                        />
                        {formik3.errors.confirmPassword && formik3.touched.confirmPassword && <div className="text-red-500">{formik3.errors.confirmPassword}</div>}

                        <button
                            type="submit"
                            className="w-full p-3 rounded-full 
                                            bg-emerald-600/20 hover:bg-emerald-600/40 
                                            text-emerald-300 font-semibold 
                                            transition-all duration-300 
                                            active:scale-[0.98]
                                            disabled:opacity-50 disabled:cursor-not-allowed mt-5"
                            disabled={formik3.isSubmitting}
                        >
                            Change Password
                        </button>
                    </form>
                </TabsContent>
            </Tabs>
        </>
    );
};

export default ForgetForm;
