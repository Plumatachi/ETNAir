'use client';

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import LoginModal from '../modals/LoginModal';
import RegisterModal from '../modals/RegisterModal';

export default function Header() {
    const router = useRouter();
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            setIsAuthenticated(!!token);
        } catch (e) {
            setIsAuthenticated(false);
        }
    }, []);

    const handleLogout = () => {
        try {
            localStorage.removeItem('token');
        } catch (e) {}
        setIsAuthenticated(false);
        window.location.href = '/';
    };

    return (
        <>
            <header className="bg-[#153563] text-white">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/">
                            <img src="/assets/logo.png" alt="Logo ETNAir" className="h-15 w-auto"/>
                        </Link>
                    </div>

                    <nav className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => router.push('/my-bookings')}
                                    className="text-white hover:text-gray-200 transition flex items-center gap-2"
                                >
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
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Mes réservations
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="bg-[#bb4644] text-white px-6 py-2 rounded hover:bg-[#a33d3b] transition"
                                >
                                    Se déconnecter
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => setShowRegister(true)}
                                    className="text-white hover:text-gray-200 transition"
                                >
                                    Inscription
                                </button>
                                <button
                                    onClick={() => setShowLogin(true)}
                                    className="bg-white text-[#153563] px-6 py-2 rounded hover:bg-gray-100 transition"
                                >
                                    Connexion
                                </button>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <LoginModal
                isOpen={showLogin}
                onClose={() => setShowLogin(false)}
                onSwitchToRegister={() => {
                    setShowLogin(false);
                    setShowRegister(true);
                }}
            />

            <RegisterModal
                isOpen={showRegister}
                onClose={() => setShowRegister(false)}
                onSwitchToLogin={() => {
                    setShowRegister(false);
                    setShowLogin(true);
                }}
            />
        </>
    );
}