"use client"
import React from "react";

interface Props {
    onClick?: () => void;
    children?: React.ReactNode;
}

export default function ButtonOutlined({ onClick, children }: Props) {
    return (
        <div>
            <button
                onClick={onClick}
                className="bg-transparent hover:bg-white text-white font-semibold hover:text-black py-2 px-4 border border-white hover:border-transparent rounded"
            >
                {children}
            </button>
        </div>
    )
}
