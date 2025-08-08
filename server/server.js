// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Workout from './models/Workout.js';
import Exercise from './models/Exercise.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
origin: 'http://localhost:3000',
credentials: true,
}));
app.use(express.json());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fittrack')
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// User Model
const userSchema = new mongoose.Schema({
name: { type: String, required: true },
email: { type: String, required: true, unique: true },
password: { type: String, required: true },
avatar: { type: String, default: '' },
createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Routes

app.post('/api/auth/register', async (req, res) => {
const { name, email, password } = req.body;

try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
    return res.status(400).json({ message: 'کاربری با این ایمیل وجود دارد.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
    message: 'ثبت‌نام موفقیت‌آمیز بود.',
    token,
    user: { id: user._id, name, email, avatar: user.avatar }
    });
} catch (err) {
    res.status(500).json({ message: 'خطا در سرور', error: err.message });
}
});

app.post('/api/auth/login', async (req, res) => {
const { email, password } = req.body;

try {
    const user = await User.findOne({ email });
    if (!user) {
    return res.status(400).json({ message: 'ایمیل یا رمز عبور نادرست است.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
    return res.status(400).json({ message: 'ایمیل یا رمز عبور نادرست است.' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
    message: 'ورود موفقیت‌آمیز',
    token,
    user: { id: user._id, name: user.name, email, avatar: user.avatar }
    });
} catch (err) {
    res.status(500).json({ message: 'خطا در سرور', error: err.message });
}
});

const authenticate = (req, res, next) => {
const authHeader = req.headers['authorization'];
const token = authHeader && authHeader.split(' ')[1];

if (!token) {
    return res.status(401).json({ message: 'دسترسی نیاز به توکن دارد.' });
}

jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
    return res.status(403).json({ message: 'توکن نامعتبر یا منقضی شده است.' });
    }
    req.user = user;
    next();
});
};


// POST /api/workouts - ذخیره تمرین جدید
app.post('/api/workouts', authenticate, async (req, res) => {
try {
    const { date, exercises, duration, notes } = req.body;

    // اعتبارسنجی
    if (!exercises || exercises.length === 0) {
    return res.status(400).json({ message: 'حداقل یک حرکت باید اضافه کنید.' });
    }

    const workout = new Workout({
    user: req.user.id,
    date,
    exercises,
    duration,
    notes,
    });

    const savedWorkout = await workout.save();
    res.status(201).json(savedWorkout);
} catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطا در ذخیره تمرین' });
}
});

// POST /api/exercises/custom - ایجاد حرکت سفارشی
app.post('/api/exercises/custom', authenticate, async (req, res) => {
try {
    const { name, muscle, equipment, instructions, image } = req.body;

    // اعتبارسنجی
    if (!name || !muscle) {
    return res.status(400).json({ message: 'نام و عضله الزامی است.' });
    }

    const exercise = new Exercise({
    name,
    muscle,
    equipment: equipment || 'بدون وزنه',
    instructions: instructions || '',
    image: image || 'https://via.placeholder.com/400x200?text=Exercise',
    isCustom: true,
    user: req.user.id
    });

    const savedExercise = await exercise.save();
    res.status(201).json(savedExercise);
} catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطا در ایجاد حرکت' });
}
});

// PUT /api/exercises/custom/:id - ویرایش حرکت سفارشی
app.put('/api/exercises/custom/:id', authenticate, async (req, res) => {
try {
    const { id } = req.params;
    const { name, muscle, equipment, instructions, image } = req.body;

    // چک کردن وجود حرکت و متعلق بودن به کاربر
    const exercise = await Exercise.findOne({
    _id: id,
    user: req.user.id,
    isCustom: true
    });

    if (!exercise) {
    return res.status(404).json({ message: 'حرکت یافت نشد یا دسترسی ندارید.' });
    }

    // آپدیت فیلدها
    exercise.name = name || exercise.name;
    exercise.muscle = muscle || exercise.muscle;
    exercise.equipment = equipment || exercise.equipment;
    exercise.instructions = instructions || exercise.instructions;
    exercise.image = image || exercise.image;

    const updatedExercise = await exercise.save();
    res.json(updatedExercise);
} catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطا در ویرایش حرکت' });
}
});

app.get('/api/users/me', authenticate, async (req, res) => {
try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
    return res.status(404).json({ message: 'کاربر یافت نشد.' });
    }
    res.json(user);
} catch (err) {
    res.status(500).json({ message: 'خطا در دریافت اطلاعات کاربر' });
}
});

// Test route
app.get('/api/test', (req, res) => {
res.json({ message: 'سرور با موفقیت کار می‌کند!' });
});

