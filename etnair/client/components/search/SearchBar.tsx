"use client";

import React, { useState } from 'react';

interface SearchBarProps {
    onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
    location?: string;
    priceMax?: number;
    propertyType?: string;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [location, setLocation] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [propertyType, setPropertyType] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch({
            location: location || undefined,
            priceMax: priceMax ? parseInt(priceMax) : undefined,
            propertyType: propertyType || undefined,
        });
    };

    return (
        <div className="relative w-full h-64 overflow-hidden">
            <img
                src="/assets/nice%20beach.png"
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0" />
            <div className="relative text-center w-full px-4 h-full flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-white mb-6">
                    Trouvez le logement qui vous correspond
                </h1>
                <form onSubmit={handleSubmit} className="flex items-center justify-center gap-4 max-w-4xl mx-auto">
                    <input
                        type="text"
                        placeholder="Nom"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="px-4 py-3 rounded bg-white text-gray-800 w-64"
                    />
                    <input
                        type="number"
                        placeholder="Prix"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        className="px-4 py-3 rounded bg-white text-gray-800 w-32"
                    />
                    <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="px-4 py-3 rounded bg-white text-gray-800 w-48"
                    >
                        <option value="">Type de bien</option>
                        <option value="APARTMENT">Appartement</option>
                        <option value="HOUSE">Maison</option>
                        <option value="STUDIO">Studio</option>
                        <option value="VILLA">Villa</option>
                        <option value="COTTAGE">Cottage</option>
                        <option value="LOFT">Loft</option>
                        <option value="CHALET">Chalet</option>
                    </select>
                    <button
                        type="submit"
                        className="bg-[#DA504E] text-white px-8 py-3 rounded font-medium hover:bg-[#c44543] transition"
                    >
                        Filtrer
                    </button>
                </form>
            </div>
        </div>
    );
}