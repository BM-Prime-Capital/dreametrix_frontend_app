import { Request, Response } from 'express';
import { correctAnswersService, generatePdfService } from '../services/testPrep';



// api/controllers/testPrep.ts
export const correctAnswers = async (req: Request, res: Response) => {
    try {
      console.log('Received body:', req.body); // Debug log
      
      // Accept either direct array or {answers: array} format
      const answersArray = Array.isArray(req.body) 
        ? req.body 
        : req.body?.answers;
  
      if (!answersArray || !Array.isArray(answersArray)) {
        return res.status(400).json({ 
          error: 'Payload must be an array of answers or {answers: array}',
          received: req.body
        });
      }
  
      const result = await correctAnswersService(answersArray);
      res.json(result);
    } catch (error) {
      console.error('Error in correctAnswers:', error);
      res.status(500).json({ 
        error: 'Error processing answers',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  };

export const generatePdf = async (req: Request, res: Response) => {
    try {
      console.log('PDF generation request received:', req.body); // Debug log
      
      if (!req.body || !req.body.answers || !req.body.testDetails) {
        return res.status(400).json({ error: 'Missing required PDF data' });
      }
  
      const pdfBuffer = await generatePdfService(req.body);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=test_results.pdf');
      res.send(pdfBuffer);
      
    } catch (error) {
      console.error('Error in generatePdf:', error);
      res.status(500).json({ 
        error: 'PDF generation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };