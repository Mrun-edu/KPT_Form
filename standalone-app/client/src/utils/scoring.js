/**
 * Career Persona Test Scoring Algorithm
 * Implements complex psychometric scoring with normalization, quality control, and dynamic weighting
 */

/**
 * Module 1: Skills Test Scoring
 * Uses weighted average to prevent bias towards personas with more associated questions
 */
export function calculateSkillsScores(answers, testData) {
  const personas = testData.personas;
  const questions = testData.modules.skills.questions;

  const personaScores = {};
  const personaWeights = {};

  personas.forEach(persona => {
    personaScores[persona] = 0;
    personaWeights[persona] = 0;
  });

  questions.forEach(question => {
    const userAnswer = answers[question.id];

    if (userAnswer !== undefined && userAnswer >= 1 && userAnswer <= 5) {
      Object.entries(question.weights).forEach(([persona, weight]) => {
        personaScores[persona] += userAnswer * weight;
        personaWeights[persona] += weight;
      });
    }
  });

  const normalizedScores = {};

  personas.forEach(persona => {
    if (personaWeights[persona] > 0) {
      const weightedAverage = personaScores[persona] / personaWeights[persona];
      normalizedScores[persona] = ((weightedAverage - 1) / (5 - 1)) * 100;
    } else {
      normalizedScores[persona] = 0;
    }
  });

  return normalizedScores;
}

/**
 * Module 2: Interests Test Scoring
 */
export function calculateInterestsScores(answers, testData) {
  const personas = testData.personas;
  const blocks = testData.modules.interests.blocks;
  const scoringRules = testData.modules.interests.scoringRules;

  const rawScores = {};
  personas.forEach(persona => {
    rawScores[persona] = 0;
  });

  blocks.forEach(block => {
    const blockAnswers = answers[block.id];

    if (blockAnswers) {
      Object.entries(blockAnswers).forEach(([persona, rank]) => {
        let points = 0;
        switch (rank) {
          case 1: points = scoringRules.rank1; break;
          case 2: points = scoringRules.rank2; break;
          case 3: points = scoringRules.rank3; break;
          case 4: points = scoringRules.rank4; break;
        }
        rawScores[persona] += points;
      });
    }
  });

  const normalizedScores = {};
  const maxScore = scoringRules.maxRawScore;

  personas.forEach(persona => {
    normalizedScores[persona] = (rawScores[persona] / maxScore) * 100;
  });

  return normalizedScores;
}

/**
 * Module 3: Values Test Scoring with Quality Control
 */
export function calculateValuesScores(answers, testData) {
  const personas = testData.personas;
  const questions = testData.modules.values.questions;

  const qualityMetrics = assessAnswerQuality(answers, questions.length);

  const rawScores = {};
  const absoluteWeightSums = {};

  personas.forEach(persona => {
    rawScores[persona] = 0;
    absoluteWeightSums[persona] = 0;
  });

  questions.forEach(question => {
    const userAnswer = answers[question.id];

    if (userAnswer !== undefined && userAnswer >= 1 && userAnswer <= 5) {
      Object.entries(question.weights).forEach(([persona, weight]) => {
        let contribution = 0;

        if (weight > 0) {
          if (userAnswer === 5) contribution = weight * 2;
          else if (userAnswer === 4) contribution = weight * 1;
          else if (userAnswer === 3) contribution = 0;
          else if (userAnswer === 2) contribution = -weight * 0.5;
          else if (userAnswer === 1) contribution = -weight * 1;
        } else if (weight < 0) {
          if (userAnswer === 1) contribution = Math.abs(weight) * 2;
          else if (userAnswer === 2) contribution = Math.abs(weight) * 1;
          else if (userAnswer === 3) contribution = 0;
          else if (userAnswer === 4) contribution = weight * 1;
          else if (userAnswer === 5) contribution = weight * 2;
        }

        rawScores[persona] += contribution;
        absoluteWeightSums[persona] += Math.abs(weight);
      });
    }
  });

  const normalizedScores = {};

  personas.forEach(persona => {
    if (absoluteWeightSums[persona] > 0) {
      const normalizedValue = rawScores[persona] / absoluteWeightSums[persona];
      normalizedScores[persona] = ((normalizedValue + 2) / 4) * 100;
      normalizedScores[persona] = Math.max(0, Math.min(100, normalizedScores[persona]));
    } else {
      normalizedScores[persona] = 50;
    }
  });

  return {
    scores: normalizedScores,
    quality: qualityMetrics
  };
}

