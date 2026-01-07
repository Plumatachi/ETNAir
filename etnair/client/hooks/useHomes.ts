"use client";

import { useState, useEffect } from 'react';
import { Home } from '@/types/home';

export function useHomes() {
    const [homes, setHomes] = useState<Home[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHomes = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/homes');

                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des annonces');
                }

                const data = await response.json();

                setHomes(data.homes || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            } finally {
                setLoading(false);
            }
        };

        fetchHomes();
    }, []);

    return { homes, loading, error };
}