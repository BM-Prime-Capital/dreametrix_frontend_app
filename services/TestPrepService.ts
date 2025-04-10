import { generalImages } from '@/constants/images';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; 

// Extend jsPDF with autoTable plugin

interface AutoTableOptions {
  startY?: number;
  margin?: Margin;
  tableWidth?: 'wrap' | 'auto' | number;
  showHead?: 'everyPage' | 'firstPage' | 'never';
  showFoot?: 'everyPage' | 'lastPage' | 'never';
  tableLineWidth?: number;
  tableLineColor?: Color;
  head?: CellInput[][];
  body?: CellInput[][];
  foot?: CellInput[][];
  html?: string | HTMLElement;
  columns?: ColumnInput[];
  includeHiddenHtml?: boolean;
  useCss?: boolean;
  styles?: Styles;
  bodyStyles?: Styles;
  headStyles?: Styles;
  footStyles?: Styles;
  alternateRowStyles?: Styles;
  columnStyles?: { [key: string]: Styles };
  createdCell?: (cell: Cell, data: HookData) => void;
  drawCell?: (cell: Cell, data: HookData) => void;
  didDrawCell?: (cell: Cell, data: HookData) => void;
  didParseCell?: (cell: Cell, data: HookData) => void;
  willDrawCell?: (cell: Cell, data: HookData) => void;
  didDrawPage?: (data: HookPageData) => void;
  didDrawTable?: (data: HookData) => void;
}

interface Margin {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

type Color = number[] | string;

interface Styles {
  font?: 'helvetica' | 'times' | 'courier' | string;
  fontStyle?: 'normal' | 'bold' | 'italic' | 'bolditalic' | string;
  overflow?: 'linebreak' | 'ellipsize' | 'visible' | 'hidden';
  fillColor?: Color;
  textColor?: Color;
  halign?: 'left' | 'center' | 'right' | 'justify';
  valign?: 'top' | 'middle' | 'bottom';
  fontSize?: number;
  cellPadding?: number;
  lineColor?: Color;
  lineWidth?: number;
  minCellHeight?: number;
  cellWidth?: 'wrap' | 'auto' | number;
}

type CellInput = string | number | { content: string | number; styles?: Styles };

interface ColumnInput {
  title?: string;
  dataKey?: string;
}

interface Cell {
  raw: string | number;
  content: string | number;
  styles: Styles;
}

interface HookData {
  table: {
    pageCount: number;
  };
  pageNumber: number;
  settings: any;
  doc: jsPDF;
  section?: 'head' | 'body' | 'foot'; // Added 'section' property
}

interface HookPageData {
  pageNumber: number;
  settings: any;
  doc: jsPDF;
}

interface Answer {
  questionId: number;
  selectedOption: string;
}


interface TestDetails {
  subject: string;
  grade: string;
  domain: string;
  date: string;
  totalQuestions: number;
  correctCount: number;
  totalScore: number;
  maxPossibleScore: number;
  percentage: number;
}

interface Question {
  id: number;
  correctAnswer: string;
  pointValue: number;
  questionNumber: number;
}

// Mettez à jour l'interface Answer pour correspondre à celle de TestQuestion.tsx
interface Answer {
  questionId: number;
  selectedOption: string;
  // Ajoutez questionNumber si nécessaire dans le service
}

// Interface Question doit correspondre
interface Question {
  id: number;
  correctAnswer: string;
  pointValue: number;
  questionNumber: number; // Ce champ est essentiel
}

// CorrectedAnswer doit inclure questionNumber
interface CorrectedAnswer {
  questionId: number;
  questionNumber: number; // Ajouté ici
  selectedOption: string;
  correctAnswer: string;
  isCorrect: boolean;
  pointsEarned: number;
  pointValue: number;
}

export async function submitTestAnswers(
  answers: Answer[],
  questions: Question[]
): Promise<{
  correctedAnswers: CorrectedAnswer[];
  score: number;
  totalPossible: number;
  percentage: number;
}> {
  console.log("=== SERVICE: DONNÉES REÇUES ===");
  console.log("Questions reçues:", questions);
  console.log("Réponses reçues:", answers);

  await new Promise(resolve => setTimeout(resolve, 1000));

  const correctedAnswers: CorrectedAnswer[] = answers.map(answer => {
    const question = questions.find(q => q.id === answer.questionId)!;
    const isCorrect = answer.selectedOption === question.correctAnswer;
    const pointsEarned = isCorrect ? question.pointValue : 0;

    console.log(`Traitement Q${question.questionNumber}:`, {
      réponse: answer.selectedOption,
      correcte: question.correctAnswer,
      isCorrect,
      points: pointsEarned
    });

    return {
      questionId: answer.questionId,
      questionNumber: question.questionNumber,
      selectedOption: answer.selectedOption,
      correctAnswer: question.correctAnswer,
      isCorrect,
      pointsEarned,
      pointValue: question.pointValue
    };
  });

  const score = correctedAnswers.reduce((sum, answer) => sum + answer.pointsEarned, 0);
  const totalPossible = correctedAnswers.reduce((sum, answer) => sum + answer.pointValue, 0);
  const percentage = Math.round((score / totalPossible) * 100);

  return {
    correctedAnswers,
    score,
    totalPossible,
    percentage
  };
}

// Fonction pour générer le rapport de test

export function generateTestReport(
  correctedAnswers: CorrectedAnswer[],
  testDetails: TestDetails
): Blob {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Margin settings
  const margin = {
    top: 40,
    bottom: 30,
    left: 20,
    right: 20
  };

  // Ajouter le logo
  const logo = generalImages.dreaMetrixLogo; // Chemin depuis image.ts
  const logoWidth = 20;
  const logoHeight = 20;
  
  const contentWidth = pageWidth - margin.left - margin.right;
  let yPosition = margin.top;

  // Colors
  const primaryColor = [41, 128, 185];
  const successColor = [39, 174, 96];
  const dangerColor = [231, 76, 60];
  const lightGrey = [241, 242, 246];

  // Header modifié avec logo
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 40, 'F'); // Augmenter la hauteur à 40

