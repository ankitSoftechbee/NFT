import React from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import metaBullApi from '@/api/game-app';
import toast from 'react-hot-toast';

// Validation Schema
const CryptoWalletSchema = Yup.object().shape({
    mbWallet: Yup.string(),
    usdtWallet: Yup.string(),
    transPassword: Yup.string().required('Transaction Password is required'),
});

const CryptoWallet = () => {
    const { data: wallet, isLoading, isFetching, isError, error } = metaBullApi.useGetWalletAddressQuery();
    const [updateWalletMutation] = metaBullApi.useEditWalletAddressMutation();

    // Loading state
    if (isLoading || isFetching) {
        return <div className="w-full mx-auto text-center text-white">Loading wallet details...</div>;
    }

    // Error state
    if (isError) {
        return <div className="w-full mx-auto text-center text-red-500">Error loading wallet details: {error?.message || 'Unknown error'}</div>;
    }

    const PasswordInput = ({ field, form, placeholder }) => (
        <div className="space-y-2 relative">
            <div className="relative">
                <Input
                    type={'text'}
                    placeholder={placeholder}
                    className="bg-[#2A2A2A] border-none text-gray-100 
                        pr-10 focus:ring-2 focus:ring-emerald-500/50 
                        placeholder-gray-500"
                    {...field}
                />
            </div>
            {form.touched[field.name] && form.errors[field.name] && <div className="text-red-500 text-sm mt-1">{form.errors[field.name]}</div>}
        </div>
    );

    const handleSubmit = (values, action) => {
        action.setSubmitting(true);
        toast.promise(
            updateWalletMutation(values)
                .unwrap()
                .then(payload => {
                    console.log(payload);
                    if (payload === 0) throw new Error('Transaction password is incorrect');

                    action.setSubmitting(false);
                    action.resetForm();
                    return payload;
                })
                .catch(error => {
                    action.setSubmitting(false);
                    console.log(error);
                    throw error;
                }),
            {
                loading: 'updating...',
                success: payload => `wallet address updated`,
                error: error => `updation failed : ${error.message}`,
            }
        );
    };

    return (
        <div className="w-full bg-[#1d1d1f] rounded-2xl shadow-2xl border border-emerald-500/20 p-6 mx-auto">
            <Formik
                initialValues={{
                    mbWallet: wallet?.mbwallet || '',
                    usdtWallet: wallet?.usdtWallet || '',
                    transPassword: '',
                }}
                validationSchema={CryptoWalletSchema}
                onSubmit={handleSubmit}
            >
                {formik => (
                    <Form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="mbWallet" className="text-gray-300">
                                MB wallet addess
                            </Label>
                            <Field name="mbWallet" component={PasswordInput} placeholder="Enter MB wallet address" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="usdtWallet" className="text-gray-300">
                                USDT wallet address
                            </Label>
                            <Field name="usdtWallet" component={PasswordInput} placeholder="Enter USDT wallet address" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="transPassword" className="text-gray-300">
                                Transaction Password
                            </Label>
                            <Field name="transPassword" component={PasswordInput} placeholder="Enter your transition password" />
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
    );
};

export default CryptoWallet;
