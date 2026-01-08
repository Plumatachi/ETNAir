"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMyBookings } from '@/hooks/useMyBookings';
import { getProxiedImageKey } from '@/utils/imageProxy';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function MyBookingsPage() {
    const router = useRouter();
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
    const { bookings, loading, error, refetch } = useMyBookings(true);

    const handleFilterChange = async (newFilter: 'all' | 'upcoming' | 'past') => {
        setFilter(newFilter);
        if (newFilter === 'upcoming') {
            await refetch({ upcoming: true });
        } else if (newFilter === 'past') {
            await refetch({ past: true });
        } else {
            await refetch();
        }
    };

    const formatDate = (date: string | Date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const calculateNights = (startDate: string | Date, endDate: string | Date) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return nights;
    };

    const isUpcoming = (startDate: string | Date) => {
        return new Date(startDate) >= new Date();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center min-h-100">
                        <div className="text-gray-600">Chargement de vos réservations...</div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center min-h-100">
                        <div className="text-red-600">{error}</div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#153563] mb-2">
                        Mes réservations
                    </h1>
                    <p className="text-gray-600">
                        Gérez et consultez toutes vos réservations
                    </p>
                </div>

                {/* Filtres */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => handleFilterChange('all')}
                        className={`px-4 py-2 rounded-lg transition ${
                            filter === 'all'
                                ? 'bg-[#153563] text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        Toutes
                    </button>
                    <button
                        onClick={() => handleFilterChange('upcoming')}
                        className={`px-4 py-2 rounded-lg transition ${
                            filter === 'upcoming'
                                ? 'bg-[#153563] text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        À venir
                    </button>
                    <button
                        onClick={() => handleFilterChange('past')}
                        className={`px-4 py-2 rounded-lg transition ${
                            filter === 'past'
                                ? 'bg-[#153563] text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        Passées
                    </button>
                </div>

                {/* Liste des réservations */}
                {bookings.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <svg
                            className="w-16 h-16 text-gray-300 mx-auto mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            Aucune réservation
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Vous n'avez pas encore de réservation.
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="px-6 py-2 bg-[#153563] text-white rounded-lg hover:bg-[#1a4575] transition"
                        >
                            Découvrir les annonces
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bookings.map((booking) => {
                            const mainImage = booking.home.home_image?.[0]?.imageurl
                                ? getProxiedImageKey(booking.home.home_image[0].imageurl)
                                : null;
                            const nights = calculateNights(booking.startdate, booking.enddate);
                            const totalPrice = booking.home.price * nights;
                            const upcoming = isUpcoming(booking.startdate);

                            return (
                                <div
                                    key={booking.idbooking}
                                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                                >
                                    <div className="relative">
                                        <div className="w-full h-48 bg-gray-200">
                                            {mainImage ? (
                                                <img
                                                    src={mainImage}
                                                    alt={booking.home.namehome}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    Pas d'image
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute top-3 right-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    upcoming
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}
                                            >
                                                {upcoming ? 'À venir' : 'Passée'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-[#153563] mb-2">
                                            {booking.home.namehome}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            {booking.home.address}, {booking.home.city}
                                        </p>

                                        <div className="border-t pt-4 space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                <svg
                                                    className="w-4 h-4 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                <span>
                                                    {formatDate(booking.startdate)} - {formatDate(booking.enddate)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                <svg
                                                    className="w-4 h-4 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                                    />
                                                </svg>
                                                <span>{nights} {nights > 1 ? 'nuits' : 'nuit'}</span>
                                            </div>
                                        </div>

                                        <div className="border-t mt-4 pt-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-gray-600">Total</span>
                                                <span className="text-xl font-bold text-[#153563]">
                                                    {totalPrice}€
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => router.push(`/homes/${booking.idhome}`)}
                                                className="w-full px-4 py-2 bg-[#153563] text-white rounded-lg hover:bg-[#1a4575] transition"
                                            >
                                                Voir le bien
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}