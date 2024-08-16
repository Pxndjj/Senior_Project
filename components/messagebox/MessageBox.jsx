"use client";
import React from 'react';

const statusStyles = {
    success: "bg-green-500 text-white",
    waiting: "bg-yellow-500 text-white",
    error: "bg-red-500 text-white",
};

const MessageBox = ({ message, status }) => {
    const statusClass = statusStyles[status] || "bg-gray-500 text-white";

    return (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${statusClass} max-w-sm w-full`}>
            <p>{message}</p>
        </div>
    );
};

export default MessageBox;
