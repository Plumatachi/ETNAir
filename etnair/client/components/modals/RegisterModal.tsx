'use client';

import { useState } from 'react';

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [usertype, setUsertype] = useState('LOCATOR');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const passwordRequirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        digit: /\d/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
    const isFormValid = username && email && isPasswordValid && usertype;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, username, usertype }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Erreur d\'inscription');
                return;
            }

            localStorage.setItem('token', data.token);
            setEmail('');
            setPassword('');
            setUsername('');
            onClose();
            window.location.href = '/';
        } catch (err) {
            setError('Erreur serveur');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                <div className="relative p-6 border-b">
                    <h2 className="text-2xl font-bold text-[#153563] text-center w-full">S'inscrire</h2>
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        aria-label="Fermer"
                    >
                        ×
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-[#153563] mb-1">
                                Nom d'utilisateur
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 text-[#153563] rounded-md bg-[#e8e7e7] focus:outline-none focus:ring-2 focus:ring-[#153563]"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#153563] mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 text-[#153563] rounded-md bg-[#e8e7e7] focus:outline-none focus:ring-2 focus:ring-[#153563]"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#153563] mb-1">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 text-[#153563] rounded-md bg-[#e8e7e7] focus:outline-none focus:ring-2 focus:ring-[#153563]"
                                required
                            />
                            <div className="mt-2 text-xs space-y-1">
                                <p className={`flex items-center gap-2 ${passwordRequirements.length ? 'text-green-600' : 'text-gray-500'}`}>
                                    <span className={`w-4 h-4 rounded-full ${passwordRequirements.length ? 'bg-green-600' : 'bg-gray-300'}`} />
                                    Au moins 8 caractères
                                </p>
                                <p className={`flex items-center gap-2 ${passwordRequirements.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                                    <span className={`w-4 h-4 rounded-full ${passwordRequirements.uppercase ? 'bg-green-600' : 'bg-gray-300'}`} />
                                    Au moins 1 majuscule (A-Z)
                                </p>
                                <p className={`flex items-center gap-2 ${passwordRequirements.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                                    <span className={`w-4 h-4 rounded-full ${passwordRequirements.lowercase ? 'bg-green-600' : 'bg-gray-300'}`} />
                                    Au moins 1 minuscule (a-z)
                                </p>
                                <p className={`flex items-center gap-2 ${passwordRequirements.digit ? 'text-green-600' : 'text-gray-500'}`}>
                                    <span className={`w-4 h-4 rounded-full ${passwordRequirements.digit ? 'bg-green-600' : 'bg-gray-300'}`} />
                                    Au moins 1 chiffre (0-9)
                                </p>
                                <p className={`flex items-center gap-2 ${passwordRequirements.special ? 'text-green-600' : 'text-gray-500'}`}>
                                    <span className={`w-4 h-4 rounded-full ${passwordRequirements.special ? 'bg-green-600' : 'bg-gray-300'}`} />
                                    Au moins 1 caractère spécial (!@#$%^&* etc)
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#153563] mb-2">
                                Type d'utilisateur
                            </label>
                            <div className="flex gap-6">
                                <div className="flex items-center">
                                    <input id="locator" type="radio" name="usertype" value="LOCATOR" checked={usertype === 'LOCATOR'} onChange={() => setUsertype('LOCATOR')}
                                    className="w-4 h-4 appearance-none rounded-full border border-gray-300 bg-white
                                    checked:bg-[#658adf] checked:border-[#658adf]
                                    focus:ring-2 focus:ring-[#658adf]/30"/>
                                    <label htmlFor="locator" className="ms-2 select-none text-sm font-medium text-[#153563] text-heading"> 
                                    Propriétaire
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input id="renter" type="radio" name="usertype" value="RENTER" checked={usertype === 'RENTER'} onChange={() => setUsertype('RENTER')}
                                    className="w-4 h-4 appearance-none rounded-full border border-gray-300 bg-white
                                    checked:bg-[#658adf] checked:border-[#658adf]
                                    focus:ring-2 focus:ring-[#658adf]/30"/>
                                    <label  htmlFor="renter" className="ms-2 select-none text-sm font-medium text-[#153563] text-heading"  >
                                    Locataire
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !isFormValid}
                            className="w-full bg-[#658adf] text-white py-2 rounded-md hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Validation...' : 'Valider'}
                        </button>
                    </form>

                    <p className="text-center text-gray-600 text-sm mt-4">
                        Vous possédez déjà un compte ?{' '}
                        <button
                            onClick={onSwitchToLogin}
                            className="text-[#153563] hover:underline font-medium cursor-pointer"
                        >
                            Connectez-vous ici !
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
