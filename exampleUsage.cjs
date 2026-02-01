/**
 * Example Usage of Career Persona Test Scoring Algorithm
 * This file demonstrates how to use the scoring system with sample data
 */

const testData = require('./careerPersonaTestData.json');
const {
  calculateCareerPersonaTest,
  calculateSkillsScores,
  calculateInterestsScores,
  calculateValuesScores
} = require('./careerPersonaScoring.cjs');

// ============================================
// EXAMPLE 1: High Quality Answers
// ============================================
console.log('\n' + '='.repeat(60));
console.log('EXAMPLE 1: High Quality Diverse Answers');
console.log('='.repeat(60));

const highQualityAnswers = {
  // Skills module: 24 questions rated 1-5
  skills: {
    skills_1: 4,
    skills_2: 3,
    skills_3: 2,
    skills_4: 5,
    skills_5: 4,
    skills_6: 5,
    skills_7: 2,
    skills_8: 3,
    skills_9: 3,
    skills_10: 4,
    skills_11: 3,
    skills_12: 2,
    skills_13: 4,
    skills_14: 4,
    skills_15: 5,
    skills_16: 5,
    skills_17: 4,
    skills_18: 5,
    skills_19: 3,
    skills_20: 3,
    skills_21: 2,
    skills_22: 2,
    skills_23: 4,
    skills_24: 4
  },

  // Interests module: 12 blocks, each with 4 options ranked 1-4
  interests: {
    block_1: {
      'Vizyoner Yaratıcı': 2,
      'İyilik Elçisi': 1,
      'Araştırmacı': 3,
      'Ticari Zeka': 4
    },
    block_2: {
      'Doğal Aktivist': 4,
      'Neşe Kaynağı': 3,
      'Deneysever': 2,
      'Koruyucu': 1
    },
    block_3: {
      'Sorunçözer': 3,
      'Rehber': 1,
      'Taktisyen': 4,
      'Düzenperest': 2
    },
    block_4: {
      'Doğal Aktivist': 4,
      'İyilik Elçisi': 1,
      'Araştırmacı': 2,
      'Ticari Zeka': 3
    },
    block_5: {
      'Vizyoner Yaratıcı': 3,
      'Neşe Kaynağı': 4,
      'Deneysever': 2,
      'Koruyucu': 1
    },
    block_6: {
      'Sorunçözer': 4,
      'Rehber': 1,
      'Taktisyen': 3,
      'Düzenperest': 2
    },
    block_7: {
      'Vizyoner Yaratıcı': 3,
      'İyilik Elçisi': 1,
      'Araştırmacı': 2,
      'Ticari Zeka': 4
    },
    block_8: {
      'Doğal Aktivist': 4,
      'Neşe Kaynağı': 3,
      'Deneysever': 2,
      'Koruyucu': 1
    },
    block_9: {
      'Sorunçözer': 4,
      'Rehber': 1,
      'Taktisyen': 3,
      'Düzenperest': 2
    },
    block_10: {
      'Vizyoner Yaratıcı': 3,
      'İyilik Elçisi': 1,
      'Araştırmacı': 2,
      'Ticari Zeka': 4
    },
    block_11: {
      'Doğal Aktivist': 4,
      'Neşe Kaynağı': 3,
      'Deneysever': 2,
      'Koruyucu': 1
    },
    block_12: {
      'Sorunçözer': 4,
      'Rehber': 1,
      'Taktisyen': 3,
      'Düzenperest': 2
    }
  },

  // Values module: 24 questions rated 1-5
  values: {
    values_1: 3,
    values_2: 4,
    values_3: 2,
    values_4: 3,
    values_5: 5,
    values_6: 5,
    values_7: 4,
    values_8: 3,
    values_9: 3,
    values_10: 2,
    values_11: 4,
    values_12: 3,
    values_13: 5,
    values_14: 5,
    values_15: 3,
    values_16: 4,
    values_17: 4,
    values_18: 4,
    values_19: 2,
    values_20: 2,
    values_21: 3,
    values_22: 3,
    values_23: 2,
    values_24: 3
  }
};

const result1 = calculateCareerPersonaTest(highQualityAnswers, testData);

console.log('\nTOP 3 PERSONAS:');
console.log(`🥇 GOLD: ${result1.top3Personas.gold.persona} - ${result1.top3Personas.gold.matchPercentage}%`);
console.log(`   Module Ranks - Skills: #${result1.top3Personas.gold.moduleRanks.skills}, Interests: #${result1.top3Personas.gold.moduleRanks.interests}, Values: #${result1.top3Personas.gold.moduleRanks.values}`);
console.log(`   Consistency Score: ${result1.top3Personas.gold.consistencyScore}/3 modules in top 5`);

