/**
 * Career Persona Test Scoring Algorithm
 * Implements complex psychometric scoring with normalization, quality control, and dynamic weighting
 */

// Import the test data structure
// const testData = require('./careerPersonaTestData.json');

/**
 * Module 1: Skills Test Scoring
 * Uses weighted average to prevent bias towards personas with more associated questions
 *
 * @param {Object} answers - User answers for skills questions (e.g., { "skills_1": 4, "skills_2": 5, ... })
 * @param {Object} testData - The complete test data structure
 * @returns {Object} Normalized scores for each persona (0-100 scale)
 */
function calculateSkillsScores(answers, testData) {
  const personas = testData.personas;
  const questions = testData.modules.skills.questions;

  // Initialize accumulators for each persona
  const personaScores = {};
  const personaWeights = {};

  personas.forEach(persona => {
    personaScores[persona] = 0;
    personaWeights[persona] = 0;
  });

  // Calculate weighted sum and total weights for each persona
  questions.forEach(question => {
    const userAnswer = answers[question.id];

    if (userAnswer !== undefined && userAnswer >= 1 && userAnswer <= 5) {
      Object.entries(question.weights).forEach(([persona, weight]) => {
        personaScores[persona] += userAnswer * weight;
        personaWeights[persona] += weight;
      });
    }
  });

  // Calculate weighted average and normalize to 0-100 scale
  const normalizedScores = {};

  personas.forEach(persona => {
    if (personaWeights[persona] > 0) {
      // Weighted average: Sum(answer * weight) / Sum(weights)
      const weightedAverage = personaScores[persona] / personaWeights[persona];

      // Normalize from 1-5 scale to 0-100 scale
      // Formula: (value - min) / (max - min) * 100
      normalizedScores[persona] = ((weightedAverage - 1) / (5 - 1)) * 100;
    } else {
      normalizedScores[persona] = 0;
    }
  });

  return normalizedScores;
}

/**
 * Module 2: Interests Test Scoring
 * Uses ranking system where each block has 4 options ranked 1-4
 * Rank 1 = 3 points, Rank 2 = 2 points, Rank 3 = 1 point, Rank 4 = 0 points
 *
 * @param {Object} answers - User rankings for each block (e.g., { "block_1": { "Vizyoner Yaratıcı": 1, "İyilik Elçisi": 3, ... } })
 * @param {Object} testData - The complete test data structure
 * @returns {Object} Normalized scores for each persona (0-100 scale)
 */
