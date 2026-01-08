'use client';

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import LoginModal from '../modals/LoginModal';
import RegisterModal from '../modals/RegisterModal';

export default function Header() {
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
                                <button onClick={handleLogout} className="text-white px-6 py-2 rounded hover:bg-[#bb4644] transition">
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