/**
 * Assess answer quality by detecting repetitive patterns
 */
export function assessAnswerQuality(answers, totalQuestions) {
  const frequency = {};
  let totalAnswered = 0;

  Object.values(answers).forEach(answer => {
    if (answer >= 1 && answer <= 5) {
      frequency[answer] = (frequency[answer] || 0) + 1;
      totalAnswered++;
    }
  });

  let maxFrequency = 0;
  let mostRepeatedAnswer = null;

  Object.entries(frequency).forEach(([answer, count]) => {
    if (count > maxFrequency) {
      maxFrequency = count;
      mostRepeatedAnswer = parseInt(answer);
    }
  });

  let qualityFlag = 'good';
  let qualityLabel = 'Good Quality';
  let weightMultiplier = 1.0;

  if (maxFrequency >= 20) {
    qualityFlag = 'veryLow';
    qualityLabel = 'Very Low Quality';
    weightMultiplier = 0.20;
  } else if (maxFrequency >= 16) {
    qualityFlag = 'low';
    qualityLabel = 'Low Quality';
    weightMultiplier = 0.40;
  } else if (maxFrequency >= 12) {
    qualityFlag = 'medium';
    qualityLabel = 'Medium Quality';
    weightMultiplier = 0.70;
  }

  return {
    flag: qualityFlag,
    label: qualityLabel,
    maxFrequency: maxFrequency,
    mostRepeatedAnswer: mostRepeatedAnswer,
    weightMultiplier: weightMultiplier,
    totalAnswered: totalAnswered
  };
}

/**
 * Calculate dynamic weights based on values test quality
 */
export function calculateDynamicWeights(qualityMetrics, defaultWeights) {
  const originalInterests = defaultWeights.interests;
  const originalValues = defaultWeights.values;
  const originalSkills = defaultWeights.skills;

  const adjustedValues = originalValues * qualityMetrics.weightMultiplier;
  const lostWeight = originalValues - adjustedValues;

  const ratio = originalInterests / originalSkills;
  const totalRatio = ratio + 1;

  const interestsShare = (ratio / totalRatio) * lostWeight;
  const skillsShare = (1 / totalRatio) * lostWeight;

  const adjustedWeights = {
    interests: originalInterests + interestsShare,
    values: adjustedValues,
    skills: originalSkills + skillsShare
  };

  const sum = adjustedWeights.interests + adjustedWeights.values + adjustedWeights.skills;

  return {
    interests: adjustedWeights.interests / sum,
    values: adjustedWeights.values / sum,
    skills: adjustedWeights.skills / sum
  };
}

/**
 * Calculate final composite scores for all personas
 */
export function calculateCompositeScores(moduleScores, dynamicWeights) {
  const personas = Object.keys(moduleScores.skills);
  const compositeScores = {};

  personas.forEach(persona => {
    compositeScores[persona] =
      (moduleScores.skills[persona] * dynamicWeights.skills) +
      (moduleScores.interests[persona] * dynamicWeights.interests) +
      (moduleScores.values[persona] * dynamicWeights.values);
  });

  return compositeScores;
}

/**
 * Get rank of a persona in a specific module
 */
function getRankInModule(persona, moduleScores) {
  const sorted = Object.entries(moduleScores)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);

  return sorted.indexOf(persona) + 1;
}

/**
 * Select top 3 personas with consistency filtering and tie-breaking
 */
