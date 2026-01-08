"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useHome } from '@/hooks/useHome';
import { getPropertyTypeLabel } from '@/types/home';
import { getProxiedImageKey } from '@/utils/imageProxy';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookingForm from "@/components/booking/BookingForm";

export default function HomeDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { home, loading, error } = useHome(params.id as string);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-600">Chargement...</div>
            </div>
        );
    }

    if (error || !home) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-600">Annonce non trouvée</div>
            </div>
        );
    }

    const mainImage = home.home_image && home.home_image.length > 0
        ? getProxiedImageKey(home.home_image.sort((a, b) => a.ordernum - b.ordernum)[0].imagekey)
        : null;

    const propertyLabel = getPropertyTypeLabel(home.propertytype);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#153563] mb-6 transition"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Retour aux annonces
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Colonne gauche - Image et détails */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                            <div className="w-full h-96 bg-gray-200">
                                {mainImage ? (
                                    <img
                                        src={mainImage}
                                        alt={home.namehome}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        Pas d'image
                                    </div>
                                )}
                            </div>

                            <div className="p-6">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                    <span>{propertyLabel}</span>
                                    <span>•</span>
                                    <span>{home.city}, {home.country}</span>
                                </div>

                                <h1 className="text-3xl font-bold text-[#153563] mb-4">
                                    {home.namehome}
                                </h1>

                                <div className="mb-6">
                                    <p className="text-2xl font-semibold text-[#153563]">
                                        À partir de {home.price}€<span className="text-base font-normal text-gray-600">/nuit</span>
                                    </p>
                                </div>

                                <div className="border-t pt-6">
                                    <h2 className="text-xl font-semibold text-[#153563] mb-3">
                                        Description
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                        {home.description}
                                    </p>
                                </div>

                                <div className="border-t pt-6 mt-6">
                                    <h2 className="text-xl font-semibold text-[#153563] mb-3">
                                        Adresse
                                    </h2>
                                    <p className="text-gray-700">
                                        {home.address}<br />
                                        {home.postalcode} {home.city}<br />
                                        {home.country}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Colonne droite - Formulaire de réservation */}
                    <div className="lg:col-span-1">
                        <BookingForm
                            idhome={home.idhome}
                            price={home.price}
                            homeName={home.namehome}
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}