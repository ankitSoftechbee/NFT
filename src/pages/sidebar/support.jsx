import React from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import metaBullApi from '@/api/game-app';
import toast from 'react-hot-toast';
import requestApi from '@/service/service';

// Validation Schema
const TicketSubmissionSchema = Yup.object().shape({
    subject: Yup.string().min(5, 'Subject must be at least 5 characters').max(100, 'Subject must be at most 100 characters').required('Subject is required'),
    message: Yup.string().min(10, 'Message must be at least 10 characters').max(500, 'Message must be at most 500 characters').required('Message is required'),
});

const Support = () => {
    const [openTicketMutation] = metaBullApi.useSupportMutation();

    const handleSubmit = async (values, action) => {
        // action.setSubmitting(true);
        // toast.promise(
        //     openTicketMutation(values)
        //         .unwrap()
        //         .then(payload => {
        //             if (payload === 1) {
        //                 action.setSubmitting(false);
        //                 action.resetForm();
        //                 return payload;
        //             }
        //             throw new Error('Something went wrong');
        //         })
        //         .catch(error => {
        //             action.setSubmitting(false);
        //             console.log(error);
        //             throw error;
        //         }),
        //     {
        //         loading: 'sending...',
        //         success: payload => `ticket opened`,
        //         error: error => `ticket application failed : ${error.message}`,
        //     }
        // );
        const response = await requestApi.supportRaise(values)
        if (response.status === 200) {
            toast.success('Ticket raised successfully');
        } else {
            toast.error('Failed to raise ticket');
        }
    };

    return (
        <div className="w-full bg-[#1d1d1f] rounded-2xl shadow-2xl border border-emerald-500/20 p-6 mx-auto">
            <h2 className="text-2xl font-semibold text-center text-white mb-6">Submit Ticket</h2>
            <Formik
                initialValues={{
                    subject: '',
                    message: '',
                }}
                validationSchema={TicketSubmissionSchema}
                onSubmit={handleSubmit}
            >
                {formik => (
                    <Form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="subject" className="text-gray-300">
                                Subject
                            </Label>
                            <Field
                                name="subject"
                                as={Input}
                                placeholder="Enter ticket subject"
                                className="bg-[#2A2A2A] border-none text-gray-100 
                                    focus:ring-2 focus:ring-emerald-500/50 
                                    placeholder-gray-500"
                            />
                            {formik.touched.subject && formik.errors.subject && <div className="text-red-500 text-sm mt-1">{formik.errors.subject}</div>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-gray-300">
                                Message
                            </Label>
                            <Field
                                name="message"
                                as="textarea"
                                placeholder="Enter your message"
                                className="w-full bg-[#2A2A2A] border-none text-gray-100 
                                    focus:ring-2 focus:ring-emerald-500/50 
                                    placeholder-gray-500 rounded-lg min-h-[120px] p-3"
                            />
                            {formik.touched.message && formik.errors.message && <div className="text-red-500 text-sm mt-1">{formik.errors.message}</div>}
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
                            Submit Ticket
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Support;
