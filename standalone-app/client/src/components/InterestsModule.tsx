import { useState, useEffect, useMemo } from 'react';
import testData from '../data/testData.json';

interface InterestsModuleProps {
  answers: {
    [blockId: string]: {
      [persona: string]: number;
    };
  };
  onAnswerChange: (answers: any) => void;
}

interface CardItem {
  cardId: string;
  persona: string;
  text: string;
  blockId: string;
}

interface BlockState {
  poolItems: CardItem[];
  slotItems: (CardItem | null)[];
}

interface ClickableCardProps {
  item: CardItem;
  isInSlot?: boolean;
  slotRank?: number;
  onRemove?: () => void;
  onClick?: () => void;
}

function ClickableCard({ item, isInSlot, slotRank, onRemove, onClick }: ClickableCardProps) {
  const slotConfig = slotRank ? {
    1: { color: 'from-yellow-400 to-amber-500', border: 'border-yellow-500', emoji: '🏆' },
    2: { color: 'from-blue-400 to-blue-500', border: 'border-blue-500', emoji: '👌' },
    3: { color: 'from-gray-400 to-gray-500', border: 'border-gray-500', emoji: '👍' },
    4: { color: 'from-slate-400 to-slate-600', border: 'border-slate-500', emoji: '👎' },
  }[slotRank] : null;

  return (
    <div
      onClick={onClick}
      className={`p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] ${isInSlot && slotConfig
        ? `bg-gradient-to-br ${slotConfig.color} bg-opacity-10 ${slotConfig.border}`
        : 'border-purple-200 dark:border-purple-600 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-700 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-lg'
        }`}
    >
      <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed mb-2">{item.text}</p>
      <div className="flex items-center justify-end flex-wrap gap-2">
        {isInSlot && onRemove ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="text-xs text-gray-600 hover:text-red-600 transition-colors px-2 py-1 bg-red-50 rounded-full hover:bg-red-100"
          >
            🗑️ Çıkar
          </button>
        ) : (
          <span className="text-xs text-purple-500">
            🖱️ Tıkla
          </span>
        )}
      </div>
    </div>
  );
}

interface SlotProps {
  rank: number;
  item: CardItem | null;
  onRemove: () => void;
}

