// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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