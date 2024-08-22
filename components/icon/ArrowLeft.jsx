import React from "react";

export const ArrowLeft = ({ w, h, c }) => {
    return (
        <svg
            viewBox="0 0 1024 1024"
            className={`icon ${w ? `w-${w}` : "w-4"} ${h ? `w-${h}` : "h-4"}`}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            fill={`${c ? c : "none"}`}
        >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
                <path
                    d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z"
                    fill={`${c ? c : "none"}`}
                ></path>
            </g>
        </svg>
    );
};