  // Positionnement centré verticalement dans le header
  const headerHeight = 40;
  const logoY = (headerHeight - logoHeight) / 2; // Centre vertical

  // Ajouter le logo
  doc.addImage({
    imageData: logo,
    format: 'PNG',
    x: margin.left,
    y: logoY,
    width: logoWidth,
    height: logoHeight,
    // Removed invalid property 'preserveAspectRatio'
  });


  // Ajuster le titre
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('Test Performance Report', margin.left + logoWidth + 10, 15); // Décaler le texte


  // Test Information - Version alignée
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('Test Details:', margin.left, yPosition);

  const testInfo = [
    `Subject: ${testDetails.subject}`,
    `Grade: ${testDetails.grade}`,
    `Domain: ${testDetails.domain}`,
    `Date: ${testDetails.date}`,
    `Duration: 45 minutes`
  ];

  // Utilisation de la même marge gauche pour toutes les lignes
  testInfo.forEach((info, i) => {
    doc.setFont('helvetica', 'normal');
    doc.text(info, margin.left, yPosition + 7 + (i * 5)); // Retrait du "+5"
  });

  yPosition += 7 + (testInfo.length * 5) + 10; // Calcul précis de l'espacement

  // Progress Circle (with position check)
  if (yPosition + 100 > pageHeight - margin.bottom) {
    doc.addPage();
    yPosition = margin.top;
  }

  const centerX = pageWidth / 2;
  const radius = 25;
  const percentage = testDetails.percentage;
  
  // Progress circle background
  doc.setDrawColor(lightGrey[0], lightGrey[1], lightGrey[2]);
  doc.setFillColor(lightGrey[0], lightGrey[1], lightGrey[2]);
  doc.circle(centerX, yPosition + 20, radius, 'FD');
  
