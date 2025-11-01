"use client"
import React from "react";

interface Props {
    onClick?: () => void;
    children?: React.ReactNode;
}

export default function ButtonPrimary({ onClick, children }: Props) {
    return (
        <div>
            <button
                onClick={onClick}
                className="bg-white text-black font-semibold py-2 px-4 border border-gray-400 hover:border-transparent rounded"
            >
                {children}
            </button>
        </div>
    )
}