console.log(`\n🥈 SILVER: ${result1.top3Personas.silver.persona} - ${result1.top3Personas.silver.matchPercentage}%`);
console.log(`   Module Ranks - Skills: #${result1.top3Personas.silver.moduleRanks.skills}, Interests: #${result1.top3Personas.silver.moduleRanks.interests}, Values: #${result1.top3Personas.silver.moduleRanks.values}`);
console.log(`   Consistency Score: ${result1.top3Personas.silver.consistencyScore}/3 modules in top 5`);

console.log(`\n🥉 BRONZE: ${result1.top3Personas.bronze.persona} - ${result1.top3Personas.bronze.matchPercentage}%`);
console.log(`   Module Ranks - Skills: #${result1.top3Personas.bronze.moduleRanks.skills}, Interests: #${result1.top3Personas.bronze.moduleRanks.interests}, Values: #${result1.top3Personas.bronze.moduleRanks.values}`);
console.log(`   Consistency Score: ${result1.top3Personas.bronze.consistencyScore}/3 modules in top 5`);

console.log('\nQUALITY FLAGS:');
console.log(`  Quality Warning: ${result1.qualityFlags.values_quality_warning}`);
console.log(`  Quality Level: ${result1.qualityFlags.values_quality_level}`);
console.log(`  Weights Adjusted: ${result1.qualityFlags.weights_adjusted}`);

console.log('\nAPPLIED WEIGHTS:');
console.log(`  Interests: ${result1.appliedWeights.interests}%`);
console.log(`  Values: ${result1.appliedWeights.values}%`);
console.log(`  Skills: ${result1.appliedWeights.skills}%`);

console.log('\nRADAR CHART DATA (Top 5):');
const sortedRadar1 = result1.radarChartData.sort((a, b) => b.score - a.score).slice(0, 5);
sortedRadar1.forEach((item, index) => {
  console.log(`  ${index + 1}. ${item.persona}: ${item.score}`);
});

// ============================================
// EXAMPLE 2: Low Quality Answers (Spam Detection)
// ============================================
console.log('\n\n' + '='.repeat(60));
console.log('EXAMPLE 2: Low Quality Answers (All 4s in Values)');
console.log('='.repeat(60));

const lowQualityAnswers = {
  skills: {
    skills_1: 3, skills_2: 4, skills_3: 3, skills_4: 4, skills_5: 3,
    skills_6: 4, skills_7: 3, skills_8: 4, skills_9: 3, skills_10: 4,
    skills_11: 3, skills_12: 4, skills_13: 3, skills_14: 4, skills_15: 3,
    skills_16: 4, skills_17: 3, skills_18: 4, skills_19: 3, skills_20: 4,
    skills_21: 3, skills_22: 4, skills_23: 3, skills_24: 4
  },

  interests: {
    block_1: { 'Vizyoner Yaratıcı': 1, 'İyilik Elçisi': 2, 'Araştırmacı': 3, 'Ticari Zeka': 4 },
    block_2: { 'Doğal Aktivist': 4, 'Neşe Kaynağı': 3, 'Deneysever': 2, 'Koruyucu': 1 },
    block_3: { 'Sorunçözer': 4, 'Rehber': 3, 'Taktisyen': 2, 'Düzenperest': 1 },
    block_4: { 'Doğal Aktivist': 4, 'İyilik Elçisi': 3, 'Araştırmacı': 2, 'Ticari Zeka': 1 },
    block_5: { 'Vizyoner Yaratıcı': 1, 'Neşe Kaynağı': 2, 'Deneysever': 3, 'Koruyucu': 4 },
    block_6: { 'Sorunçözer': 4, 'Rehber': 3, 'Taktisyen': 2, 'Düzenperest': 1 },
    block_7: { 'Vizyoner Yaratıcı': 1, 'İyilik Elçisi': 2, 'Araştırmacı': 3, 'Ticari Zeka': 4 },
    block_8: { 'Doğal Aktivist': 4, 'Neşe Kaynağı': 3, 'Deneysever': 2, 'Koruyucu': 1 },
    block_9: { 'Sorunçözer': 4, 'Rehber': 3, 'Taktisyen': 2, 'Düzenperest': 1 },
    block_10: { 'Vizyoner Yaratıcı': 1, 'İyilik Elçisi': 2, 'Araştırmacı': 3, 'Ticari Zeka': 4 },
    block_11: { 'Doğal Aktivist': 4, 'Neşe Kaynağı': 3, 'Deneysever': 2, 'Koruyucu': 1 },
    block_12: { 'Sorunçözer': 4, 'Rehber': 3, 'Taktisyen': 2, 'Düzenperest': 1 }
  },

  // ALL 4s - should trigger low quality warning
  values: {
    values_1: 4, values_2: 4, values_3: 4, values_4: 4, values_5: 4,
    values_6: 4, values_7: 4, values_8: 4, values_9: 4, values_10: 4,
    values_11: 4, values_12: 4, values_13: 4, values_14: 4, values_15: 4,
    values_16: 4, values_17: 4, values_18: 4, values_19: 4, values_20: 4,
    values_21: 4, values_22: 4, values_23: 4, values_24: 4
  }
};

