import mongoose from 'mongoose';

const testResultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    answers: {
        skills: {
            type: Map,
            of: Number,
            required: true
        },
        interests: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
            required: true
        },
        values: {
            type: Map,
            of: Number,
            required: true
        }
    },
    results: {
        top3Personas: {
            gold: mongoose.Schema.Types.Mixed,
            silver: mongoose.Schema.Types.Mixed,
            bronze: mongoose.Schema.Types.Mixed
        },
        radarChartData: [mongoose.Schema.Types.Mixed],
        qualityFlags: mongoose.Schema.Types.Mixed,
        moduleScores: mongoose.Schema.Types.Mixed,
        compositeScores: mongoose.Schema.Types.Mixed,
        appliedWeights: mongoose.Schema.Types.Mixed,
        metadata: mongoose.Schema.Types.Mixed
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
testResultSchema.index({ userId: 1 });
testResultSchema.index({ completedAt: -1 });

const TestResult = mongoose.model('TestResult', testResultSchema);

export default TestResult;
