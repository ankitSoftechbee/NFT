import React, { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Eye, EyeOff } from 'lucide-react';
import metaBullApi from '@/api/game-app';
import toast from 'react-hot-toast';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import COUNTRIES from '@/lib/countryCodes.json';
import { v4 as uuidv4 } from 'uuid';
import requestApi from '@/service/service';
import axios from 'axios';
import { authAPIConfig } from '@/api/apiConfig';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';



const validationSchema = Yup.object().shape({
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
})

const SignupForm = ({ }) => {
    const navigate = useNavigate()
    const routparams = useParams()
    const [showPassword, setShowPassword] = useState(false);
    const [countryList, setCountryList] = useState([])
    const [isSponsor, setIsSponsor] = useState(false)
    const [sponsor, setSponsor] = useState('')
    const [debounceTimer, setDebounceTimer] = useState(null);
    const [open, setOpen] = useState(false)
    const [userDetails, setUserDetails] = useState('')

    useEffect(() => {
        const { sponsorID, user } = routparams
        if (sponsorID !== '0' && user !== '0') {
            formik.setFieldValue('sponsorID', sponsorID)
            setSponsor({ name: user })
            setIsSponsor(true)
        }
    }, [])

    useEffect(() => {
        fetchCountryList()
    }, [])

    const fetchCountryList = async () => {
        const response = await requestApi.countryList()
        if (response.data && response.data.length > 0) {
            setCountryList(response.data)
        }
    }

    const handleSubmit = async (values) => {
        if (isSponsor) {
            const response = await requestApi.signupReq(values)
            if (response && response.newUser) {
                setUserDetails(response)
                toast.success('Signup successfully')
                const formData = new FormData()
                formData.append('userName', response.newUser)
                const emailResponse = await requestApi.sendEmail(formData)
                setOpen(true)
                toast.success('Email sent successfully')
                formik.resetForm()
            } else {
                toast.error('Signup Failed')
            }
        } else {
            toast.error('Invalid Sponsor ID !')
        }
    }

    const formik = useFormik({
        initialValues: {
            sponsorID: '',
            name: '',
            email: '',
            country: '',
            code: '',
            mobile: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    const checkSponserId = useCallback((sponserId) => {
        if (!sponserId) return;

        axios.get(authAPIConfig.checkSponsor, {
            params: {
                UserName: sponserId
            }
        }).then((response) => {
            if (response.data.name !== null) {
                setIsSponsor(true);
                setSponsor(response.data)
            } else {
                setIsSponsor(false);
                toast.error("Invalid Sponser ID !");
            }
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    const handleSponserIdChange = (e) => {
        formik.handleChange(e); // Call formik's handler for controlled input
        const { value } = e.target;

        if (debounceTimer) {
            clearTimeout(debounceTimer); // Clear the previous timer if user types again
        }

        // Set a new timeout to call the API after 3 seconds
        const newTimer = setTimeout(() => {
            checkSponserId(value);
        }, 3000);

        setDebounceTimer(newTimer);
    };

    const handleClose = () => {
        setOpen(false)
        navigate('/')
    }


    return (
        <>
            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-2">
                <label htmlFor="sponsorID" className="text-white">
                    Sponsor ID
                    {sponsor ? <span className="text-emerald-500"> ( {sponsor.name} )</span> : ''}
                </label>

                <input
                    id="sponsorID"
                    name="sponsorID"
                    type="text"
                    onChange={handleSponserIdChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.sponsorID}
                    placeholder="Sponsor ID"
                    readOnly={routparams.sponsorID !== '0'}
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
                    onChange={e => {
                        formik.setFieldValue('country', e.target.value)
                        formik.setFieldValue('code', countryList.length > 0 ? countryList.find((country) => country.country === e.target.value).code : '')
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values.country}
                    placeholder="Enter Country"
                    className={cn('form-input', formik.errors.country && formik.touched.country && 'focus:ring-0 ring-2 ring-red-600')}
                >
                    <option value="">Select Country</option>
                    {countryList.map(country => (
                        <option value={country.country} key={uuidv4()}>
                            {country.country}
                        </option>
                    ))}
                </select>
                {formik.errors.country && formik.touched.country && <div className="text-red-500">{formik.errors.country}</div>}

                <label htmlFor="mobile" className="text-white">
                    Mobile
                </label>
                <div className="flex gap-2">
                    <div className="basis-1/5">
                        <input
                            id="code"
                            name="code"
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.code}
                            placeholder="Code"
                            style={{ width: '100%' }}
                            className={cn('form-input', formik.errors.code && formik.touched.code && 'focus:ring-0 ring-2 ring-red-600')}
                        />
                        {formik.errors.code && formik.touched.code && <div className="text-red-500">{formik.errors.code}</div>}
                    </div>
                    <div className="basis-4/5">
                        <input
                            id="mobile"
                            name="mobile"
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.mobile}
                            placeholder="Enter Mobile"
                            style={{ width: '100%' }}
                            className={cn('form-input w-full', formik.errors.mobile && formik.touched.mobile && 'focus:ring-0 ring-2 ring-red-600')}
                        />
                {formik.errors.mobile && formik.touched.mobile && <div className="text-red-500">{formik.errors.mobile}</div>}                {formik.errors.code && formik.touched.code && <div className="text-red-500">{formik.errors.code}</div>}
                    </div>
                </div>

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
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="bg-[#1d1d1f] border-emerald-500/20">
                    <DialogHeader>
                        <DialogTitle className="text-white"></DialogTitle>
                    </DialogHeader>
                    {/* <h2 className="text-center text-lg font-bold mb-4">OTP Verification</h2> */}
                    <p className="text-center mb-6">
                        Congratulations! <span className="text-purple-500">Your registration has been successful.</span>
                    </p>
                    <div className="bg-gray-700 p-4 rounded-lg mb-4">
                        <p className="text-center mb-2">
                            <strong>User Details:</strong>
                        </p>
                        <p className="text-sm">
                            <span className="font-bold">Username:</span> {userDetails?.newUser || ''}
                        </p>
                        <p className="text-sm">
                            <span className="font-bold">Password:</span> {userDetails?.outputPassword || ''}
                        </p>
                        <p className="text-sm">
                            <span className="font-bold">Transacion Password:</span> {userDetails?.transPassword || ''}
                        </p>
                    </div>
                    <p className="text-center text-sm">
                        Please use the above credentials to log in. Thank you!
                    </p>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default SignupForm;