// GET /api/workouts - دریافت تمرینات کاربر
app.get('/api/workouts', authenticate, async (req, res) => {
try {
    const workouts = await Workout
    .find({ user: req.user.id })
    .sort({ date: -1 })
    .limit(5)
    .select('date exercises duration')
      .populate('exercises.exercise', 'name') // اگر مدل Exercise داشته باشیم
    .exec();

    res.json(workouts);
} catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطا در دریافت تمرینات' });
}
});


// GET /api/exercises - دریافت همه حرکات (استاندارد + سفارشی کاربر)
app.get('/api/exercises', authenticate, async (req, res) => {
try {
    // فقط حرکات سفارشی کاربر جاری
    const customExercises = await Exercise.find({
    user: req.user.id,
    isCustom: true
    }).sort({ createdAt: -1 });

    // حرکات استاندارد (isCustom: false)
    const standardExercises = [
    {
        _id: 'standard-1',
        name: 'اسکوات',
        muscle: 'پا',
        equipment: 'هالتر',
        instructions: 'پای خود را به عرض شانه باز کنید و به آرامی خم شوید تا ران‌ها موازی زمین شوند.',
        image: 'https://example.com/squat.jpg',
        isCustom: false
    },
    {
        _id: 'standard-2',
        name: 'دمبل پرس',
        muscle: 'سینه',
        equipment: 'دمبل',
        instructions: 'روی نیمکت دراز بکشید و دمبل‌ها را به سمت بالا هل دهید.',
        image: 'https://example.com/dumbbell-press.jpg',
        isCustom: false
    },
    {
        _id: 'standard-3',
        name: 'کشش دمبل',
        muscle: 'پشت',
        equipment: 'دمبل',
        instructions: 'با خم شدن به جلو، دمبل را به سمت کمر بکشید.',
        image: 'https://example.com/dumbbell-row.jpg',
        isCustom: false
    },
    {
        _id: 'standard-4',
        name: 'پول‌آپ',
        muscle: 'پشت',
        equipment: 'بدون وزنه',
        instructions: 'با گرفتن میله، بدن خود را به سمت بالا بکشید.',
        image: 'https://example.com/pullup.jpg',
        isCustom: false
    },
    {
        _id: 'standard-5',
        name: 'پرس شانه',
        muscle: 'شانه',
        equipment: 'دمبل',
        instructions: 'دمبل‌ها را از دو طرف سر به بالا هل دهید.',
        image: 'https://example.com/shoulder-press.jpg',
        isCustom: false
    }
    ];

    // ادغام حرکات استاندارد و سفارشی
    const exercises = [...standardExercises, ...customExercises];

    res.json(exercises);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطا در دریافت حرکات' });
  }
});

// GET /api/exercises/:id - دریافت یک حرکت خاص
app.get('/api/exercises/:id', authenticate, async (req, res) => {
try {
    const { id } = req.params;

    // اگر id استاندارد باشد (مثل 'standard-1')
    if (id.startsWith('standard-')) {
    const standardExercises = [
        {
        _id: 'standard-1',
        name: 'اسکوات',
        muscle: 'پا',
        equipment: 'هالتر',
        instructions: 'پای خود را به عرض شانه باز کنید و به آرامی خم شوید تا ران‌ها موازی زمین شوند. سرعت پایین، کنترل بالا.',
        image: 'https://example.com/squat.jpg',
        isCustom: false
        },
        // ... سایر حرکات استاندارد
    ];

    const exercise = standardExercises.find(ex => ex._id === id);
    if (!exercise) {
        return res.status(404).json({ message: 'حرکت یافت نشد.' });
    }

    return res.json(exercise);
    }

    // اگر حرکت سفارشی باشد
    const customExercise = await Exercise.findOne({
    _id: id,
    user: req.user.id,
    isCustom: true
    });

    if (!customExercise) {
    return res.status(404).json({ message: 'حرکت یافت نشد یا دسترسی ندارید.' });
    }

    res.json(customExercise);
} catch (err) {
    console.error(err);
    res.status(500).json({ message: 'خطا در دریافت حرکت' });
}
});

// Catch-all
app.all('*', (req, res) => {
res.status(404).json({ message: 'مسیر یافت نشد.' });
});

// Error handler
app.use((err, req, res, next) => {
console.error(err.stack);
res.status(500).json({ message: 'یک خطا رخ داده است.' });
});

// Start server
app.listen(PORT, () => {
console.log(`✅ سرور در حال اجرا است روی پورت http://localhost:${PORT}`);
});