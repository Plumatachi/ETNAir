'use client';

import { useState } from 'react';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToRegister: () => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Erreur de connexion');
                return;
            }

            localStorage.setItem('token', data.token);
            setEmail('');
            setPassword('');
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
                    <h2 className="text-2xl font-bold text-[#153563] text-center w-full">Se connecter</h2>
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
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#658adf] text-white py-2 rounded-md hover:bg-opacity-90 transition disabled:opacity-50"
                        >
                            {loading ? 'Validation...' : 'Valider'}
                        </button>
                    </form>

                    <p className="text-center text-gray-600 text-sm mt-4">
                        Pas encore de compte ?{' '}
                        <button
                            onClick={onSwitchToRegister}
                            className="text-[#153563] hover:underline font-medium cursor-pointer"
                        >
                            Inscrivez-vous ici !
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
