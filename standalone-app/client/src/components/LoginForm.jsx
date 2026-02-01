import { useState } from 'react';
import axios from 'axios';

export default function LoginForm({ onLoginSuccess }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!firstName.trim() || !lastName.trim()) {
            setError('Lütfen isim ve soyisminizi giriniz');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('/api/users', {
                firstName: firstName.trim(),
                lastName: lastName.trim()
            });

            if (response.data.success) {
                onLoginSuccess(response.data.user);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.error || 'Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-4">
                        <span className="text-5xl">🎯</span>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Kariyer Persona Testi
                    </h1>
                    <p className="text-gray-600">
                        Kendinizi keşfedin, kariyerinizi şekillendirin
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Teste Başla
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* First Name */}
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                İsim <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                                placeholder="İsminizi giriniz"
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* Last Name */}
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                Soyisim <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                                placeholder="Soyisminizi giriniz"
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3">
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Yükleniyor...
                                </span>
                            ) : (
                                '🚀 Teste Başla'
                            )}
                        </button>
                    </form>

                    {/* Info */}
                    <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                        <p className="text-sm text-blue-800">
                            <span className="font-bold">ℹ️ Bilgi:</span> Bu test yaklaşık 15-20 dakika sürmektedir.
                            Sonuçlarınız güvenli bir şekilde kaydedilecektir.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6 text-gray-600 text-sm">
                    <p>© 2026 Kariyer Persona Testi</p>
                </div>
            </div>
        </div>
    );
}
