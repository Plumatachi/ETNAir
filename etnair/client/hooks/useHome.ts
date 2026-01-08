"use client";

import { useState, useEffect } from 'react';
import { Home } from '@/types/home';

export function useHome(id: string) {
    const [home, setHome] = useState<Home | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHome = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/homes/${id}`);

                if (!response.ok) {
                    throw new Error('Annonce non trouvée');
                }

                const data = await response.json();
                setHome(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchHome();
        }
    }, [id]);

    return { home, loading, error };
}