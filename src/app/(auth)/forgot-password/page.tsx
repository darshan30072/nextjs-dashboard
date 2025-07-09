"use client";

import Image from "next/image";
import { useForgotPasswordVM } from "@/viewmodels/MainScreenViewModel/auth/ForgotPasswordViewModal";

export default function ForgotPasswordPage() {
    const {
        email,
        setEmail,
        emailError,
        loading,
        handleSendOtp
    } = useForgotPasswordVM();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendOtp();
    };

    return (
        <div className="flex flex-col lg:flex-row items-center justify-center w-screen h-screen bg-white">
            <div className="hidden lg:flex w-full lg:w-1/2 justify-center items-center p-4">
                <Image
                    src="/images/Splash-screen.jpg"
                    alt="Splash Screen"
                    width={500}
                    height={500}
                    className="shadow-2xl shadow-cyan-300 rounded-3xl max-w-full h-auto"
                    priority
                />
            </div>

            <div className="w-full lg:w-1/2 flex justify-center items-center bg-gradient-to-tr from-blue-900 to-blue-950 p-6 h-screen">
                <div className="w-full max-w-md bg-white p-6 lg:p-8 rounded-2xl shadow-lg">
                    <div className="text-center text-blue-900 mb-6">
                        <h1 className="text-xl lg:text-3xl font-bold">Forgot Password</h1>
                        <p className="text-xs lg:text-sm text-gray-600 font-medium">Please enter your email to receive a code</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="mb-10">
                            <label className="text-xs lg:text-sm text-gray-700 font-medium">EMAIL</label>
                            <input
                                type="email"
                                placeholder="example@gmail.com"
                                className="w-full px-4 py-3 mt-1 rounded-xl bg-gray-100 text-gray-700 focus:outline-none text-sm lg:text-base"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {emailError && <span className="text-red-500 text-xs font-semibold mt-1">{emailError}</span>}
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-500 text-white font-semibold py-3 rounded-xl hover:bg-orange-400 transition text-sm lg:text-base disabled:opacity-50"
                        >
                            {loading ? "Sending..." : "SEND CODE"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
