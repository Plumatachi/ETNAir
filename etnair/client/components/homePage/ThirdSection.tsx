import React from 'react';

export default function ThirdSection() {
    return (
        <div className="py-12">
            <h2 className="text-3xl font-bold text-[#153563] text-center mb-8">Pourquoi choisir l'EtnAir ?</h2>
            <ul className="flex justify-center gap-8">
                <li>
                    <img src="/assets/verified_icon.svg" alt="Verified icon" className="self-center" />
                    <p>Une plateforme de réservation de maisons et d'appartements</p>
                </li>
                <li>
                    <img src="/assets/in_home_mode_icon.svg" alt="In home mode icon" />
                    <p>Une plateforme de réservation de maisons et d'appartements</p>
                </li>
                <li>
                    <img src="/assets/support_agent_icon.svg" alt="Support agent icon" />
                    <p>Une plateforme de réservation de maisons et d'appartements</p>
                </li>
                <li>
                    <img src="/assets/globe_icon.svg" alt="Globe icon" />
                    <p>Une plateforme de réservation de maisons et d'appartements</p>
                </li>
            </ul>
        </div>
    );
}