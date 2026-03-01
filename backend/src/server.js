import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import passRoutes from './routes/passRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { User } from './models/User.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/passes', passRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, _, res, __) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const port = process.env.PORT || 4000;

const bootstrap = async () => {
  await connectDB();

  if (process.env.SEED_SUPER_ADMIN === 'true') {
    const existing = await User.findOne({ phone: process.env.SUPER_ADMIN_PHONE });
    if (!existing) {
      await User.create({
        name: process.env.SUPER_ADMIN_NAME || 'Agamweer',
        email: process.env.SUPER_ADMIN_EMAIL,
        phone: process.env.SUPER_ADMIN_PHONE,
        role: 'super_admin'
      });
      console.log('Super admin seeded');
    }
  }

  app.listen(port, () => console.log(`API running on ${port}`));
};

bootstrap();
