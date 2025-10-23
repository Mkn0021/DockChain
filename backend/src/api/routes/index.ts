import { Router } from 'express';
import authRoutes from '@routes/auth.route';
import templateRoutes from '@routes/template.route';
import documentRoutes from '@routes/document.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/templates', templateRoutes);
router.use('/documents', documentRoutes);

export default router;