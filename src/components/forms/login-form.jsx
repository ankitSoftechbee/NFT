import React, { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Eye, EyeOff } from 'lucide-react';
import metaBullApi from '@/api/game-app';
import toast from 'react-hot-toast';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import requestApi from '@/service/service';

const LoginForm = ({ }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [loginMutation] = metaBullApi.useLoginMutation();
    const [dailyClosingMutation] = metaBullApi.useDailyClosingMutation();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        const response = await requestApi.loginReq(values);
        if (response.token) {
            const res=await requestApi.triggerAPI({})
            toast.success('login successfully')
            localStorage.setItem('access_token', response.token)
            localStorage.setItem('token-expireIn', response.expireIn);
            sessionStorage.setItem('user',JSON.stringify(response.user))
            navigate('/home')
            formik.resetForm()
        } else {
            toast.error('Invalid username or password');
            formik.resetForm()
        }
    }

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object().shape({
            username: Yup.string().required('Username is required'),
            password: Yup.string().min(3, 'Password must be at least 3 characters').required('Password is required'),
        }),
        onSubmit: handleSubmit
        // onSubmit: (values, action) => {
        //     action.setSubmitting(true);
        //     toast.promise(
        //         loginMutation({
        //             username: values.email,
        //             password: values.password,
        //         })
        //             .unwrap()
        //             .then(payload => {
        //                 window.localStorage.setItem('metabull-token', payload.token);
        //                 window.localStorage.setItem('metabull-expireIn', payload.expireIn);
        //                 window.localStorage.setItem('metabull-user', JSON.stringify(payload.user));

        //                 dailyClosingMutation()
        //                     .unwrap()
        //                     .then(payload => console.log('closing hit'))
        //                     .catch(err => console.log('closing miss'));

        //                 navigate('/home');
        //                 action.resetForm();
        //                 action.setSubmitting(false);
        //                 return payload;
        //             })
        //             .catch(error => {
        //                 action.setSubmitting(false);
        //                 console.log(error);
        //                 throw error;
        //             }),
        //         {
        //             loading: 'logging in',
        //             success: payload => `Welcome, ${payload.user.name}`,
        //             error: error => `login failed : Incorrect email or password`,
        //         }
        //     );
        // },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
            <label htmlFor="phoneNo" className="text-white">
                Username
            </label>
            <input
                id="username"
                name="username"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                placeholder="Username"
                className={cn('form-input', formik.errors.username && formik.touched.username && 'focus:ring-0 ring-2 ring-red-600')}
            />
            {formik.errors.username && formik.touched.username && <div className="text-red-500">{formik.errors.username}</div>}
            <label htmlFor="password" className="text-white mt-2">
                Password
            </label>
            <div className="flex items-center relative">
                <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    placeholder="Password"
                    className={cn('form-input w-full', formik.errors.password && formik.touched.password && 'focus:ring-0 ring-2 ring-red-600')}
                />
                {showPassword ? (
                    <EyeOff onClick={() => setShowPassword(!showPassword)} className="text-gold cursor-pointer absolute right-3 hover:text-emerald-500" />
                ) : (
                    <Eye onClick={() => setShowPassword(!showPassword)} className="text-gold cursor-pointer absolute right-3 hover:text-emerald-500" />
                )}
            </div>
            {formik.errors.password && formik.touched.password && <div className="text-red-500">{formik.errors.password}</div>}
            <div className="flex justify-end text-sm text-red-800">
                <NavLink to="/forget" replace>
                    Forget password
                </NavLink>
            </div>
            <button
                type="submit"
                className="w-full p-3 rounded-full 
                                            bg-gradient-to-r from-[#f539f8] via-[#c342f9] to-[#5356fb]
                                            transition-all duration-300 
                                            active:scale-[0.98]
                                            disabled:opacity-50 disabled:cursor-not-allowed mt-5"
                disabled={formik.isSubmitting}
            >
                Login
            </button>
        </form>
    );
};

export default LoginForm;
