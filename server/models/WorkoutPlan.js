
import mongoose from 'mongoose';

const workoutPlanSchema = new mongoose.Schema({
name: {
    type: String,
    required: true,
},
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
},
isPublic: {
    type: Boolean,
    default: false,
},
days: [
    {
    day: {
        type: String,
        enum: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'],
        required: true,
    },
    exercises: [
        {
        exercise: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Exercise',
        },
        name: { type: String, required: true },
        }
    ]
    }
],
createdAt: {
    type: Date,
    default: Date.now,
},
updatedAt: {
    type: Date,
    default: Date.now,
}
}, { timestamps: true });

export default mongoose.model('WorkoutPlan', workoutPlanSchema);