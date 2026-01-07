import React from 'react';
import Link from "next/link";

export default function FirstSection() {
    return (
        <div className="relative w-full h-125">
            <img
                src="/assets/nice%20beach.png"
                alt="Nice Beach"
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                <div className="text-center">
                    <h1 className="text-5xl font-bold text-white px-4 mb-4">
                        Trouvez un logement unique,
                        <br />
                        où que vous soyez
                    </h1>
                    <p className="text-white text-base px-4">
                        Appartements, maisons et expériences sélectionnées avec soin
                    </p>
                </div>
                <Link href="/search">
                    <button className="bg-[#DA504E] text-white px-8 py-3 font-medium rounded hover:bg-[#c44543] transition">
                        Trouver un bien à louer
                    </button>
                </Link>

            </div>
        </div>
    );
}