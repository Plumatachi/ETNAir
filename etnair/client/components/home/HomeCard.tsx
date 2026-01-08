import React from 'react';
import Link from 'next/link';
import { Home, getPropertyTypeLabel, getFirstImageKey, getImageUrl } from '@/types/home';

interface HomeCardProps {
    home: Home;
}

export default function HomeCard({ home }: HomeCardProps) {
    const firstImageKey = getFirstImageKey(home);
    const imageUrl = getImageUrl(firstImageKey);
    const propertyLabel = getPropertyTypeLabel(home.propertytype);

    return (
        <Link href={`/homes/${home.idhome}`} className="block">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer">
                <div className="w-full h-48 bg-gray-200">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={home.namehome}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                        />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center text-gray-400 ${imageUrl ? 'hidden' : ''}`}>
                        Pas d'image
                    </div>
                </div>
                <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">{propertyLabel}</span>
                        <span className="text-sm text-gray-500">{home.city}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#153563] mb-2">
                        {home.namehome}
                    </h3>
                    <p className="text-gray-600">
                        À partir de <span className="font-semibold">{home.price}€</span>/nuit
                    </p>
                </div>
            </div>
        </Link>
    );
}