"use client";

import { useBoardersContext } from "@/contexts/BoardersContext";
import { ReactElement } from "react";

const HeaderCard = ({
    className,
    content,
    title,
    postText,
    icon,
    iconBg,
}: {
    title: string;
    content: string;
    className: string;
    postText: string;
    icon: ReactElement;
    iconBg: string;
}) => {
    const cardClass = `p-8 bg-white rounded-2xl border-slate-300 ${className} shadow-lg`;
    return (
        <div className={cardClass}>
            <div className="flex gap-2 items-center">
                <div className={`p-3 rounded-full ${iconBg}`}>{icon}</div>
                <div>
                    <h4 className="text-slate-400 font-normal">{title}</h4>
                    <span className="text-2xl">{content} </span>
                    <span className="text-sm">{postText}</span>
                </div>
            </div>
        </div>
    );
};

const BoarderHeaderCards = () => {
    const { boarders } = useBoardersContext();
    const total = boarders.length;

    const dogIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
        </svg>
    );

    const calendarIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
            />
        </svg>
    );

    const checkIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
        </svg>
    );

    const alertIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
        </svg>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <HeaderCard
                title="Current Boarders"
                content={total.toString()}
                className=""
                postText="Total"
                icon={dogIcon}
                iconBg="bg-emerald-100 text-emerald-600"
            />
            <HeaderCard
                title="Checked Out"
                content="0"
                className=""
                postText="Today"
                icon={checkIcon}
                iconBg="bg-blue-100 text-blue-600"
            />
            <HeaderCard
                title="Arriving Today"
                content="0"
                className=""
                postText="Scheduled"
                icon={calendarIcon}
                iconBg="bg-amber-100 text-amber-600"
            />
            <HeaderCard
                title="Attention Needed"
                content="0"
                className=""
                postText="Alerts"
                icon={alertIcon}
                iconBg="bg-red-100 text-red-600"
            />
        </div>
    );
};

export default BoarderHeaderCards;
