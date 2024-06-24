"use client";
import { usePathname } from 'next/navigation'
import { actionRevalidatePath } from '@/actions/action-revalidate-path';

const postUpload = async (imageObject) => {
    try {
        const formData = new FormData();
        formData.append('images', imageObject.file);
        formData.append('refID', JSON.stringify(imageObject.refID));
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/gallery/`, {
            method: 'POST',
            body: formData
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const GalleryUpload = ({ params, totalPhoto }) => {
    const pathname = usePathname();
    
    const onUpload = async (imagesFiles) => {
        for (const file of imagesFiles) {
            if (!file.type.startsWith('image/')) {
                alert('Please upload only image files.');
                continue;
            }
            await postUpload({ refID: params, file });
        }
        actionRevalidatePath(pathname);
    }

    return (
        <div className="flex items-center justify-center ">
            <span className='list-total-title'>Total: </span> <span className='px-3 list-total'>{totalPhoto}</span>
            <label htmlFor="file-upload" className="relative cursor-pointer hover:bg-blue-500 bg-gray-200 text-gray-700 hover:text-white font-semibold py-2 px-4 rounded-2xl flex items-center">
                <span className="material-symbols-outlined mr-2">upload</span>
                <span>upload</span>
                <input type="file"
                    id="file-upload"
                    accept="image/*"
                    multiple
                    className="absolute hidden"
                    onChange={(e) => { onUpload(e.target.files) }}
                />
            </label>
        </div>
    )
}

export default GalleryUpload;
