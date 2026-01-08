"use client";

import { useState, useCallback } from 'react';
import { Booking, CreateBookingData, BookingError } from '@/types/booking';

export function useBooking() {
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<BookingError | null>(null);

    const createBooking = useCallback(async (data: CreateBookingData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Erreur lors de la réservation');
            }

            setBooking(result.data);
            return result.data;
        } catch (err) {
            const error = {
                message: err instanceof Error ? err.message : 'Une erreur est survenue',
            };
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const resetBooking = useCallback(() => {
        setBooking(null);
        setError(null);
    }, []);

    return {
        booking,
        loading,
        error,
        createBooking,
        resetBooking,
    };
}