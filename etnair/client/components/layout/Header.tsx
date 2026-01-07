import React from 'react';
import Link from "next/link";

export default function Header() {
    return (
        <header className="bg-[#153563] text-white">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/">
                        <img src="/assets/logo.png" alt="Logo ETNAir" className="h-15 w-auto"/>
                    </Link>
                </div>

                <nav className="flex items-center gap-4">
                    <button className="text-white hover:text-gray-200 transition">
                        Inscription
                    </button>
                    <button className="bg-white text-[#153563] px-6 py-2 rounded hover:bg-gray-100 transition">
                        Connexion
                    </button>
                </nav>
            </div>
        </header>
    );
}