  // Progress arc
  const endAngle = (percentage / 100) * 360;
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.ellipse(centerX, yPosition + 20, radius, radius, 'FD');
  
  // Inner circle
  doc.setDrawColor(255, 255, 255);
  doc.setFillColor(255, 255, 255);
  doc.circle(centerX, yPosition + 20, radius * 0.6, 'FD');
  
  // Percentage text
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text(`${percentage}%`, centerX, yPosition + 24, { align: 'center' });
  doc.setFontSize(8);
  doc.text('Overall Score', centerX, yPosition + 30, { align: 'center' });
  yPosition += 60;

  // Key Statistics
  const stats = [
    { label: 'Total Questions', value: testDetails.totalQuestions },
    { label: 'Correct Answers', value: testDetails.correctCount },
    { label: 'Incorrect Answers', value: testDetails.totalQuestions - testDetails.correctCount },
    { label: 'Total Score', value: `${testDetails.totalScore}/${testDetails.maxPossibleScore}` }
  ];

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Performance Summary', margin.left, yPosition);
  yPosition += 10;

  stats.forEach((stat, index) => {
    const x = margin.left + (index % 2) * (contentWidth / 2);
    const y = yPosition + Math.floor(index / 2) * 15;
    
    doc.setFillColor(lightGrey[0], lightGrey[1], lightGrey[2]);
    doc.rect(x, y - 4, contentWidth / 2 - 5, 12, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${stat.label}:`, x + 3, y + 3);
    
    doc.setFont('helvetica', 'normal');
    doc.text(stat.value.toString(), x + (contentWidth / 2) - 15, y + 3, { align: 'right' });
  });
  yPosition += 40;

  // Performance Analysis
  // doc.setFontSize(12);
  // doc.setFont('helvetica', 'bold');
  // doc.text('Skill Analysis', margin.left, yPosition);
  // yPosition += 7;

  // doc.setFont('helvetica', 'normal');
  // doc.setFontSize(10);
  // const analysisText = [
  //   `Domain Assessed: ${testDetails.domain}`,
  //   percentage >= 80 ? "Excellent mastery! Maintain your knowledge with advanced practice."
  //   : percentage >= 50 ? "Good foundation! Focus on the following areas:"
  //   : "Needs improvement. Recommended actions:"
  // ];

  // analysisText.forEach((text, i) => {
  //   doc.text(text, margin.left, yPosition + (i * 5));
  // });
  // yPosition += 25;

  // const analysisText = [
  //   `Domain Assessed: ${testDetails.domain}`,
  //   ...(percentage >= 80
  //     ? [
  //         "Excellent mastery! Maintain your knowledge with advanced practice.",
  //         "- Excellent work! Strengthen your skills with advanced exercises.",
  //         `- You have strong mastery in the domain of ${testDetails.domain}.`
  //       ]
  //     : percentage >= 50
  //     ? [
  //         "Good foundation! Focus on the following areas:",
  //         `- Good start! Focus on the following areas in ${testDetails.domain}:`,
  //         "- Review the incorrect questions listed below",
  //         "- Practice similar types of exercises"
  //       ]
  //     : [
  //         "Needs improvement. Recommended actions:",
  //         `- Improvement needed in ${testDetails.domain}. Recommendations:`,
  //         "- Review the theoretical basics",
  //         "- Retake the test after revision",
  //         "- Ask your teacher for help"
  //       ])
  // ];
  
  // // Ensuite tu les affiches :
  // analysisText.forEach((text, i) => {
  //   doc.text(text, margin.left, yPosition + (i * 10));
  // });
  
  // yPosition += analysisText.length * 10 + 5; // Ajuste selon l'espacement voulu
  
  // Performance Analysis - Version corrigée
doc.setFontSize(12);
doc.setFont('helvetica', 'bold');
doc.text('Skill Analysis', margin.left, yPosition);
yPosition += 7;

doc.setFont('helvetica', 'normal');
doc.setFontSize(10);

// Ligne de base
doc.text(`Domain Assessed: ${testDetails.domain}`, margin.left, yPosition);
yPosition += 7;

// Recommendations conditionnelles
if (percentage >= 80) {
  doc.text("Excellent mastery! Next steps:", margin.left, yPosition);
  yPosition += 7;
  doc.text("- Practice advanced application problems", margin.left + 5, yPosition);
  yPosition += 7;
  doc.text("- Teach concepts to peers", margin.left + 5, yPosition);
  yPosition += 7;
  doc.text("- Explore real-world use cases", margin.left + 5, yPosition);
} 
else if (percentage >= 50) {
  doc.text("Good foundation! Focus areas:", margin.left, yPosition);
  yPosition += 7;
  doc.text("- Review incorrect answers below", margin.left + 5, yPosition);
  yPosition += 7;
  doc.text("- Practice similar question types", margin.left + 5, yPosition);
  yPosition += 7;
  doc.text("- Master core concepts", margin.left + 5, yPosition);
} 
else {
  doc.text("Needs improvement. Action plan:", margin.left, yPosition);
  yPosition += 7;
  doc.text("- Review foundational concepts", margin.left + 5, yPosition);
  yPosition += 7;
  doc.text("- Practice with visual aids", margin.left + 5, yPosition);
  yPosition += 7;
  doc.text("- Retake test after review", margin.left + 5, yPosition);
  yPosition += 7;
  doc.text("- Seek teacher guidance", margin.left + 5, yPosition);
}

yPosition += 15; // Espacement final

  // Detailed Results Table
  if (yPosition + 100 > pageHeight - margin.bottom) {
    doc.addPage();
    yPosition = margin.top;
  }

  autoTable(doc, {
    startY: yPosition,
    head: [['Question', 'Your Answer', 'Correct Answer', 'Points', 'Result']],
    body: correctedAnswers.map(answer => [
      `#${answer.questionNumber}`,
      answer.selectedOption,
      answer.correctAnswer,
      `${answer.pointsEarned}/${answer.pointValue}`,
      answer.isCorrect ? 'Correct' : 'Incorrect'
    ]),
    // theme: 'grid', // Removed as it is not a valid property
    styles: {
      fontSize: 9,
      cellPadding: 2,
      halign: 'center',
      fillColor: primaryColor,
      textColor: 255,
      fontStyle: 'bold'
    },

    didParseCell: (data) => {
      if (data.section === 'head') {
        data.cell.styles.fillColor = primaryColor;
        data.cell.styles.textColor = 255;
        data.cell.styles.fontStyle = 'bold';
      }
      if (data.row.index % 2 === 0 && data.section === 'body') {
        data.cell.styles.fillColor = lightGrey;
      }
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 40 },
      2: { cellWidth: 40 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 }
    },
    // Remove the invalid property and handle the logic after autoTable is called
  });

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${totalPages}`, 
      pageWidth - margin.right, 
      pageHeight - 10, 
      { align: 'right' }
    );
    doc.text('Generated by Question Simplar', 
      margin.left, 
      pageHeight - 10
    );
  }

  return new Blob([doc.output('blob')], { type: 'application/pdf' });
}

// Fonction helper pour les conseils par question
function getAdviceForQuestion(questionNumber: number, domain: string): string {
  // Cette fonction pourrait être enrichie avec une base de connaissances
  const domainAdvice: Record<string, string> = {
    '(3.NF) Number And Operations-Fractions': 'Revoyez la représentation des fractions et les opérations de base. Pratiquez avec des exercices visuels.',
    // Ajoutez d'autres domaines et conseils ici
  };

  return domainAdvice[domain] || 'Revoyez la théorie correspondante et pratiquez des exercices similaires.';
}