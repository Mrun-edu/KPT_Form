import { Trophy, Award, Medal, AlertTriangle, RefreshCcw, Download } from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface ResultsDisplayProps {
  results: any;
  onReset: () => void;
}

export default function ResultsDisplay({ results, onReset }: ResultsDisplayProps) {
  // Defensive checks for results structure
  if (!results) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Sonuç Bulunamadı</h3>
        <p className="text-gray-600 mb-4">Test sonuçları yüklenirken bir hata oluştu.</p>
        <button
          onClick={onReset}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
        >
          Testi Yeniden Al
        </button>
      </div>
    );
  }

  const { top3Personas, radarChartData, qualityFlags, appliedWeights } = results;

  // Verify required data exists
  if (!top3Personas || !radarChartData) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Veri Hatası</h3>
        <p className="text-gray-600 mb-4">Test sonuçları eksik veya hatalı. Lütfen testi yeniden alın.</p>
        <button
          onClick={onReset}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
        >
          Testi Yeniden Al
        </button>
      </div>
    );
  }

  // Recalculate top 3 from radarChartData to ensure consistency with the table
  // This fixes the issue where top 3 cards don't match the sorted score table
  const sortedPersonas = [...radarChartData].sort((a: any, b: any) => b.score - a.score);

  // Helper function to calculate rank of a persona in a specific module
  const getRankInModule = (personaName: string, moduleScores: any) => {
    const sorted = Object.entries(moduleScores)
      .sort((a: any, b: any) => b[1] - a[1])
      .map((entry: any) => entry[0]);
    return sorted.indexOf(personaName) + 1;
  };

  // Helper function to calculate consistency score (how many times in top 5)
  const calculateConsistencyScore = (personaName: string, moduleScores: any) => {
    const skillsRank = getRankInModule(personaName, moduleScores.skills);
    const interestsRank = getRankInModule(personaName, moduleScores.interests);
    const valuesRank = getRankInModule(personaName, moduleScores.values);
    return [skillsRank, interestsRank, valuesRank].filter(rank => rank <= 5).length;
  };

  // Get module scores from results (if available)
  const moduleScores = (results as any).moduleScores || { skills: {}, interests: {}, values: {} };

  // Recalculated top 3 based on actual sorted scores
  const recalculatedTop3 = {
    gold: {
      persona: sortedPersonas[0].persona,
      matchPercentage: sortedPersonas[0].score,
      label: 'Gold Match',
      moduleRanks: {
        skills: getRankInModule(sortedPersonas[0].persona, moduleScores.skills),
        interests: getRankInModule(sortedPersonas[0].persona, moduleScores.interests),
        values: getRankInModule(sortedPersonas[0].persona, moduleScores.values)
      },
      consistencyScore: calculateConsistencyScore(sortedPersonas[0].persona, moduleScores)
    },
    silver: {
      persona: sortedPersonas[1].persona,
      matchPercentage: sortedPersonas[1].score,
      label: 'Silver Match',
      moduleRanks: {
        skills: getRankInModule(sortedPersonas[1].persona, moduleScores.skills),
        interests: getRankInModule(sortedPersonas[1].persona, moduleScores.interests),
        values: getRankInModule(sortedPersonas[1].persona, moduleScores.values)
      },
      consistencyScore: calculateConsistencyScore(sortedPersonas[1].persona, moduleScores)
    },
    bronze: {
      persona: sortedPersonas[2].persona,
      matchPercentage: sortedPersonas[2].score,
      label: 'Bronze Match',
      moduleRanks: {
        skills: getRankInModule(sortedPersonas[2].persona, moduleScores.skills),
        interests: getRankInModule(sortedPersonas[2].persona, moduleScores.interests),
        values: getRankInModule(sortedPersonas[2].persona, moduleScores.values)
      },
      consistencyScore: calculateConsistencyScore(sortedPersonas[2].persona, moduleScores)
    }
  };

  // Get medal color and icon
  const getMedalInfo = (position: 'gold' | 'silver' | 'bronze') => {
    const info = {
      gold: {
        icon: <Trophy className="h-12 w-12" />,
        color: 'from-yellow-400 to-yellow-600 dark:from-yellow-600 dark:to-yellow-800',
        textColor: 'text-yellow-700 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderColor: 'border-yellow-300 dark:border-yellow-700',
      },
      silver: {
        icon: <Award className="h-12 w-12" />,
        color: 'from-gray-300 to-gray-500 dark:from-gray-500 dark:to-gray-700',
        textColor: 'text-gray-700 dark:text-gray-300',
        bgColor: 'bg-gray-50 dark:bg-gray-800',
        borderColor: 'border-gray-300 dark:border-gray-600',
      },
      bronze: {
        icon: <Medal className="h-12 w-12" />,
        color: 'from-orange-400 to-orange-600 dark:from-orange-600 dark:to-orange-800',
        textColor: 'text-orange-700 dark:text-orange-400',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        borderColor: 'border-orange-300 dark:border-orange-700',
      },
    };
    return info[position];
  };

  const downloadResults = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kariyer-persona-sonuclari-${new Date().toISOString()}.json`;
    link.click();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          🎉 Sonuçlarınız Hazır!
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          İşte kariyer persona eşleşmeleriniz
        </p>
      </div>

      {/* Quality Warning */}
      {qualityFlags.values_quality_warning && (
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-yellow-800 mb-1">
              Kalite Uyarısı
            </h4>
            <p className="text-sm text-yellow-700">
              Değerler testinde tekrarlayan cevap deseni tespit edildi ({qualityFlags.values_quality_level}).
              Sonuçlar daha az güvenilir olabilir. Daha doğru sonuçlar için testi tekrar alabilirsiniz.
            </p>
            {qualityFlags.weights_adjusted && (
              <p className="text-sm text-yellow-700 mt-2">
                ⚙️ Otomatik ağırlık ayarlaması yapıldı: Değerler %{appliedWeights.values},
                İlgiler %{appliedWeights.interests}, Beceriler %{appliedWeights.skills}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Top 3 Personas */}
      <div className="grid gap-6 md:grid-cols-3">
        {(['gold', 'silver', 'bronze'] as const).map((position) => {
          const persona = recalculatedTop3[position];
          const medalInfo = getMedalInfo(position);

          // Check if persona data exists
          if (!persona || !persona.persona) {
            return (
              <div
                key={position}
                className="p-6 rounded-xl border-2 border-gray-300 bg-gray-50"
              >
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Veri yüklenemedi</p>
                </div>
              </div>
            );
          }

          return (
            <div
              key={position}
              className={`p-6 rounded-xl border-2 ${medalInfo.borderColor} ${medalInfo.bgColor} transform transition-all hover:scale-105`}
            >
              <div className="text-center mb-4">
                <div className={`inline-flex p-4 rounded-full bg-gradient-to-br ${medalInfo.color} text-white mb-3 shadow-lg`}>
                  {medalInfo.icon}
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                  {persona.label || position}
                </h3>
                <h2 className={`text-2xl font-bold ${medalInfo.textColor} mb-2`}>
                  {persona.persona}
                </h2>
                <div className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">
                  {persona.matchPercentage || 0}%
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Eşleşme Oranı</p>
              </div>

              {persona.moduleRanks && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Modül Sıralamaları:</p>
                  <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Beceriler:</span>
                      <span className="font-semibold">#{persona.moduleRanks.skills || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>İlgiler:</span>
                      <span className="font-semibold">#{persona.moduleRanks.interests || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Değerler:</span>
                      <span className="font-semibold">#{persona.moduleRanks.values || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-gray-200 dark:border-gray-700">
                      <span>Tutarlılık:</span>
                      <span className="font-semibold">{persona.consistencyScore || 0}/3</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Radar Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
          📊 Tüm Personalar İçin Detaylı Skor
        </h3>
        <div style={{ width: '100%', height: '400px', minHeight: '400px', position: 'relative' }}>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarChartData}>
              <PolarGrid />
              <PolarAngleAxis
                dataKey="persona"
                tick={{ fontSize: 12, fill: '#374151' }}
              />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Eşleşme Skoru"
                dataKey="score"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Scores Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          📋 Tüm Persona Skorları
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sıra
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Persona
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skor
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Görsel
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...radarChartData]
                .sort((a: any, b: any) => b.score - a.score)
                .map((item: any, index: number) => (
                  <tr
                    key={item.persona}
                    className={index < 3 ? 'bg-blue-50' : ''}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.persona}
                      {index < 3 && (
                        <span className="ml-2 text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          Top 3
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-900">
                      <span className="font-bold text-lg">{item.score}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={downloadResults}
          className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl"
        >
          <Download className="h-5 w-5 mr-2" />
          Sonuçları İndir
        </button>
        <button
          onClick={onReset}
          className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-all shadow-lg hover:shadow-xl"
        >
          <RefreshCcw className="h-5 w-5 mr-2" />
          Testi Yeniden Al
        </button>
      </div>
    </div>
  );
}