function calculateInterestsScores(answers, testData) {
  const personas = testData.personas;
  const blocks = testData.modules.interests.blocks;
  const scoringRules = testData.modules.interests.scoringRules;

  // Initialize raw scores
  const rawScores = {};
  personas.forEach(persona => {
    rawScores[persona] = 0;
  });

  // Calculate raw scores based on rankings
  blocks.forEach(block => {
    const blockAnswers = answers[block.id];

    if (blockAnswers) {
      Object.entries(blockAnswers).forEach(([persona, rank]) => {
        // Convert rank to points
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

  // Normalize from 0-12 scale to 0-100 scale
  const normalizedScores = {};
  const maxScore = scoringRules.maxRawScore;

  personas.forEach(persona => {
    normalizedScores[persona] = (rawScores[persona] / maxScore) * 100;
  });

  return normalizedScores;
}

/**
 * Module 3: Values Test Scoring with Quality Control
 * Uses positive/negative weights with quality-based adjustments
 *
 * @param {Object} answers - User answers for values questions (e.g., { "values_1": 4, "values_2": 5, ... })
 * @param {Object} testData - The complete test data structure
 * @returns {Object} Contains normalized scores and quality metrics
 */
function calculateValuesScores(answers, testData) {
  const personas = testData.personas;
  const questions = testData.modules.values.questions;
  const qualityThresholds = testData.modules.values.qualityThresholds;

  // Step 1: Calculate answer quality (anti-spam mechanism)
  const qualityMetrics = assessAnswerQuality(answers, questions.length);

  // Initialize accumulators
  const rawScores = {};
  const absoluteWeightSums = {};

  personas.forEach(persona => {
    rawScores[persona] = 0;
    absoluteWeightSums[persona] = 0;
  });

  // Step 2: Calculate raw scores with directional weighting
  questions.forEach(question => {
    const userAnswer = answers[question.id];

    if (userAnswer !== undefined && userAnswer >= 1 && userAnswer <= 5) {
      Object.entries(question.weights).forEach(([persona, weight]) => {
        // Map user answer to contribution
        let contribution = 0;

        if (weight > 0) {
          // Positive weights: 4,5 contribute positively
          if (userAnswer === 5) contribution = weight * 2;
          else if (userAnswer === 4) contribution = weight * 1;
          else if (userAnswer === 3) contribution = 0;
          else if (userAnswer === 2) contribution = -weight * 0.5;
          else if (userAnswer === 1) contribution = -weight * 1;
        } else if (weight < 0) {
          // Negative weights: 1,2 contribute positively (reversing the negative)
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

  // Step 3: Normalize scores to 0-100 scale
  const normalizedScores = {};

  personas.forEach(persona => {
    if (absoluteWeightSums[persona] > 0) {
      // Normalize by absolute weight sum
      const normalizedValue = rawScores[persona] / absoluteWeightSums[persona];

      // Convert to 0-100 scale (assuming range is approximately -2 to +2)
      normalizedScores[persona] = ((normalizedValue + 2) / 4) * 100;

      // Clamp to 0-100
      normalizedScores[persona] = Math.max(0, Math.min(100, normalizedScores[persona]));
    } else {
      normalizedScores[persona] = 50; // Neutral score if no weights
    }
  });

  return {
    scores: normalizedScores,
    quality: qualityMetrics
  };
}

/**
 * Assess answer quality by detecting repetitive patterns
 *
 * @param {Object} answers - User answers
 * @param {number} totalQuestions - Total number of questions
 * @returns {Object} Quality assessment with flag and most repeated answer
 */
function assessAnswerQuality(answers, totalQuestions) {
  // Count frequency of each answer
  const frequency = {};
  let totalAnswered = 0;

  Object.values(answers).forEach(answer => {
    if (answer >= 1 && answer <= 5) {
      frequency[answer] = (frequency[answer] || 0) + 1;
      totalAnswered++;
    }
  });

  // Find most repeated answer
  let maxFrequency = 0;
  let mostRepeatedAnswer = null;

  Object.entries(frequency).forEach(([answer, count]) => {
    if (count > maxFrequency) {
      maxFrequency = count;
      mostRepeatedAnswer = parseInt(answer);
    }
  });

  // Determine quality level
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
 *
 * @param {Object} qualityMetrics - Quality assessment from values test
 * @param {Object} defaultWeights - Default global weights
 * @returns {Object} Adjusted weights for final calculation
 */
function calculateDynamicWeights(qualityMetrics, defaultWeights) {
  const originalInterests = defaultWeights.interests;
  const originalValues = defaultWeights.values;
  const originalSkills = defaultWeights.skills;

  // Apply quality-based multiplier to values weight
  const adjustedValues = originalValues * qualityMetrics.weightMultiplier;

  // Calculate the weight lost from values
  const lostWeight = originalValues - adjustedValues;

  // Redistribute lost weight to Skills and Interests proportionally
  // Original ratio: Interests:Skills = 40:25 = 1.6:1
  const ratio = originalInterests / originalSkills;
  const totalRatio = ratio + 1;

  const interestsShare = (ratio / totalRatio) * lostWeight;
  const skillsShare = (1 / totalRatio) * lostWeight;

  const adjustedWeights = {
    interests: originalInterests + interestsShare,
    values: adjustedValues,
    skills: originalSkills + skillsShare
  };

  // Normalize to ensure they sum to 1.0
  const sum = adjustedWeights.interests + adjustedWeights.values + adjustedWeights.skills;

  return {
    interests: adjustedWeights.interests / sum,
    values: adjustedWeights.values / sum,
    skills: adjustedWeights.skills / sum
  };
}

/**
 * Calculate final composite scores for all personas
 *
 * @param {Object} moduleScores - Scores from all three modules
 * @param {Object} dynamicWeights - Calculated dynamic weights
 * @returns {Object} Final composite scores (0-100) for each persona
 */
function calculateCompositeScores(moduleScores, dynamicWeights) {
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
 * Select top 3 personas with consistency filtering and tie-breaking
 *
 * @param {Object} compositeScores - Final composite scores
 * @param {Object} moduleScores - Individual module scores for consistency check
 * @returns {Object} Top 3 personas with match percentages and labels
 */
function selectTopPersonas(compositeScores, moduleScores) {
  const personas = Object.keys(compositeScores);

  // Create array of personas with their scores and rankings in each module
  const personaData = personas.map(persona => {
    // Get rankings in each module
    const skillsRank = getRankInModule(persona, moduleScores.skills);
    const interestsRank = getRankInModule(persona, moduleScores.interests);
    const valuesRank = getRankInModule(persona, moduleScores.values);

    // Count how many times this persona is in top 5 of individual modules
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

  // Sort by composite score (descending), with interests score as tie-breaker
  personaData.sort((a, b) => {
    // Primary sort: composite score (descending)
    const scoreDiff = b.compositeScore - a.compositeScore;
    if (scoreDiff !== 0) {
      return scoreDiff;
    }
    // Secondary sort (tie-breaker): interests score (descending)
    return b.interestsScore - a.interestsScore;
  });

  // Select top 3 based solely on composite score
  // We no longer filter by top5Count because dynamic weighting (e.g. valid quality adjustments)
  // should be the primary determinant of the result.
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
 * Get rank of a persona in a specific module
 *
 * @param {string} persona - Persona name
 * @param {Object} moduleScores - Scores for this module
 * @returns {number} Rank (1-based)
 */
function getRankInModule(persona, moduleScores) {
  const sorted = Object.entries(moduleScores)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);

  return sorted.indexOf(persona) + 1;
}

/**
 * Main function: Calculate complete career persona test results
 *
 * @param {Object} userAnswers - All user answers { skills: {...}, interests: {...}, values: {...} }
 * @param {Object} testData - Complete test data structure
 * @returns {Object} Complete results with top 3 personas, radar data, and quality flags
 */
function calculateCareerPersonaTest(userAnswers, testData) {
  // Step 1: Calculate module scores
  const skillsScores = calculateSkillsScores(userAnswers.skills, testData);
  const interestsScores = calculateInterestsScores(userAnswers.interests, testData);
  const valuesResult = calculateValuesScores(userAnswers.values, testData);

  const moduleScores = {
    skills: skillsScores,
    interests: interestsScores,
    values: valuesResult.scores
  };

  // Step 2: Calculate dynamic weights based on quality
  const dynamicWeights = calculateDynamicWeights(
    valuesResult.quality,
    testData.defaultWeights
  );

  // Step 3: Calculate composite scores
  const compositeScores = calculateCompositeScores(moduleScores, dynamicWeights);

  // Step 4: Select top 3 personas
  const top3 = selectTopPersonas(compositeScores, moduleScores);

  // Step 5: Prepare radar chart data
  const radarData = testData.personas.map(persona => ({
    persona: persona,
    score: Math.round(compositeScores[persona])
  }));

  // Step 6: Prepare quality flags
  const qualityFlags = {
    values_quality_warning: valuesResult.quality.flag !== 'good',
    values_quality_level: valuesResult.quality.label,
    values_max_frequency: valuesResult.quality.maxFrequency,
    values_most_repeated_answer: valuesResult.quality.mostRepeatedAnswer,
    weights_adjusted: valuesResult.quality.weightMultiplier < 1.0
  };

  // Return complete results
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

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateSkillsScores,
    calculateInterestsScores,
    calculateValuesScores,
    assessAnswerQuality,
    calculateDynamicWeights,
    calculateCompositeScores,
    selectTopPersonas,
    calculateCareerPersonaTest
  };
}
