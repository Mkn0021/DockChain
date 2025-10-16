import { Router } from 'express';
import authRoutes from '@routes/auth.route';
import templateRoutes from '@routes/template.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/templates', templateRoutes);

export default router;