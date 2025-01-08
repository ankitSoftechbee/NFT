import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import metaBullApi from '@/api/game-app';
import requestApi from '@/service/service';

const PictureUploadSchema = Yup.object().shape({
    picture: Yup.mixed()
        .required('A picture is required')
        .test('fileSize', 'File too large', value => {
            return value && value.size <= 5 * 1024 * 1024; // 5MB limit
        })
        .test('fileType', 'Unsupported file type', value => {
            return value && ['image/jpeg', 'image/png'].includes(value.type);
        }),
});

const UpdateProfilePic = () => {
    const [selectedPicture, setSelectedPicture] = useState(null);
    const [UpdateProfilePicMutation] = metaBullApi.useUpdateProfilePicMutation();

    const formik = useFormik({
        initialValues: {
            picture: null,
        },
        validationSchema: PictureUploadSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            const formData = new FormData();
            formData.append('file', values.picture);

            setSubmitting(true);

            // toast.promise(
            //     UpdateProfilePicMutation(formData)
            //         .unwrap()
            //         .then(payload => {
            //             console.log(payload);
            //             resetForm();
            //             setSubmitting(false);
            //             setReceiptFile(null);
            //             setSelectedMode(null);
            //         })
            //         .catch(error => {
            //             console.log(error);
            //             setSubmitting(false);
            //             throw error;
            //         }),
            //     {
            //         loading: 'updating...',
            //         success: payload => `update successful`,
            //         error: error => `update failed : ${error}`,
            //     }
            // );
            const response = await requestApi.updateProfilePicture(formData)
            if (response.status === 200) {
                toast.success('Profile picture updated successfully')
                setSubmitting(false)
            } else {
                toast.error('Failed to update profile picture')
            }
        },
    });

    // Picture upload handler
    const handleFileUpload = event => {
        const file = event.target.files[0];
        if (file) {
            setSelectedPicture(file);
            formik.setFieldValue('picture', file);
        }
    };

    return (
        <div className="w-full mx-auto p-4 bg-[#1d1d1f] rounded-lg">
            <h2 className="text-lg font-semibold text-white mb-4">Picture Upload</h2>

            <form onSubmit={formik.handleSubmit} className="space-y-4 bg-[#2a2a2c] p-6 rounded-2xl border border-emerald-500/20">
                <div>
                    <label className="block text-white mb-2">Picture</label>
                    <div className="flex items-center space-x-2">
                        <input type="file" id="picture" name="picture" accept="image/jpeg,image/png,image/gif" onChange={handleFileUpload} className="hidden" />
                        <label
                            htmlFor="picture"
                            className="flex items-center justify-center w-full p-4 border-2 border-dashed border-emerald-500/20 rounded-lg cursor-pointer hover:bg-emerald-500/10 transition"
                        >
                            <Upload className="mr-2 h-5 w-5 text-white" />
                            <span className="text-white">{selectedPicture ? selectedPicture.name : 'Upload Picture'}</span>
                        </label>
                    </div>
                    {formik.errors.picture && formik.touched.picture && <div className="text-red-500 text-sm mt-1">{formik.errors.picture}</div>}
                </div>

                {selectedPicture && (
                    <div className="mt-4">
                        <p className="text-white mb-2">Preview:</p>
                        <img src={URL.createObjectURL(selectedPicture)} alt="Preview" className="max-w-full h-auto rounded-lg border border-emerald-500/20" />
                    </div>
                )}

                <Button type="submit" disabled={formik.isSubmitting || !selectedPicture} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                    {formik.isSubmitting ? 'Uploading...' : 'Upload Picture'}
                </Button>
            </form>
        </div>
    );
};

export default UpdateProfilePic;