const result2 = calculateCareerPersonaTest(lowQualityAnswers, testData);

console.log('\nTOP 3 PERSONAS:');
console.log(`🥇 GOLD: ${result2.top3Personas.gold.persona} - ${result2.top3Personas.gold.matchPercentage}%`);
console.log(`🥈 SILVER: ${result2.top3Personas.silver.persona} - ${result2.top3Personas.silver.matchPercentage}%`);
console.log(`🥉 BRONZE: ${result2.top3Personas.bronze.persona} - ${result2.top3Personas.bronze.matchPercentage}%`);

console.log('\n⚠️  QUALITY FLAGS:');
console.log(`  Quality Warning: ${result2.qualityFlags.values_quality_warning}`);
console.log(`  Quality Level: ${result2.qualityFlags.values_quality_level}`);
console.log(`  Max Frequency: ${result2.qualityFlags.values_max_frequency}/24`);
console.log(`  Most Repeated Answer: ${result2.qualityFlags.values_most_repeated_answer}`);
console.log(`  Weights Adjusted: ${result2.qualityFlags.weights_adjusted}`);

console.log('\nWEIGHT ADJUSTMENT DUE TO QUALITY:');
console.log('  Original Weights:');
console.log(`    Interests: ${result2.metadata.originalWeights.interests}%`);
console.log(`    Values: ${result2.metadata.originalWeights.values}%`);
console.log(`    Skills: ${result2.metadata.originalWeights.skills}%`);
console.log('  Adjusted Weights:');
console.log(`    Interests: ${result2.appliedWeights.interests}% ⬆️`);
console.log(`    Values: ${result2.appliedWeights.values}% ⬇️ (reduced due to low quality)`);
console.log(`    Skills: ${result2.appliedWeights.skills}% ⬆️`);

// ============================================
// EXAMPLE 3: Testing Individual Modules
// ============================================
console.log('\n\n' + '='.repeat(60));
console.log('EXAMPLE 3: Testing Individual Modules');
console.log('='.repeat(60));

const skillsOnly = calculateSkillsScores(highQualityAnswers.skills, testData);
console.log('\nSkills Scores (Top 5):');
const sortedSkills = Object.entries(skillsOnly)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);
sortedSkills.forEach(([persona, score], index) => {
  console.log(`  ${index + 1}. ${persona}: ${score.toFixed(2)}`);
});

const interestsOnly = calculateInterestsScores(highQualityAnswers.interests, testData);
console.log('\nInterests Scores (Top 5):');
const sortedInterests = Object.entries(interestsOnly)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);
sortedInterests.forEach(([persona, score], index) => {
  console.log(`  ${index + 1}. ${persona}: ${score.toFixed(2)}`);
});

const valuesOnly = calculateValuesScores(highQualityAnswers.values, testData);
console.log('\nValues Scores (Top 5):');
const sortedValues = Object.entries(valuesOnly.scores)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);
sortedValues.forEach(([persona, score], index) => {
  console.log(`  ${index + 1}. ${persona}: ${score.toFixed(2)}`);
});
console.log(`\nValues Quality: ${valuesOnly.quality.label}`);

// ============================================
// EXAMPLE 4: Complete JSON Output for Frontend
// ============================================
console.log('\n\n' + '='.repeat(60));
console.log('EXAMPLE 4: Complete JSON Output for Frontend');
console.log('='.repeat(60));

const completeOutput = calculateCareerPersonaTest(highQualityAnswers, testData);
console.log(JSON.stringify(completeOutput, null, 2));
