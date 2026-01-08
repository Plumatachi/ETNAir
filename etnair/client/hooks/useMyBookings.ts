"use client";

import { useState, useEffect, useCallback } from 'react';
import { Booking } from '@/types/booking';

export function useMyBookings(autoFetch: boolean = true) {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBookings = useCallback(async (filters?: { upcoming?: boolean; past?: boolean }) => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Vous devez être connecté pour voir vos réservations');
            }

            const params = new URLSearchParams();
            if (filters?.upcoming) params.append('upcoming', 'true');
            if (filters?.past) params.append('past', 'true');

            const queryString = params.toString();
            const url = `/api/bookings/my-bookings${queryString ? `?${queryString}` : ''}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // ← AJOUT : Envoyer le token
                },
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des réservations');
            }

            const result = await response.json();
            setBookings(result.data || []);
            return result.data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
            setError(errorMessage);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (autoFetch) {
            fetchBookings();
        }
    }, [autoFetch, fetchBookings]);

    return {
        bookings,
        loading,
        error,
        refetch: fetchBookings,
    };
}