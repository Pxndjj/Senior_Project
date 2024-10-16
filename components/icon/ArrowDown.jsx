import React from "react";

export const ArrowDown = ({ w, h, c }) => {
    return (
        <svg
            viewBox="0 0 1024 1024"
            version="1.1"
            className={`icon ${w ? `w-${w}` : "w-4"} ${h ? `w-${h}` : "h-4"}`}
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
                    d="M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z"
                    fill={`${c ? c : "none"}`}
                ></path>
            </g>
        </svg>
    );
};