export function selectTopPersonas(compositeScores, moduleScores) {
  const personas = Object.keys(compositeScores);

  const personaData = personas.map(persona => {
    const skillsRank = getRankInModule(persona, moduleScores.skills);
    const interestsRank = getRankInModule(persona, moduleScores.interests);
    const valuesRank = getRankInModule(persona, moduleScores.values);

    const top5Count = [skillsRank, interestsRank, valuesRank].filter(rank => rank <= 5).length;

    return {
      name: persona,
      compositeScore: compositeScores[persona],
      interestsScore: moduleScores.interests[persona],
      skillsRank,
      interestsRank,
      valuesRank,
      top5Count
    };
  });

  personaData.sort((a, b) => {
    const scoreDiff = b.compositeScore - a.compositeScore;
    if (scoreDiff !== 0) {
      return scoreDiff;
    }
    return b.interestsScore - a.interestsScore;
  });

  const top3 = personaData.slice(0, 3);

  return {
    gold: {
      persona: top3[0].name,
      matchPercentage: Math.round(top3[0].compositeScore),
      label: 'Gold Match',
      moduleRanks: {
        skills: top3[0].skillsRank,
        interests: top3[0].interestsRank,
        values: top3[0].valuesRank
      },
      consistencyScore: top3[0].top5Count
    },
    silver: {
      persona: top3[1].name,
      matchPercentage: Math.round(top3[1].compositeScore),
      label: 'Silver Match',
      moduleRanks: {
        skills: top3[1].skillsRank,
        interests: top3[1].interestsRank,
        values: top3[1].valuesRank
      },
      consistencyScore: top3[1].top5Count
    },
    bronze: {
      persona: top3[2].name,
      matchPercentage: Math.round(top3[2].compositeScore),
      label: 'Bronze Match',
      moduleRanks: {
        skills: top3[2].skillsRank,
        interests: top3[2].interestsRank,
        values: top3[2].valuesRank
      },
      consistencyScore: top3[2].top5Count
    }
  };
}

/**
 * Main function: Calculate complete career persona test results
 */
export function calculateCareerPersonaTest(userAnswers, testData) {
  const skillsScores = calculateSkillsScores(userAnswers.skills, testData);
  const interestsScores = calculateInterestsScores(userAnswers.interests, testData);
  const valuesResult = calculateValuesScores(userAnswers.values, testData);

  const moduleScores = {
    skills: skillsScores,
    interests: interestsScores,
    values: valuesResult.scores
  };

  const dynamicWeights = calculateDynamicWeights(
    valuesResult.quality,
    testData.defaultWeights
  );

  const compositeScores = calculateCompositeScores(moduleScores, dynamicWeights);
  const top3 = selectTopPersonas(compositeScores, moduleScores);

  const radarData = testData.personas.map(persona => ({
    persona: persona,
    score: Math.round(compositeScores[persona])
  }));

  const qualityFlags = {
    values_quality_warning: valuesResult.quality.flag !== 'good',
    values_quality_level: valuesResult.quality.label,
    values_max_frequency: valuesResult.quality.maxFrequency,
    values_most_repeated_answer: valuesResult.quality.mostRepeatedAnswer,
    weights_adjusted: valuesResult.quality.weightMultiplier < 1.0
  };

  return {
    top3Personas: top3,
    radarChartData: radarData,
    qualityFlags: qualityFlags,
    moduleScores: moduleScores,
    compositeScores: compositeScores,
    appliedWeights: {
      interests: Math.round(dynamicWeights.interests * 100),
      values: Math.round(dynamicWeights.values * 100),
      skills: Math.round(dynamicWeights.skills * 100)
    },
    metadata: {
      valuesQuality: valuesResult.quality,
      originalWeights: {
        interests: testData.defaultWeights.interests * 100,
        values: testData.defaultWeights.values * 100,
        skills: testData.defaultWeights.skills * 100
      }
    }
  };
}
