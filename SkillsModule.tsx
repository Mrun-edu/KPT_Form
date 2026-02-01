import testData from '../../../careerPersonaTestData.json';

interface SkillsModuleProps {
  answers: { [key: string]: number };
  onAnswerChange: (answers: { [key: string]: number }) => void;
}

export default function SkillsModule({ answers, onAnswerChange }: SkillsModuleProps) {
  const { title, description, instruction, questions } = testData.modules.skills;

  const handleAnswer = (questionId: string, value: number) => {
    onAnswerChange({
      ...answers,
      [questionId]: value,
    });
  };

  const getLikertLabel = (value: number) => {
    const labels = {
      1: 'Hiç Beceremem',
      2: 'Az Becerebilirim',
      3: 'Orta Düzeyde',
      4: 'İyi Yapabilirim',
      5: 'Çok Başarılıyım',
    };
    return labels[value as keyof typeof labels];
  };

  // Short labels for mobile
  const getShortLabel = (value: number) => {
    const labels = {
      1: 'Hiç',
      2: 'Az',
      3: 'Orta',
      4: 'İyi',
      5: 'Çok',
    };
    return labels[value as keyof typeof labels];
  };

  return (
    <div>
      {/* Module Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-sm sm:text-base text-gray-700 mb-2">{description}</p>
        <p className="text-xs sm:text-sm font-medium text-blue-600">{instruction}</p>
      </div>

      {/* Questions */}
      <div className="space-y-4 sm:space-y-6">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className={`p-4 sm:p-6 rounded-xl border-2 transition-all duration-75 ${answers[question.id]
                ? 'border-blue-300 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
          >
            {/* Question Number and Text */}
            <div className="mb-4">
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-2">
                Soru {index + 1} / {questions.length}
              </span>
              <p className="text-sm sm:text-lg text-gray-800 font-medium leading-relaxed">
                {question.text}
              </p>
            </div>

            {/* Likert Scale */}
            <div className="space-y-3">
              {/* Scale Labels - Hidden on mobile, shown on sm+ */}
              <div className="hidden sm:flex justify-between text-xs text-gray-500 px-1">
                <span>Hiç Beceremem</span>
                <span>Çok Başarılıyım</span>
              </div>

              {/* Radio Buttons - Grid on mobile for better fit */}
              <div className="grid grid-cols-5 gap-1 sm:gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label
                    key={value}
                    className={`cursor-pointer ${answers[question.id] === value ? 'scale-105 z-10' : ''
                      }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={value}
                      checked={answers[question.id] === value}
                      onChange={() => handleAnswer(question.id, value)}
                      className="sr-only"
                    />
                    <div
                      className={`p-2 sm:p-3 text-center rounded-lg border-2 transition-all duration-75 ${answers[question.id] === value
                          ? 'border-blue-500 bg-blue-500 text-white shadow-lg'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                    >
                      <div className="text-lg sm:text-2xl font-bold mb-0.5 sm:mb-1">{value}</div>
                      {/* Short label on mobile, full label on desktop */}
                      <div className="text-[10px] sm:text-xs leading-tight sm:hidden">
                        {getShortLabel(value)}
                      </div>
                      <div className="hidden sm:block text-xs leading-tight">
                        {getLikertLabel(value)}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Selected Answer Display */}
              {answers[question.id] && (
                <div className="text-center pt-2">
                  <span className="text-xs sm:text-sm font-medium text-blue-600">
                    Seçiminiz: {answers[question.id]} - {getLikertLabel(answers[question.id])}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Info */}
      <div className="mt-6 sm:mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="w-full sm:w-auto">
            <p className="text-sm font-medium text-gray-700">
              Tamamlanan: {Object.keys(answers).length} / {questions.length}
            </p>
            <div className="w-full sm:w-64 bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{
                  width: `${(Object.keys(answers).length / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>
          {Object.keys(answers).length === questions.length && (
            <div className="flex items-center text-green-600 font-medium">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Modül Tamamlandı!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
