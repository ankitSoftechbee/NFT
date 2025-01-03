import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Eye, EyeOff } from 'lucide-react';
import metaBullApi from '@/api/game-app';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import COUNTRIES from '@/lib/countryCodes.json';
import { v4 as uuidv4 } from 'uuid';

const SignupForm = ({}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [checkSponsorId] = metaBullApi.useLazyCheckSponsorIdQuery();
    const [signupMutation] = metaBullApi.useSignupMutation();
    const [emailMutation] = metaBullApi.useEmailAfterSignupMutation();
    const [getUserDetail] = metaBullApi.useLazyUserDetailQuery();
    const [sponsorName, setSponsorName] = useState('');
    let [searchParams] = useSearchParams();

    const formik = useFormik({
        initialValues: {
            sponsorID: searchParams.get('sponsorId') || '',
            name: '',
            email: '',
            country: '',
            code: '',
            mobile: '',
            password: '',
        },
        validationSchema: Yup.object().shape({
            sponsorID: Yup.string().required('SponsorID is required'),
            name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            country: Yup.string().required('Country is required'),
            code: Yup.string().required('Phone code is required'),
            mobile: Yup.string()
                .matches(/^[0-9]+$/, 'Mobile number must be numeric')
                .min(8, 'Mobile number is too short')
                .max(15, 'Mobile number is too long')
                .required('Mobile number is required'),
            password: Yup.string().min(3, 'Password must be at least 3 characters').required('Password is required'),
        }),
        onSubmit: (values, action) => {
            action.setSubmitting(false);

            toast.promise(
                signupMutation({
                    ...values,
                    code: values.code.slice(1),
                })
                    .unwrap()
                    .then(async payload => {
                        if (payload.status === -1) throw new Error('Wrong details');

                        // Execute getUserDetail
                        try {
                            const userDetail = await getUserDetail({ userName: payload.userID }).unwrap();
                            toast(
                                t => (
                                    <span>
                                        <div className="font-bold">Login Successful.. Note login id</div>
                                        <div>
                                            Login ID: <span className="font-medium">{userDetail.username}</span>
                                        </div>
                                        <button className="border p-1 mt-5 rounded-sm bg-emerald-600 hover:bg-emerald-600/40 text-white" onClick={() => toast.dismiss(t.id)}>
                                            Dismiss
                                        </button>
                                    </span>
                                ),
                                { duration: 120000 }
                            );
                        } catch (error) {
                            console.error('Error fetching user details:', error);
                            throw error;
                        }

                        // Execute emailMutation
                        try {
                            const emailResponse = await emailMutation({ userName: payload.userID }).unwrap();
                            console.log('Email sent:', emailResponse);
                        } catch (emailError) {
                            console.error('Error in email mutation:', emailError);
                            throw emailError;
                        }

                        // Reset form after all successful operations
                        action.setSubmitting(false);
                        action.resetForm();

                        return payload;
                    })
                    .catch(error => {
                        action.setSubmitting(false);
                        console.error('Error in signup or other operations:', error);
                        throw error;
                    }),
                {
                    loading: 'registering...',
                    success: payload => `Registration successful, login please`,
                    error: error => `Registration failed: ${error.message}`,
                }
            );
        },
    });

    useEffect(() => {
        handleCheckSponsorId(searchParams.get('sponsorId') || '');
    }, [searchParams]);

    const handleCountryChange = value => {
        formik.setFieldValue('country', value);
        const selectedCountry = COUNTRIES.find(curr => curr.name === value);
        formik.setFieldValue('code', selectedCountry ? selectedCountry.dial_code : '');
    };

    const handleCheckSponsorId = async value => {
        formik.setFieldValue('sponsorID', value);

        await checkSponsorId(value)
            .unwrap()
            .then(payload => {
                setSponsorName(payload.name);
                return payload;
            })
            .catch(error => {
                console.log(error);
                throw error;
            });
    };

    return (
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-2">
            <label htmlFor="sponsorID" className="text-white">
                Sponsor ID
                {formik.touched.sponsorID ? sponsorName ? <span className="text-emerald-500"> ( {sponsorName} )</span> : <span className="text-red-500"> ( No Sponsor Found )</span> : null}
            </label>

            <input
                id="sponsorID"
                name="sponsorID"
                type="text"
                onChange={e => handleCheckSponsorId(e.target.value)}
                onBlur={formik.handleBlur}
                value={formik.values.sponsorID}
                placeholder="Sponsor ID"
                className={cn('form-input', formik.errors.sponsorID && formik.touched.sponsorID && 'focus:ring-0 ring-2 ring-red-600')}
            />
            {formik.errors.sponsorID && formik.touched.sponsorID && <div className="text-red-500">{formik.errors.sponsorID}</div>}

            <label htmlFor="name" className="text-white">
                Name
            </label>

            <input
                id="name"
                name="name"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                placeholder="Enter Name"
                className={cn('form-input', formik.errors.name && formik.touched.name && 'focus:ring-0 ring-2 ring-red-600')}
            />
            {formik.errors.name && formik.touched.name && <div className="text-red-500">{formik.errors.name}</div>}

            <label htmlFor="email" className="text-white">
                Email
            </label>

            <input
                id="email"
                name="email"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                placeholder="Enter Email"
                className={cn('form-input', formik.errors.email && formik.touched.email && 'focus:ring-0 ring-2 ring-red-600')}
            />
            {formik.errors.email && formik.touched.email && <div className="text-red-500">{formik.errors.email}</div>}

            <label htmlFor="country" className="text-white">
                Country
            </label>

            <select
                id="country"
                name="country"
                type="text"
                onChange={e => handleCountryChange(e.target.value)}
                onBlur={formik.handleBlur}
                value={formik.values.country}
                placeholder="Enter Country"
                className={cn('form-input', formik.errors.country && formik.touched.country && 'focus:ring-0 ring-2 ring-red-600')}
            >
                <option value="">Select Country</option>
                {COUNTRIES.map(country => (
                    <option value={country.name} key={uuidv4()}>
                        {country.name}
                    </option>
                ))}
            </select>
            {formik.errors.country && formik.touched.country && <div className="text-red-500">{formik.errors.country}</div>}

            <label htmlFor="mobile" className="text-white">
                Mobile
            </label>
            <div className="flex items-center gap-2">
                <select
                    id="code"
                    name="code"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.code}
                    placeholder="Select Code"
                    className={cn('form-input max-w-[90px]', formik.errors.code && formik.touched.code && 'focus:ring-0 ring-2 ring-red-600')}
                >
                    <option value="+91">+91</option>
                    {COUNTRIES.map(country => (
                        <option value={country.dial_code} className="text-emerald-300" key={uuidv4()}>
                            {country.dial_code}
                        </option>
                    ))}
                </select>
                <input
                    id="mobile"
                    name="mobile"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.mobile}
                    placeholder="Enter Mobile"
                    className={cn('form-input w-full', formik.errors.mobile && formik.touched.mobile && 'focus:ring-0 ring-2 ring-red-600')}
                />
            </div>
            {formik.errors.mobile && formik.touched.mobile && <div className="text-red-500">{formik.errors.mobile}</div>}
            {formik.errors.code && formik.touched.code && <div className="text-red-500">{formik.errors.code}</div>}

            <label htmlFor="password" className="text-white">
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

            <button
                type="submit"
                className="w-full p-3 rounded-full 
                                            bg-emerald-600/20 hover:bg-emerald-600/40 
                                            text-emerald-300 font-semibold 
                                            transition-all duration-300 
                                            active:scale-[0.98]
                                            disabled:opacity-50 disabled:cursor-not-allowed mt-5"
                disabled={formik.isSubmitting}
            >
                Create Account
            </button>
        </form>
    );
};

export default SignupForm;
