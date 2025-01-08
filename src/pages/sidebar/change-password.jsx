import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Pause } from 'lucide-react';
import metaBullApi from '@/api/game-app';
import toast from 'react-hot-toast';
import requestApi from '@/service/service';

// Validation Schema
const ChangePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Current Password is required'),
    newPassword: Yup.string().min(3, 'New Password must be at least 3 characters').required('New Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm Password is required'),
});

const ChangePassword = () => {
    const [changePasswordMutation] = metaBullApi.useChangePasswordMutation();

    const [showPasswords, setShowPasswords] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    const togglePasswordVisibility = field => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const PasswordInput = ({ field, form, showPassword, togglePasswordVisibility, placeholder }) => (
        <div className="space-y-2 relative">
            <div className="relative">
                <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={placeholder}
                    className="bg-[#2A2A2A] border-none text-gray-100 
                        pr-10 focus:ring-2 focus:ring-emerald-500/50 
                        placeholder-gray-500"
                    {...field}
                />
                <button
                    type="button"
                    onClick={() => togglePasswordVisibility(field.name)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 
                        text-gray-400 hover:text-emerald-400 
                        transition-colors"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            {form.touched[field.name] && form.errors[field.name] && <div className="text-red-500 text-sm mt-1">{form.errors[field.name]}</div>}
        </div>
    );

    const handleSubmit = async (values, action) => {
        const body = { OldPassword: values.currentPassword, NewPassword: values.newPassword }
        // action.setSubmitting(true);
        // toast.promise(
        //     changePasswordMutation({ currentPassword: values.currentPassword, newPassword: values.newPassword })
        //         .unwrap()
        //         .then(payload => {
        //             if (payload === 0) throw new Error('current password is incorrect');

        //             action.setSubmitting(false);
        //             action.resetForm();
        //             return payload;
        //         })
        //         .catch(error => {
        //             action.setSubmitting(false);
        //             console.log(error);
        //             throw error;
        //         }),
        //     {
        //         loading: 'updating...',
        //         success: payload => `password updated`,
        //         error: error => `updation failed : ${error.message}`,
        //     }
        // );
        const response = await requestApi.changePassword(body)
        if (response.status === 200) {
            toast.success('password updated')
        } else {
            toast.error('updation failed')
        }
    };

    return (
        <div className="w-full bg-[#1d1d1f] rounded-2xl shadow-2xl border border-emerald-500/20 p-6 mx-auto">
            <Formik
                initialValues={{
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                }}
                validationSchema={ChangePasswordSchema}
                onSubmit={handleSubmit}
            >
                {formik => (
                    <Form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword" className="text-gray-300">
                                Current Password
                            </Label>
                            <Field
                                name="currentPassword"
                                component={PasswordInput}
                                showPassword={showPasswords.currentPassword}
                                togglePasswordVisibility={togglePasswordVisibility}
                                placeholder="Enter current password"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword" className="text-gray-300">
                                New Password
                            </Label>
                            <Field
                                name="newPassword"
                                component={PasswordInput}
                                showPassword={showPasswords.newPassword}
                                togglePasswordVisibility={togglePasswordVisibility}
                                placeholder="Enter new password"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-gray-300">
                                Confirm Password
                            </Label>
                            <Field
                                name="confirmPassword"
                                component={PasswordInput}
                                showPassword={showPasswords.confirmPassword}
                                togglePasswordVisibility={togglePasswordVisibility}
                                placeholder="Confirm new password"
                            />
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
                            Change Password
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ChangePassword;
