// server/models/Exercise.js
import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
name: {
    type: String,
    required: true,
    trim: true,
},
muscle: {
    type: String,
    enum: ['سینه', 'پشت', 'پا', 'شانه', 'بازو', 'هسته'],
    required: true,
},
equipment: {
    type: String,
    enum: ['دمبل', 'هالتر', 'بدون وزنه', 'ماشین', 'کش', 'کابل'],
    default: 'بدون وزنه',
},
instructions: {
    type: String,
    default: '',
},
image: {
    type: String,
    default: 'https://via.placeholder.com/400x200?text=Exercise+Image',
},
isCustom: {
    type: Boolean,
    default: false,
},
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // فقط برای حرکات سفارشی
}
}, { timestamps: true });

export default mongoose.model('Exercise', exerciseSchema);