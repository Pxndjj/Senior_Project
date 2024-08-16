"use client"
import React, { useState } from "react";

export default function Upload() {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');

    const handleChange = (event) => {
        setFile(event.target.files[0]);
        setFileName(event.target.files[0].name);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', fileName);
        formData.append('uploaderName', "99");
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/storage/create`, {
                method: 'POST',
                body: formData,
            });
            console.log('File uploaded successfully');
        } catch (error) {
            console.error('Error uploading file: ', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleChange} />
                <button type="submit">Upload</button>
            </form>

            <p>{fileName}</p>
        </div>
    );
}
