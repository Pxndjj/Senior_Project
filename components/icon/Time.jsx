import React from "react";

export const Time = ({ w, h, c }) => {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`icon ${w ? `w-${w}` : "w-4"} ${h ? `w-${h}` : "h-4"}`}
        >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                    d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                    stroke={`${c ? c : "#000000"}`}
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></path>{" "}
                <path
                    d="M12 6V12"
                    stroke={`${c ? c : "#000000"}`}
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></path>{" "}
                <path
                    d="M16.24 16.24L12 12"
                    stroke={`${c ? c : "#000000"}`}
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></path>{" "}
            </g>
        </svg>
    );
};
