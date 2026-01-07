"use client";

import React from 'react';
import HomeCard from '@/components/home/HomeCard';
import { useHomes } from '@/hooks/useHomes';

export default function HomesList() {
    const { homes, loading, error } = useHomes();

    if (loading) {
        return (
            <div className="py-12">
                <h2 className="text-3xl font-bold text-[#153563] text-center mb-8">
                    Nouvelles annonces
                </h2>
                <div className="text-center text-gray-600">Chargement...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-12">
                <h2 className="text-3xl font-bold text-[#153563] text-center mb-8">
                    Nouvelles annonces
                </h2>
                <div className="text-center text-red-600">{error}</div>
            </div>
        );
    }

    if (!Array.isArray(homes)) {
        console.error('homes n\'est pas un tableau:', homes);
        return (
            <div className="py-12">
                <h2 className="text-3xl font-bold text-[#153563] text-center mb-8">
                    Nouvelles annonces
                </h2>
                <div className="text-center text-red-600">Format de données invalide</div>
            </div>
        );
    }

    // Prendre les 4 dernières annonces
    const latestHomes = homes.slice(-4).reverse();

    if (latestHomes.length === 0) {
        return (
            <div className="py-12">
                <h2 className="text-3xl font-bold text-[#153563] text-center mb-8">
                    Nouvelles annonces
                </h2>
                <div className="text-center text-gray-600">Aucune annonce disponible</div>
            </div>
        );
    }

    return (
        <div className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-[#153563] text-center mb-8">
                    Nouvelles annonces
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {latestHomes.map((home) => (
                        <li key={home.idhome}>
                            <HomeCard home={home} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}