"use client";

import React, {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {HomeFormData, PropertyType} from '@/types/home';

export default function EditHomePage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [existingImages, setExistingImages] = useState<any[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

    const [formData, setFormData] = useState<HomeFormData>({
        namehome: '',
        description: '',
        propertytype: PropertyType.APARTMENT,
        price: 0,
        address: '',
        city: '',
        postalcode: '',
        country: 'France',
    });

    useEffect(() => {
        const fetchHome = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/homes/${id}`);

                if (!response.ok) {
                    throw new Error('Bien non trouvé');
                }

                const data = await response.json();

                setFormData({
                    namehome: data.namehome,
                    description: data.description,
                    propertytype: data.propertytype,
                    price: data.price,
                    address: data.address,
                    city: data.city,
                    postalcode: data.postalcode,
                    country: data.country,
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchHome();
        }
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) || 0 : value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (files.length + existingImages.length + newImages.length > 10) {
            setError('Vous ne pouvez avoir que 10 images maximum au total');
            return;
        }

        setNewImages(prev => [...prev, ...files]);
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...previews]);
        setError(null);
    };

    const removeNewImage = (index: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddImages = async () => {
        if (newImages.length === 0) return;

        try {
            setUploadingImages(true);
            const token = localStorage.getItem('token');

            const formData = new FormData();
            newImages.forEach(image => {
                formData.append('images', image);
            });

            const response = await fetch(`/api/homes/${id}/images`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout des images');
            }

            const result = await response.json();

            if (result.home?.home_image) {
                setExistingImages(result.home.home_image.sort((a: any, b: any) => a.ordernum - b.ordernum));
            }

            setNewImages([]);
            setImagePreviews([]);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout des images');
        } finally {
            setUploadingImages(false);
        }
    };

    const handleDeleteImage = async (imageId: string) => {
        try {
            setDeletingImageId(imageId);
            const token = localStorage.getItem('token');

            const response = await fetch(`/api/homes/${id}/images/${imageId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression de l\'image');
            }

            setExistingImages(prev => prev.filter(img => img.idimage !== imageId));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
        } finally {
            setDeletingImageId(null);
        }
    };

    const getImageUrl = (imageKey: string) => {
        return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${imageKey}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Vous devez être connecté');
            }

            // Préparer les données avec le bon format pour le backend
            const dataToSend = {
                namehome: formData.namehome,
                description: formData.description,
                propertyType: formData.propertytype, // Renommer propertytype en propertyType
                price: formData.price,
                address: formData.address,
                city: formData.city,
                postalcode: formData.postalcode,
                country: formData.country,
            };

            console.log('Données envoyées:', dataToSend);

            const response = await fetch(`/api/homes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(dataToSend),
            });

            console.log('Statut réponse:', response.status);

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Erreur lors de la modification');
            }

            const result = await response.json();
            console.log('Résultat:', result);

            router.push(`/homes/${id}`);
        } catch (err) {
            console.error('Erreur complète:', err);
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-gray-600">Chargement...</div>
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
                            Modifier l'annonce
                        </h1>
                        <p className="text-gray-600 mb-8">
                            Modifiez les informations de votre annonce
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
                                />
                            </div>

                            {/* Gestion des images */}
                            <div className="border-t pt-6 mt-6">
                                <h2 className="text-xl font-semibold text-[#153563] mb-4">
                                    Gestion des images
                                </h2>

                                {/* Images existantes */}
                                {existingImages.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                                            Images actuelles ({existingImages.length}/10)
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {existingImages.map((image, index) => (
                                                <div key={image.idimage} className="relative group">
                                                    <img
                                                        src={getImageUrl(image.imagekey)}
                                                        alt={`Image ${index + 1}`}
                                                        className="w-full h-32 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteImage(image.idimage)}
                                                        disabled={deletingImageId === image.idimage}
                                                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition disabled:opacity-50"
                                                    >
                                                        {deletingImageId === image.idimage ? (
                                                            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                    {index === 0 && (
                                                        <div className="absolute bottom-2 left-2 bg-[#153563] text-white text-xs px-2 py-1 rounded">
                                                            Image principale
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Ajouter de nouvelles images */}
                                {existingImages.length < 10 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                                            Ajouter des images
                                        </h3>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#153563] focus:border-transparent text-[#153563] mb-2"
                                        />
                                        <p className="text-sm text-gray-500 mb-3">
                                            Formats acceptés : JPG, PNG, WebP (max 10 images au total)
                                        </p>

                                        {/* Aperçu des nouvelles images */}
                                        {newImages.length > 0 && (
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-sm font-medium text-gray-700">
                                                        Nouvelles images ({newImages.length})
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={handleAddImages}
                                                        disabled={uploadingImages}
                                                        className="px-4 py-2 bg-[#153563] text-white text-sm rounded-lg hover:bg-[#1a4575] transition disabled:opacity-50"
                                                    >
                                                        {uploadingImages ? 'Ajout en cours...' : 'Ajouter ces images'}
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {imagePreviews.map((preview, index) => (
                                                        <div key={index} className="relative group">
                                                            <img
                                                                src={preview}
                                                                alt={`Nouvelle image ${index + 1}`}
                                                                className="w-full h-32 object-cover rounded-lg"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeNewImage(index)}
                                                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {existingImages.length >= 10 && (
                                    <p className="text-sm text-gray-500 italic">
                                        Vous avez atteint la limite de 10 images. Supprimez des images existantes pour en ajouter de nouvelles.
                                    </p>
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
                                    disabled={saving}
                                    className="flex-1 px-6 py-3 bg-[#153563] text-white rounded-lg hover:bg-[#1a4575] transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
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