function Slot({ rank, item, onRemove }: SlotProps) {
  const SLOT_STYLES = {
    1: { text: 'En çok istediğim', color: 'from-yellow-400 to-amber-500', border: 'border-yellow-500', emoji: '🏆' },
    2: { text: 'İsterim', color: 'from-blue-400 to-blue-500', border: 'border-blue-500', emoji: '👍' },
    3: { text: 'Az İsterim', color: 'from-gray-400 to-gray-500', border: 'border-gray-500', emoji: '👌' },
    4: { text: 'En az istediğim', color: 'from-slate-400 to-slate-600', border: 'border-slate-500', emoji: '👎' },
  };

  const slotConfig = SLOT_STYLES[rank as keyof typeof SLOT_STYLES] || SLOT_STYLES[1];

  return (
    <div className="relative">
      {/* Slot Label */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl sm:text-2xl">{slotConfig.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-gray-600 uppercase">
            Sıra {rank}
          </div>
          <div className={`text-xs sm:text-sm font-bold bg-gradient-to-r ${slotConfig.color} bg-clip-text text-transparent truncate`}>
            {slotConfig.text}
          </div>
        </div>
      </div>

      {/* Slot Content */}
      <div className={`min-h-[100px] sm:min-h-[120px] rounded-xl border-2 ${slotConfig.border} bg-white dark:bg-gray-800 transition-all relative overflow-hidden`}>
        {item ? (
          <ClickableCard
            item={item}
            isInSlot={true}
            slotRank={rank}
            onRemove={onRemove}
          />
        ) : (
          <div className="h-[100px] sm:h-[120px] flex flex-col items-center justify-center p-3 sm:p-4">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${slotConfig.color} opacity-20 mb-2 flex items-center justify-center`}>
              <span className="text-2xl sm:text-3xl opacity-60">{slotConfig.emoji}</span>
            </div>
            <p className="text-gray-400 dark:text-gray-500 text-xs font-medium text-center">
              Havuzdan bir kart seçin
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InterestsModule({ answers, onAnswerChange }: InterestsModuleProps) {
  const { title, description, blocks } = testData.modules.interests;

  // Generate unique IDs and randomize options on mount
  const initializedBlocks = useMemo(() => {
    return blocks.map(block => ({
      ...block,
      options: block.options.map((opt, idx) => ({
        cardId: `${block.id}_option_${idx}`,
        persona: opt.persona,
        text: opt.text,
        blockId: block.id,
      })).sort(() => Math.random() - 0.5)
    }));
  }, []);

  // State for each block: poolItems and slotItems
  const [blockStates, setBlockStates] = useState < { [blockId: string]: BlockState } > (() => {
    const states: { [blockId: string]: BlockState } = {};

    initializedBlocks.forEach(block => {
      const blockAnswers = answers[block.id] || {};

      const slotItems: (CardItem | null)[] = [null, null, null, null];
      const poolItems: CardItem[] = [];

      block.options.forEach(option => {
        const rank = blockAnswers[option.persona];
        if (rank && rank >= 1 && rank <= 4) {
          slotItems[rank - 1] = option;
        } else {
          poolItems.push(option);
        }
      });

      states[block.id] = { poolItems, slotItems };
    });

    return states;
  });

  // Sync blockStates with answers prop changes
  useEffect(() => {
    setBlockStates(prevStates => {
      const newStates = { ...prevStates };
      let hasChanges = false;

      initializedBlocks.forEach(block => {
        const blockAnswers = answers[block.id] || {};
        const currentState = prevStates[block.id];

        const currentRankings = new Map < string, number> ();
        currentState.slotItems.forEach((item, idx) => {
          if (item) currentRankings.set(item.persona, idx + 1);
        });

        const answerRankings = new Map < string, number> (
          Object.entries(blockAnswers).map(([persona, rank]) => [persona, rank as number])
        );

        let needsUpdate = currentRankings.size !== answerRankings.size;
        if (!needsUpdate) {
          for (const [persona, rank] of currentRankings) {
            if (answerRankings.get(persona) !== rank) {
              needsUpdate = true;
              break;
            }
          }
        }

        if (needsUpdate) {
          hasChanges = true;
          const slotItems: (CardItem | null)[] = [null, null, null, null];
          const poolItems: CardItem[] = [];

          block.options.forEach(option => {
            const rank = blockAnswers[option.persona];
            if (rank && rank >= 1 && rank <= 4) {
              slotItems[rank - 1] = option;
            } else {
              poolItems.push(option);
            }
          });

          newStates[block.id] = { poolItems, slotItems };
        }
      });

      return hasChanges ? newStates : prevStates;
    });
  }, [answers, initializedBlocks]);

  // Convert blockStates to answers format
  const convertToAnswers = (state: BlockState) => {
    const blockAnswers: { [persona: string]: number } = {};

    state.slotItems.forEach((item, idx) => {
      if (item) {
        blockAnswers[item.persona] = idx + 1;
      }
    });

    return blockAnswers;
  };

  // Handle click to add to first available slot
  const handlePoolItemClick = (blockId: string, item: CardItem) => {
    const currentState = blockStates[blockId];
    if (!currentState) return;

    const newPoolItems = currentState.poolItems.filter(i => i.cardId !== item.cardId);
    const newSlotItems = [...currentState.slotItems];

    const emptySlotIndex = newSlotItems.findIndex(slot => slot === null);
    if (emptySlotIndex === -1) return;

    newSlotItems[emptySlotIndex] = item;

    const newState = { poolItems: newPoolItems, slotItems: newSlotItems };

    setBlockStates(prev => ({
      ...prev,
      [blockId]: newState,
    }));

    const newBlockAnswers = convertToAnswers(newState);
    onAnswerChange({
      ...answers,
      [blockId]: newBlockAnswers,
    });
  };

  // Handle remove from slot back to pool
  const handleRemoveFromSlot = (blockId: string, slotIndex: number) => {
    const currentState = blockStates[blockId];
    if (!currentState) return;

    const item = currentState.slotItems[slotIndex];
    if (!item) return;

    const newPoolItems = [...currentState.poolItems, item];
    const newSlotItems = [...currentState.slotItems];
    newSlotItems[slotIndex] = null;

    const newState = { poolItems: newPoolItems, slotItems: newSlotItems };

    setBlockStates(prev => ({
      ...prev,
      [blockId]: newState,
    }));

    const newBlockAnswers = convertToAnswers(newState);
    onAnswerChange({
      ...answers,
      [blockId]: newBlockAnswers,
    });
  };

  const isBlockComplete = (blockId: string) => {
    const state = blockStates[blockId];
    if (!state) return false;
    return state.slotItems.every(item => item !== null);
  };

  const completedBlocks = Object.keys(blockStates).filter(blockId => isBlockComplete(blockId)).length;
  const progressPercentage = (completedBlocks / blocks.length) * 100;

  return (
    <div>
      {/* Module Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-sm sm:text-base text-gray-700 mb-4">{description}</p>
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-400 p-3 sm:p-4 rounded-lg">
          <p className="text-xs sm:text-sm font-medium text-purple-900">
            🎮 <span className="font-bold">Nasıl Yapılır:</span> Her blokta 4 aktivite kartı göreceksiniz.
            <br />
            <span className="font-bold">Havuzdan bir kartı tıklayın</span> → İlk boş slota yerleşir
            <br />
            <span className="font-bold">Slottaki kartın "Çıkar" butonuna tıklayın</span> → Kart havuza geri döner
            <br />
            🏆 Üstteki slot = En çok istediğiniz | 👎 Alttaki slot = En az istediğiniz
          </p>
        </div>
      </div>

      {/* Blocks */}
      <div className="space-y-8 sm:space-y-12">
        {initializedBlocks.map((block, blockIndex) => {
          const state = blockStates[block.id];
          if (!state) return null;

          const isComplete = isBlockComplete(block.id);

          return (
            <div
              key={block.id}
              className={`p-4 sm:p-6 rounded-2xl border-2 transition-all ${isComplete
                ? 'border-green-400 dark:border-green-600 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 shadow-lg'
                : 'border-purple-200 dark:border-purple-600 bg-white dark:bg-gray-800 shadow-md'
                }`}
            >
              {/* Block Header */}
              <div className="mb-4 sm:mb-6">
                <span className="inline-block bg-purple-600 text-white text-xs font-bold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full mb-2 sm:mb-3">
                  Blok {blockIndex + 1} / {blocks.length}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">{block.title}</h3>
              </div>

              {/* Responsive Layout: Stack on mobile, Side by side on tablets+ */}
              <div className="flex flex-col md:grid md:grid-cols-2 gap-4 sm:gap-6">
                {/* Pool - Show first on mobile for better UX */}
                <div className="order-1 md:order-1">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-1 flex-1 bg-gradient-to-r from-purple-300 to-pink-300 rounded"></div>
                    <h4 className="text-xs sm:text-sm font-bold text-purple-700 uppercase tracking-wide whitespace-nowrap">
                      Aktivite Havuzu ({state.poolItems.length})
                    </h4>
                    <div className="h-1 flex-1 bg-gradient-to-r from-pink-300 to-purple-300 rounded"></div>
                  </div>

                  <div className="space-y-2 sm:space-y-3 min-h-[200px] sm:min-h-[400px]">
                    {state.poolItems.map((item) => (
                      <ClickableCard
                        key={item.cardId}
                        item={item}
                        onClick={() => handlePoolItemClick(block.id, item)}
                      />
                    ))}

                    {state.poolItems.length === 0 && (
                      <div className="h-[200px] sm:h-[400px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl">
                        <p className="text-gray-400 text-sm font-medium">
                          ✅ Tüm aktiviteler sıralandı!
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Slots - Show second on mobile and desktop */}
                <div className="order-2 md:order-2">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-1 flex-1 bg-gradient-to-r from-yellow-300 to-amber-400 rounded"></div>
                    <h4 className="text-xs sm:text-sm font-bold text-amber-700 uppercase tracking-wide whitespace-nowrap">
                      Sıralama Slotları
                    </h4>
                    <div className="h-1 flex-1 bg-gradient-to-r from-amber-400 to-yellow-300 rounded"></div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    {state.slotItems.map((item, idx) => (
                      <Slot
                        key={`slot-${block.id}-${idx + 1}`}
                        rank={idx + 1}
                        item={item}
                        onRemove={() => handleRemoveFromSlot(block.id, idx)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Block Completion Indicator */}
              {isComplete && (
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 rounded-xl flex items-center justify-center gap-2 sm:gap-3">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm sm:text-base font-bold text-green-700">
                    ✨ Blok Tamamlandı! İleri geçebilirsiniz.
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overall Progress */}
      <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 rounded-xl border-2 border-purple-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full">
            <p className="text-sm font-bold text-gray-800 mb-2">
              İlerleme: {completedBlocks} / {blocks.length} Blok Tamamlandı
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          {completedBlocks === blocks.length && (
            <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full border-2 border-green-400">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-bold text-green-700">
                🎉 Modül Tamamlandı!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
