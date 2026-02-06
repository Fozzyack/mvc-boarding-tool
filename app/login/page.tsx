"use client";

import getBackendUrl from "@/utils/db/getBackendUrl";
import { useRef, useState } from "react";

const LoginPage = () => {
    const emailInput = useRef<HTMLInputElement>(null);
    const passwordInput = useRef<HTMLInputElement>(null);

    const [formInfo, setFormInfo] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const toggleShowPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setShowPassword((prev) => !prev);
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormInfo((prev) => ({ ...prev, [e.target.name]: value }));
    };

    const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await fetch(`${getBackendUrl()}/api/login`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    email: formInfo.email,
                    password: formInfo.password,
                }),
            });
            if (!res.ok) {
                console.log("This$uns???");
                setErrorMessage(
                    "There was an error logging you in, please try again later",
                );
            } else {
                const data = await res.json();
                console.log(data);
                setErrorMessage("");
            }
        } catch (error) {
            setErrorMessage(
                "There was an error logging you in, please try again later",
            );
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center md:grid md:grid-cols-2">
            <div className="hidden md:flex flex-col justify-between bg-emerald-200 h-full p-12">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-emerald-800">
                        Bark & Board
                    </h1>
                    <p className="text-emerald-700 text-lg">
                        Streamlined boarding management for modern veterinary
                        clinics.
                    </p>
                    <p className="text-emerald-600">
                        Built specifically for Morely Vet Center, our platform
                        replaces paper-based tracking with an intuitive digital
                        system that keeps your entire team synchronized without
                        the need for pen and paper.
                    </p>
                </div>
                <div className="space-y-6">
                    <p className="text-emerald-600 font-medium">
                        Efficient. Organized. Professional.
                    </p>
                    <ul className="space-y-2 text-emerald-600 text-sm">
                        <li className="flex items-center gap-2">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            Real-time status tracking
                        </li>
                        <li className="flex items-center gap-2">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            Activity logging & schedules
                        </li>
                        <li className="flex items-center gap-2">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            Seamless coordination
                        </li>
                    </ul>
                </div>
            </div>
            <div className="center-within">
                <form
                    onSubmit={handleLogin}
                    className="flex flex-col space-y-4 w-[360px]"
                >
                    <h4>Welcome!</h4>
                    <div className="space-y-1">
                        <label className="block" htmlFor="email-input">
                            Email or Username:
                        </label>
                        <div
                            onClick={() => emailInput.current?.focus()!}
                            className="rounded-xl border border-slate-400 py-2 bg-white flex items-center justify-start px-2 gap-2 focus-within:-translate-y-1 focus-within:scale-105 focus-within:shadow-lg focus-within:border-accent transition ease-in-out"
                        >
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
                                    d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25"
                                />
                            </svg>

                            <input
                                ref={emailInput}
                                id="email-input"
                                name="email"
                                value={formInfo.email}
                                onChange={handleInputChange}
                                className="outline-none w-full"
                                placeholder="example@domain.com"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="block" htmlFor="password-input">
                            Password:
                        </label>
                        <div
                            onClick={() => passwordInput.current?.focus()!}
                            className="rounded-xl border border-slate-400 py-2 bg-white flex items-center justify-start px-2 gap-2 focus-within:-translate-y-1 focus-within:scale-105 focus-within:shadow-lg focus-within:border-accent transition ease-in-out"
                        >
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
                                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                                />
                            </svg>

                            <input
                                id="password-input"
                                ref={passwordInput}
                                name="password"
                                value={formInfo.password}
                                onChange={handleInputChange}
                                type={showPassword ? "text" : "password"}
                                className="outline-none w-full"
                                placeholder="Password123!"
                            />
                            <button onClick={toggleShowPassword}>
                                {showPassword ? (
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
                                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                        />
                                    </svg>
                                ) : (
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
                                            d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="text-white rounded-xl relative group hover:-translate-y-0.5 transition-all ease-in-out hover:cursor-pointer"
                    >
                        <div className="absolute bg-accent/60 blur-xl w-full h-full group-hover:blur-lg transition-all ease-in-out" />
                        <div className="relative z-20 font-bold bg-accent rounded-xl py-2">
                            Login
                        </div>
                    </button>
                    <p
                        className={`${errorMessage === "" ? "h-0" : "h-10"} text-center text-red-500 transition-all ease-in-out duration-500`}
                    >
                        {errorMessage}
                    </p>
                    <p className="text-center text-slate-500">
                        Need access to the system? Contact your{" "}
                        <span className="text-accent">
                            Clinic Administrator
                        </span>{" "}
                        for assistance.
                    </p>
                </form>
            </div>
        </div>
    );
};
export default LoginPage;
