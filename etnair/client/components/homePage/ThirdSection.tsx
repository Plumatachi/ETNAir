import React from 'react';

export default function ThirdSection() {
    return (
        <div className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-[#153563] text-center mb-12">
                    Pourquoi choisir l'ETNAir ?
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    <li className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 mb-4 flex items-center justify-center">
                            <img
                                src="/assets/verified_icon.svg"
                                alt="Paiement sécurisé"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <p className="text-[#153563] font-semibold">
                            Paiement sécurisé
                        </p>
                    </li>
                    <li className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 mb-4 flex items-center justify-center">
                            <img
                                src="/assets/in_home_mode_icon.svg"
                                alt="Logements vérifiés"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <p className="text-[#153563] font-semibold">
                            Logements vérifiés
                        </p>
                    </li>
                    <li className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 mb-4 flex items-center justify-center">
                            <img
                                src="/assets/support_agent_icon.svg"
                                alt="Support 24/7"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <p className="text-[#153563] font-semibold">
                            Support 24/7
                        </p>
                    </li>
                    <li className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 mb-4 flex items-center justify-center">
                            <img
                                src="/assets/globe_icon.svg"
                                alt="Partout dans le monde"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <p className="text-[#153563] font-semibold">
                            Partout dans le monde
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    );
}