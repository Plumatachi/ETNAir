"use client";

import React from 'react';
import HomeCard from '@/components/home/HomeCard';
import { Home } from '@/types/home';

interface SearchResultsProps {
    homes: Home[];
    loading: boolean;
    error: string | null;
}

export default function SearchResults({ homes, loading, error }: SearchResultsProps) {
    if (loading) {
        return (
            <div className="py-12 min-h-[calc(100vh-400px)] flex items-center justify-center">
                <div className="text-center text-gray-600">Chargement...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-12 min-h-[calc(100vh-400px)] flex items-center justify-center">
                <div className="text-center text-red-600">{error}</div>
            </div>
        );
    }

    if (homes.length === 0) {
        return (
            <div className="min-h-[calc(100vh-400px)] bg-gray-50 flex items-center justify-center">
                <div className="text-center text-gray-600">Aucune annonce trouvée</div>
            </div>
        );
    }

    return (
        <div className="py-8 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4">
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {homes.map((home) => (
                        <li key={home.idhome}>
                            <HomeCard home={home} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}