import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import metaBullApi from '@/api/game-app';
import toast from 'react-hot-toast';
import requestApi from '@/service/service';

// Validation Schema
const CryptoWalletSchema = Yup.object().shape({
    usdtWallet: Yup.string(),
    transPassword: Yup.string().required('Transaction Password is required'),
});

const CryptoWallet = () => {
    // const { data: wallet, isLoading, isFetching, isError, error } = metaBullApi.useGetWalletAddressQuery();
    // const [updateWalletMutation] = metaBullApi.useEditWalletAddressMutation();
    const [wallet, setWallet] = useState('')

    useEffect(() => {
        fetchWallet()
    }, [])

    const fetchWallet = async () => {
        const response = await requestApi.getWalletAddress()
        if (response.status === 200) {
            setWallet(response.data)
        }
    }

    const PasswordInput = ({ field, form, placeholder, readOnly }) => (
        <div className="space-y-2 relative">
            <div className="relative">
                <Input
                    type={'text'}
                    placeholder={placeholder}
                    className="bg-[#2A2A2A] border-none text-gray-100 
                        pr-10 focus:ring-2 focus:ring-emerald-500/50 
                        placeholder-gray-500"
                    {...field}
                    readOnly={readOnly}
                />
            </div>
            {form.touched[field.name] && form.errors[field.name] && <div className="text-red-500 text-sm mt-1">{form.errors[field.name]}</div>}
        </div>
    );

    const handleSubmit = async (values, action) => {
        // action.setSubmitting(true);
        // toast.promise(
        //     updateWalletMutation(values)
        //         .unwrap()
        //         .then(payload => {
        //             console.log(payload);
        //             if (payload === 0) throw new Error('Transaction password is incorrect');

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
        //         success: payload => `wallet address updated`,
        //         error: error => `updation failed : ${error.message}`,
        //     }
        // );
        const response = await requestApi.updateCryptoWallet(values)
        if (response.status === 200) {
            toast.success('Updated Successfully')
        } else {
            toast.error('Failed to update')
        }
    };

    return (
        <div className="w-full bg-[#1d1d1f] rounded-2xl shadow-2xl border border-emerald-500/20 p-6 mx-auto">
            <Formik
                initialValues={{
                    usdtWallet: wallet?.usdtWallet || '',
                    transPassword: '',
                }}
                enableReinitialize
                validationSchema={CryptoWalletSchema}
                onSubmit={handleSubmit}
            >
                {formik => (
                    <Form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="usdtWallet" className="text-gray-300">
                                USDT wallet address
                            </Label>
                            <Field disabled name="usdtWallet" component={PasswordInput} placeholder="Enter USDT wallet address" readOnly={wallet?.usdtWallet ? true : false} />
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
