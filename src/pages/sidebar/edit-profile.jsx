import React from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import metaBullApi from '@/api/game-app';
import moment from 'moment/moment';
import toast from 'react-hot-toast';

// Validation Schema
const PersonalDetailsSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Full Name must be at least 2 characters').required('Full Name is required'),
    address: Yup.string().min(5, 'Address must be at least 5 characters').required('Address is required'),
    mobile: Yup.string()
        .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
        .required('Mobile number is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
});

const EditProfile = () => {
    const { data: profileData, isLoading, isFetching } = metaBullApi.useProfileQuery({ UserName: JSON.parse(window.localStorage.getItem('metabull-user')).userName });
    const [updateProfileMutation] = metaBullApi.useEditProfileMutation();

    const handleSubmit = (values, action) => {
        action.setSubmitting(true);
        toast.promise(
            updateProfileMutation(values)
                .unwrap()
                .then(payload => {
                    console.log(payload);
                    action.setSubmitting(false);
                    return payload;
                })
                .catch(error => {
                    action.setSubmitting(false);
                    console.log(error);
                    throw error;
                }),
            {
                loading: 'updating...',
                success: payload => `profile updated`,
                error: error => `updation failed : ${error}`,
            }
        );
    };

    if (isLoading || isFetching) return <div>Fetching Profile Data...</div>;

    return (
        <>
            <div className="w-full bg-[#1d1d1f] rounded-2xl shadow-2xl border border-emerald-500/20 p-4 mx-auto">
                <h2 className="text-2xl font-semibold text-center text-white mb-6">Admission Detail</h2>
                <div className="flex gap-2 mb-1">
                    <div>User ID : </div>
                    <div className="text-app-text-primary font-medium">{profileData?.username}</div>
                </div>
                <div className="flex gap-2 mb-1">
                    <div>Date of Joining : </div>
                    <div className="text-app-text-primary font-medium">{moment(profileData?.dateofjoin).format('L')}</div>
                </div>
                <div className="flex gap-2 mb-1">
                    <div>Reff ID : </div>
                    <div className="text-app-text-primary font-medium">{profileData?.reffid || '-'}</div>
                </div>
                <div className="flex gap-2">
                    <div>Reff Name : </div>
                    <div className="text-app-text-primary font-medium">{profileData?.reffname || '-'}</div>
                </div>
            </div>
            <div className="w-full bg-[#1d1d1f] rounded-2xl shadow-2xl border border-emerald-500/20 p-6 mx-auto mt-5">
                <h2 className="text-2xl font-semibold text-center text-white mb-6">Personal Details</h2>
                <Formik
                    initialValues={{
                        name: profileData?.name || '',
                        email: profileData?.email || '',
                        mobile: profileData?.mobile || '',
                        address: profileData?.address || '',
                    }}
                    validationSchema={PersonalDetailsSchema}
                    onSubmit={handleSubmit}
                >
                    {formik => (
                        <Form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-gray-300">
                                    Full Name
                                </Label>
                                <Field
                                    name="name"
                                    as={Input}
                                    placeholder="Enter your full name"
                                    className="bg-[#2A2A2A] border-none text-gray-100 
                                        focus:ring-2 focus:ring-emerald-500/50 
                                        placeholder-gray-500"
                                />
                                {formik.touched.name && formik.errors.name && <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-300">
                                    Email Address
                                </Label>
                                <Field
                                    name="email"
                                    as={Input}
                                    type="email"
                                    placeholder="Enter your email"
                                    readOnly
                                    className="bg-[#2A2A2A] border-none text-gray-100 
                                        focus:ring-2 focus:ring-emerald-500/50 
                                        placeholder-gray-500"
                                />
                                {formik.touched.email && formik.errors.email && <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="mobile" className="text-gray-300">
                                    Mobile Number
                                </Label>
                                <Field
                                    name="mobile"
                                    as={Input}
                                    type="tel"
                                    placeholder="Enter your mobile number"
                                    className="bg-[#2A2A2A] border-none text-gray-100 
                                        focus:ring-2 focus:ring-emerald-500/50 
                                        placeholder-gray-500"
                                />
                                {formik.touched.mobile && formik.errors.mobile && <div className="text-red-500 text-sm mt-1">{formik.errors.mobile}</div>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-gray-300">
                                    Address
                                </Label>
                                <Field
                                    name="address"
                                    as={Input}
                                    placeholder="Enter your address"
                                    className="bg-[#2A2A2A] border-none text-gray-100 
                                        focus:ring-2 focus:ring-emerald-500/50 
                                        placeholder-gray-500"
                                />
                                {formik.touched.address && formik.errors.address && <div className="text-red-500 text-sm mt-1">{formik.errors.address}</div>}
                            </div>

                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="w-full p-3 rounded-full 
                                    bg-emerald-600/20 hover:bg-emerald-600/40 
                                    text-emerald-300 font-semibold 
                                    transition-all duration-300 
                                    hover:scale-[1.02] active:scale-[0.98]
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Save
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    );
};

export default EditProfile;
