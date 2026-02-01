import { useState } from 'react';
import axios from 'axios';
import SkillsModule from './SkillsModule';
import InterestsModule from './InterestsModule';
import ValuesModule from './ValuesModule';
import ResultsDisplay from './ResultsDisplay';
import testData from '../data/testData.json';
import { calculateCareerPersonaTest } from '../utils/scoring';

interface User {
    id: string;
    firstName: string;
    lastName: string;
}

interface TestContainerProps {
    user: User;
    onLogout: () => void;
}

type TestStep = 'skills' | 'interests' | 'values' | 'results';

export default function TestContainer({ user, onLogout }: TestContainerProps) {
    const [currentStep, setCurrentStep] = useState<TestStep>('skills');
    const [skillsAnswers, setSkillsAnswers] = useState<{ [key: string]: number }>({});
    const [interestsAnswers, setInterestsAnswers] = useState<any>({});
    const [valuesAnswers, setValuesAnswers] = useState<{ [key: string]: number }>({});
    const [testResults, setTestResults] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');

    const handleSkillsComplete = () => {
        setCurrentStep('interests');
    };

    const handleInterestsComplete = () => {
        setCurrentStep('values');
    };

    const handleValuesComplete = async () => {
        // Calculate results
        const userAnswers = {
            skills: skillsAnswers,
            interests: interestsAnswers,
            values: valuesAnswers
        };

        const results = calculateCareerPersonaTest(userAnswers, testData);
        setTestResults(results);
        setCurrentStep('results');

        // Save to database
        setSaving(true);
        setSaveError('');

        try {
            await axios.post('/api/results', {
                userId: user.id,
                answers: userAnswers,
                results: results
            });
        } catch (error) {
            console.error('Error saving results:', error);
            setSaveError('Sonuçlar kaydedilirken bir hata oluştu. Ancak sonuçlarınızı görebilirsiniz.');
        } finally {
            setSaving(false);
        }
    };

    const getStepNumber = (step: TestStep): number => {
        const steps: TestStep[] = ['skills', 'interests', 'values', 'results'];
        return steps.indexOf(step) + 1;
    };

    const isStepComplete = (step: TestStep): boolean => {
        switch (step) {
            case 'skills':
                return Object.keys(skillsAnswers).length === testData.modules.skills.questions.length;
            case 'interests':
                return Object.keys(interestsAnswers).length === testData.modules.interests.blocks.length;
            case 'values':
                return Object.keys(valuesAnswers).length === testData.modules.values.questions.length;
            case 'results':
                return testResults !== null;
            default:
                return false;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            {/* Header */}
            <div className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl">🎯</span>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                                    Kariyer Persona Testi
                                </h1>
                                <p className="text-sm text-gray-600">
                                    Hoş geldiniz, {user.firstName} {user.lastName}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onLogout}
                            className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 rounded hover:bg-gray-100 transition-colors"
                        >
                            Çıkış
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                                Adım {getStepNumber(currentStep)} / 4
                            </span>
                            <span className="text-sm text-gray-600">
                                {currentStep === 'skills' && 'Beceriler'}
                                {currentStep === 'interests' && 'İlgiler'}
                                {currentStep === 'values' && 'Değerler'}
                                {currentStep === 'results' && 'Sonuçlar'}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(getStepNumber(currentStep) / 4) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {currentStep === 'skills' && (
                    <div>
                        <SkillsModule
                            answers={skillsAnswers}
                            onAnswerChange={setSkillsAnswers}
                        />
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleSkillsComplete}
                                disabled={!isStepComplete('skills')}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                İleri: İlgiler Testi →
                            </button>
                        </div>
                    </div>
                )}

                {currentStep === 'interests' && (
                    <div>
                        <InterestsModule
                            answers={interestsAnswers}
                            onAnswerChange={setInterestsAnswers}
                        />
                        <div className="mt-8 flex justify-between">
                            <button
                                onClick={() => setCurrentStep('skills')}
                                className="bg-gray-200 text-gray-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 transition-all"
                            >
                                ← Geri: Beceriler
                            </button>
                            <button
                                onClick={handleInterestsComplete}
                                disabled={!isStepComplete('interests')}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                İleri: Değerler Testi →
                            </button>
                        </div>
                    </div>
                )}

                {currentStep === 'values' && (
                    <div>
                        <ValuesModule
                            answers={valuesAnswers}
                            onAnswerChange={setValuesAnswers}
                        />
                        <div className="mt-8 flex justify-between">
                            <button
                                onClick={() => setCurrentStep('interests')}
                                className="bg-gray-200 text-gray-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 transition-all"
                            >
                                ← Geri: İlgiler
                            </button>
                            <button
                                onClick={handleValuesComplete}
                                disabled={!isStepComplete('values') || saving}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 px-8 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                {saving ? 'Kaydediliyor...' : 'Sonuçları Gör 🎉'}
                            </button>
                        </div>
                    </div>
                )}

                {currentStep === 'results' && testResults && (
                    <div>
                        {saveError && (
                            <div className="mb-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                                <p className="text-yellow-800 text-sm">{saveError}</p>
                            </div>
                        )}
                        <ResultsDisplay results={testResults} />
                        <div className="mt-8 text-center">
                            <button
                                onClick={onLogout}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                            >
                                Testi Tamamla ve Çık
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
