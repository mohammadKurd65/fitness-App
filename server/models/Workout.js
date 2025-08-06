// server/models/Workout.js
import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
},
date: {
    type: Date,
    default: Date.now,
},
exercises: [
    {
    exercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    sets: [
        {
        reps: { type: Number, required: true },
        weight: { type: Number, required: true },
          rest: { type: Number, default: 90 }, // ثانیه
        }
    ],
    }
],
duration: {
    type: Number, // دقیقه
    required: true,
},
notes: {
    type: String,
    default: '',
}
}, { timestamps: true });

export default mongoose.model('Workout', workoutSchema);