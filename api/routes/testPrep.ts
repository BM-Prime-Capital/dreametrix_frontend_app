import { Router } from 'express';
import { correctAnswers, generatePdf } from '../controllers/testPrep';


const router = Router();

router.post('/correct', correctAnswers);
router.post('/generate-pdf', generatePdf);

export default router;