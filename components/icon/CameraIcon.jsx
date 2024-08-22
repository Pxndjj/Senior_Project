import React from "react";

export const CameraIcon = ({ w, h, c }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            className={`icon ${w ? `w-${w}` : "w-6"} ${h ? `h-${h}` : "h-6"}`}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            fill={`${c ? c : "none"}`}
        >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
                <path
                    d="M20 5H16.83L15.41 3.59C15.21 3.39 14.96 3.29 14.7 3.29H9.29C9.03 3.29 8.79 3.39 8.59 3.59L7.17 5H4C2.9 5 2 5.9 2 7V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V7C22 5.9 21.1 5 20 5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM15.5 12C15.5 13.93 13.93 15.5 12 15.5C10.07 15.5 8.5 13.93 8.5 12C8.5 10.07 10.07 8.5 12 8.5C13.93 8.5 15.5 10.07 15.5 12Z"
                    fill={`${c ? c : "#000"}`}
                ></path>
                <circle
                    cx="18"
                    cy="6"
                    r="1"
                    fill={`${c ? c : "#000"}`}
                ></circle>
            </g>
        </svg>
    );
};
