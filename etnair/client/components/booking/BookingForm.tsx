"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/hooks/useBooking';
import { useAvailability } from '@/hooks/useAvailability';
import { BookingFormData } from '@/types/booking';

interface BookingFormProps {
    idhome: string;
    price: number;
    homeName: string;
}

export default function BookingForm({ idhome, price, homeName }: BookingFormProps) {
    const router = useRouter();
    const { createBooking, loading: bookingLoading, error: bookingError } = useBooking();
    const { availability, loading: availabilityLoading, checkAvailability } = useAvailability();

    const [formData, setFormData] = useState<BookingFormData>({
        startDate: '',
        endDate: '',
    });

    const [totalPrice, setTotalPrice] = useState<number | null>(null);
    const [nights, setNights] = useState<number>(0);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);
            const diffTime = end.getTime() - start.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 0) {
                setNights(diffDays);
                setTotalPrice(diffDays * price);
            } else {
                setNights(0);
                setTotalPrice(null);
            }
        } else {
            setNights(0);
            setTotalPrice(null);
        }
    }, [formData.startDate, formData.endDate, price]);

    // Vérification de disponibilité automatique
    useEffect(() => {
        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);

            if (end > start) {
                checkAvailability(idhome, formData.startDate, formData.endDate);
            }
        }
    }, [formData.startDate, formData.endDate, idhome, checkAvailability]);

    const handleInputChange = (field: keyof BookingFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.startDate || !formData.endDate) {
            return;
        }

        try {
            await createBooking({
                idhome,
                startdate: formData.startDate,
                enddate: formData.endDate,
            });

            setShowSuccess(true);

            // Redirection après 2 secondes
            setTimeout(() => {
                router.push('/my-bookings');
            }, 2000);
        } catch (err) {
            // L'erreur est déjà gérée dans le hook
        }
    };

    const getTodayDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    const isFormValid = formData.startDate && formData.endDate && availability?.available && !bookingLoading;

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
            <h2 className="text-2xl font-bold text-[#153563] mb-6">
                Réservez ce bien
            </h2>

            {showSuccess && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded">
                    <p className="text-green-800 font-medium">✓ Réservation confirmée !</p>
                    <p className="text-green-600 text-sm mt-1">Redirection en cours...</p>
                </div>
            )}

            {bookingError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
                    <p className="text-red-800 text-sm">{bookingError.message}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-[#153563] mb-2">
                        Arrivée
                    </label>
                    <input
                        type="date"
                        min={getTodayDate()}
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#153563] text-[#153563]"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#153563] mb-2">
                        Départ
                    </label>
                    <input
                        type="date"
                        min={formData.startDate || getTodayDate()}
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#153563] text-[#153563]"
                        required
                    />
                </div>

                {/* Indicateur de disponibilité */}
                {availabilityLoading && formData.startDate && formData.endDate && (
                    <div className="text-sm text-gray-600">
                        Vérification de la disponibilité...
                    </div>
                )}

                {availability && formData.startDate && formData.endDate && !availabilityLoading && (
                    <div className={`p-3 rounded text-sm ${
                        availability.available
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                        {availability.available ? (
                            <p>✓ Disponible pour ces dates</p>
                        ) : (
                            <p>
                                {availability.hasBookingConflict
                                    ? '✗ Déjà réservé pour ces dates'
                                    : '✗ Dates non disponibles'}
                            </p>
                        )}
                    </div>
                )}

                {/* Résumé du prix */}
                {nights > 0 && totalPrice && (
                    <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                                {price}€ × {nights} {nights > 1 ? 'nuits' : 'nuit'}
                            </span>
                            <span className="text-gray-900">{totalPrice}€</span>
                        </div>
                        <div className="flex justify-between font-semibold text-[#153563] pt-2 border-t">
                            <span>Total</span>
                            <span>{totalPrice}€</span>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`w-full py-3 rounded font-medium transition ${
                        isFormValid
                            ? 'bg-[#DA504E] text-white hover:bg-[#c44543]'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    {bookingLoading ? 'Réservation en cours...' : 'Réserver'}
                </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4">
                Vous ne serez pas débité pour le moment
            </p>
        </div>
    );
}