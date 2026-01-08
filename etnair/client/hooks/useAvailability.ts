"use client";

import { useState, useCallback } from 'react';
import { BookingAvailability } from '@/types/booking';

export function useAvailability() {
    const [availability, setAvailability] = useState<BookingAvailability | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkAvailability = useCallback(async (
        idhome: string,
        startdate: string,
        enddate: string
    ) => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams({
                startdate,
                enddate,
            });

            const response = await fetch(
                `/api/bookings/check-availability/${idhome}?${params.toString()}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Erreur lors de la vérification');
            }

            setAvailability(result.data);
            return result.data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const resetAvailability = useCallback(() => {
        setAvailability(null);
        setError(null);
    }, []);

    return {
        availability,
        loading,
        error,
        checkAvailability,
        resetAvailability,
    };
}