"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

type PropertyType = 'HOUSE' | 'APARTMENT' | 'VILLA' | 'STUDIO' | 'COTTAGE' | 'LOFT' | 'CHALET';

interface HomeFormData {
    namehome: string;
    description: string;
    propertytype: PropertyType;
    price: number;
    address: string;
    city: string;
    postalcode: string;
    country: string;
    images: File[];
}

export default function AddHomePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const [formData, setFormData] = useState<HomeFormData>({
        namehome: '',
        description: '',
        propertytype: 'APARTMENT',
        price: 0,
        address: '',
        city: '',
        postalcode: '',
        country: 'France',
        images: []
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) || 0 : value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (files.length > 10) {
            setError('Vous ne pouvez télécharger que 10 images maximum');
            return;
        }

        setFormData(prev => ({ ...prev, images: files }));

        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Vous devez être connecté');
            }

            const formDataToSend = new FormData();
            formDataToSend.append('namehome', formData.namehome);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('propertytype', formData.propertytype);
            formDataToSend.append('price', formData.price.toString());
            formDataToSend.append('address', formData.address);
            formDataToSend.append('city', formData.city);
            formDataToSend.append('postalcode', formData.postalcode);
            formDataToSend.append('country', formData.country);

            formData.images.forEach((image) => {
                formDataToSend.append('images', image);
            });

            const response = await fetch('/api/homes', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formDataToSend,
            });

            const result = await response.json();

            console.log('Résultat de la création:', result);

            if (!response.ok) {
                throw new Error(result.error || result.message || 'Erreur lors de la création de l\'annonce');
            }

            if (!result.home || !result.home.idhome) {
                console.error('Structure de réponse inattendue:', result);
                throw new Error('La réponse du serveur est invalide');
            }

            router.push(`/homes/${result.home.idhome}`);
        } catch (err) {
            console.error('Erreur lors de la soumission:', err);
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

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
                    Retour
                </button>

                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <h1 className="text-3xl font-bold text-[#153563] mb-2">
                            Ajouter une annonce
                        </h1>
                        <p className="text-gray-600 mb-8">
                            Remplissez les informations pour créer votre annonce
                        </p>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Nom du bien */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom du bien *
                                </label>
                                <input
                                    type="text"
                                    name="namehome"
                                    required
                                    value={formData.namehome}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#153563] focus:border-transparent text-[#153563]"
                                    placeholder="Ex: Appartement moderne au centre-ville"
                                />
                            </div>

                            {/* Type de propriété */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type de propriété *
                                </label>
                                <select
                                    name="propertytype"
                                    required
                                    value={formData.propertytype}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#153563] focus:border-transparent text-[#153563]"
                                >
                                    <option value="APARTMENT">Appartement</option>
                                    <option value="HOUSE">Maison</option>
                                    <option value="VILLA">Villa</option>
                                    <option value="STUDIO">Studio</option>
                                    <option value="COTTAGE">Cottage</option>
                                    <option value="LOFT">Loft</option>
                                    <option value="CHALET">Chalet</option>
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    required
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={5}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#153563] focus:border-transparent text-[#153563]"
                                    placeholder="Décrivez votre bien en détail..."
                                />
                            </div>

                            {/* Prix */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Prix par nuit (€) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#153563] focus:border-transparent text-[#153563]"
                                    placeholder="50"
                                />
                            </div>

                            {/* Adresse */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Adresse *
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    required
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#153563] focus:border-transparent text-[#153563]"
                                    placeholder="123 rue de la République"
                                />
                            </div>

                            {/* Ville et Code postal */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ville *
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        required
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#153563] focus:border-transparent text-[#153563]"
                                        placeholder="Paris"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Code postal *
                                    </label>
                                    <input
                                        type="text"
                                        name="postalcode"
                                        required
                                        value={formData.postalcode}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#153563] focus:border-transparent text-[#153563]"
                                        placeholder="75001"
                                    />
                                </div>
                            </div>

                            {/* Pays */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Pays *
                                </label>
                                <input
                                    type="text"
                                    name="country"
                                    required
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#153563] focus:border-transparent text-[#153563]"
                                    placeholder="France"
                                />
                            </div>

                            {/* Images */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Photos (max 10)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#153563] focus:border-transparent text-[#153563]"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Formats acceptés : JPG, PNG, WebP
                                </p>

                                {/* Aperçu des images */}
                                {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={preview}
                                                    alt={`Aperçu ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Boutons */}
                            <div className="flex gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 bg-[#153563] text-white rounded-lg hover:bg-[#1a4575] transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Création...' : 'Créer l\'annonce'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}