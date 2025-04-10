// Description: This module provides services for correcting test answers and generating PDF reports.
// It includes functions to read answer keys from an Excel file, correct user answers, and generate a PDF report with charts and recommendations.

import xlsx from 'xlsx';
import path from 'path';
import { chromium } from 'playwright-chromium';
import {
    UserAnswer,
    CorrectionResult,
    PdfData
} from '../types/testPrepTypes';

export const correctAnswersService = async (userAnswers: UserAnswer[]): Promise<CorrectionResult> => {
    try {
        const ANSWER_KEY_PATH = path.join(__dirname, '../data/answers.xlsx');
        const workbook = xlsx.readFile(ANSWER_KEY_PATH);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        
        const answerKey = xlsx.utils.sheet_to_json<{
            'Question Number': number;
            'Key': string;
            'Domain'?: string;
        }>(sheet);

        const correctedAnswers = userAnswers.map(userAnswer => {
            const correctRow = answerKey.find(row => 
                row['Question Number'] === userAnswer.questionId
            );

            if (!correctRow) {
                throw new Error(`Correct answer not found for question ${userAnswer.questionId}`);
            }

            return {
                ...userAnswer,
                correctAnswer: correctRow['Key'],
                isCorrect: userAnswer.selectedOption === correctRow['Key'],
                pointsEarned: userAnswer.selectedOption === correctRow['Key'] ? 1 : 0,
                domain: correctRow['Domain'] || undefined
            };
        });

        const score = correctedAnswers.reduce((sum, answer) => sum + answer.pointsEarned, 0);
        const totalPossible = correctedAnswers.length;
        const percentage = Math.round((score / totalPossible) * 100);
        
        return {
            correctedAnswers,
            score,
            totalPossible,
            percentage
        };
    } catch (error) {
        console.error('Detailed error:', error);
        throw new Error(`Processing failed: ${error instanceof Error ? error.message : String(error)}`);
    }
};

export const generatePdfService = async (data: PdfData): Promise<Buffer> => {
    let browser;
    try {
        browser = await chromium.launch();
        const page = await browser.newPage();
        
        const html = await generatePdfHtml(data);
        await page.setContent(html);
        
        return await page.pdf({
            format: 'A4',
            margin: {
                top: '0.5in',
                right: '0.5in',
                bottom: '0.5in',
                left: '0.5in'
            }
        });
    } catch (error) {
        console.error('PDF generation failed:', error);
        throw new Error('Failed to generate PDF');
    } finally {
        if (browser) await browser.close();
    }
};

async function generatePdfHtml(data: PdfData): Promise<string> {
    const { answers, testDetails } = data;
    const score = answers.filter(a => a.isCorrect).length;
    const totalQuestions = answers.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    // Calculate performance by domain
    const domainPerformance: Record<string, { correct: number; total: number }> = {};
    answers.forEach(answer => {
        const domain = answer.domain || 'General';
        if (!domainPerformance[domain]) {
            domainPerformance[domain] = { correct: 0, total: 0 };
        }
        domainPerformance[domain].total++;
        if (answer.isCorrect) {
            domainPerformance[domain].correct++;
        }
    });

    // Prepare data for charts
    const domainChartData = Object.entries(domainPerformance).map(([domain, stats]) => ({
        domain: domain.replace(/\((\d+)\.(\w+)\)/, '$2'), // Shorten domain names
        fullDomain: domain,
        percentage: Math.round((stats.correct / stats.total) * 100),
        correct: stats.correct,
        total: stats.total
    }));

    // Generate chart images
    const barChartImage = await generateChartImage('bar', {
        labels: domainChartData.map(d => d.domain),
        datasets: [{
            label: 'Correct Answers (%)',
            data: domainChartData.map(d => d.percentage),
            backgroundColor: getGradeColor(testDetails.grade)
        }]
    });

    const pieChartImage = await generateChartImage('pie', {
        labels: ['Correct', 'Incorrect'],
        datasets: [{
            data: [score, totalQuestions - score],
            backgroundColor: ['#2ecc71', '#e74c3c']
        }]
    });

    // Identify weak areas (domains with < 60% correct)
    const weakAreas = domainChartData.filter(d => d.percentage < 60);
    
    // Generate recommendations
    const recommendations = weakAreas.length > 0 
        ? weakAreas.map(area => ({
            domain: area.fullDomain,
            score: `${area.correct}/${area.total}`,
            percentage: area.percentage,
            tips: getStudyTipsForDomain(area.fullDomain, testDetails.grade)
        }))
        : [{
            domain: 'All Domains',
            score: `${score}/${totalQuestions}`,
            percentage: percentage,
            tips: [
                "Great job! Your performance is strong across all domains.",
                "Challenge yourself with more advanced problems.",
                "Focus on maintaining your high performance under timed conditions."
            ]
        }];

    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { color: #2c3e50; margin-bottom: 5px; }
            .header h2 { color: #3498db; margin-top: 0; }
            
            .section { margin-bottom: 30px; }
            .section-title { 
                border-bottom: 2px solid #3498db; 
                padding-bottom: 5px; 
                color: #2c3e50;
                margin-bottom: 15px;
            }
            
            .summary-card {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 20px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .summary-stats {
                display: flex;
                justify-content: space-around;
                text-align: center;
                margin: 20px 0;
            }
            
            .stat-item {
                padding: 15px;
            }
            
            .stat-value {
                font-size: 24px;
                font-weight: bold;
                color: #3498db;
            }
            
            .stat-label {
                font-size: 14px;
                color: #7f8c8d;
            }
            
            .chart-container {
                display: flex;
                justify-content: space-between;
                margin: 30px 0;
            }
            
            .chart {
                width: 48%;
                height: 300px;
                background: #f8f9fa;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .chart-title {
                text-align: center;
                margin-bottom: 10px;
                font-weight: bold;
                color: #2c3e50;
            }
            
            .chart-img {
                width: 100%;
                height: 250px;
                object-fit: contain;
            }
            
            .recommendations {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .recommendation-item {
                margin-bottom: 15px;
                padding-bottom: 15px;
                border-bottom: 1px solid #eee;
            }
            
            .recommendation-item:last-child {
                border-bottom: none;
                margin-bottom: 0;
                padding-bottom: 0;
            }
            
            .domain-name {
                font-weight: bold;
                color: #2c3e50;
                margin-bottom: 5px;
            }
            
            .domain-stats {
                font-size: 14px;
                color: #7f8c8d;
                margin-bottom: 10px;
            }
            
            .tips-list {
                padding-left: 20px;
            }
            
            .tips-list li {
                margin-bottom: 8px;
            }
            
            table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-top: 20px;
                font-size: 14px;
            }
            
            th, td { 
                border: 1px solid #ddd; 
                padding: 10px; 
                text-align: left; 
            }
            
            th { 
                background-color: #3498db; 
                color: white; 
            }
            
            tr:nth-child(even) { 
                background-color: #f2f2f2; 
            }
            
            .correct { 
                background-color: #e6ffe6; 
            }
            
            .incorrect { 
                background-color: #ffe6e6; 
            }
            
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #7f8c8d;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Test Results Report</h1>
            <h2>${testDetails.subject} - Grade ${testDetails.grade}</h2>
            <p>Date: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="section">
            <h3 class="section-title">Performance Summary</h3>
            
            <div class="summary-card">
                <div class="summary-stats">
                    <div class="stat-item">
                        <div class="stat-value">${score}/${totalQuestions}</div>
                        <div class="stat-label">Questions Correct</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${percentage}%</div>
                        <div class="stat-label">Overall Score</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${testDetails.grade}</div>
                        <div class="stat-label">Grade Level</div>
                    </div>
                </div>
                
               <div class="chart-container">
                    <div class="chart">
                        <div class="chart-title">Performance by Domain</div>
                        <img src="${barChartImage}" class="chart-img" alt="Domain Performance Chart"
                            style="width: 100%; height: 300px; object-fit: contain; display: block; margin: 0 auto;">
                    </div>
                    
                    <div class="chart">
                        <div class="chart-title">Overall Performance</div>
                        <img src="${pieChartImage}" class="chart-img" alt="Overall Performance Chart"
                            style="width: 100%; height: 300px; object-fit: contain; display: block; margin: 0 auto;">
                    </div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h3 class="section-title">Improvement Recommendations</h3>
            <div class="recommendations">
                ${recommendations.map(rec => `
                    <div class="recommendation-item">
                        <div class="domain-name">${rec.domain}</div>
                        <div class="domain-stats">Score: ${rec.score} (${rec.percentage}%)</div>
                        <div>Recommendations:</div>
                        <ul class="tips-list">
                            ${rec.tips.map(tip => `<li>${tip}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="section">
            <h3 class="section-title">Detailed Question Results</h3>
            <table>
                <thead>
                    <tr>
                        <th>Question #</th>
                        <th>Domain</th>
                        <th>Your Answer</th>
                        <th>Correct Answer</th>
                        <th>Result</th>
                    </tr>
                </thead>
                <tbody>
                    ${answers.map((a, i) => `
                        <tr class="${a.isCorrect ? 'correct' : 'incorrect'}">
                            <td>${i + 1}</td>
                            <td>${a.domain || 'General'}</td>
                            <td>${a.selectedOption || '-'}</td>
                            <td>${a.correctAnswer}</td>
                            <td>${a.isCorrect ? '✓ Correct' : '✗ Incorrect'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="footer">
            <p>Generated by Dreametrix Test Prep System</p>
        </div>
    </body>
    </html>`;
}

async function generateChartImage(type: 'bar' | 'pie', data: any): Promise<string> {
    const browser = await chromium.launch();
    try {
        const page = await browser.newPage();
        
        // Increase timeout and set viewport size
        await page.setViewportSize({ width: 800, height: 600 });
        
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                <style>
                    body { 
                        margin: 0;
                        padding: 20px;
                        width: 100%;
                        height: 100%;
                    }
                    #chart-container {
                        width: 100%;
                        height: 100%;
                    }
                </style>
            </head>
            <body>
                <div id="chart-container">
                    <canvas id="chart"></canvas>
                </div>
                <script>
                    // Ensure DOM is fully loaded
                    document.addEventListener('DOMContentLoaded', function() {
                        const ctx = document.getElementById('chart').getContext('2d');
                        const chart = new Chart(ctx, {
                            type: '${type}',
                            data: ${JSON.stringify(data)},
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                animation: {
                                    duration: 0 // Disable animations for faster rendering
                                },
                                plugins: {
                                    legend: {
                                        position: 'bottom'
                                    },
                                    title: {
                                        display: true,
                                        text: '${type === 'bar' ? 'Performance by Domain' : 'Overall Performance'}',
                                        font: {
                                            size: 16
                                        }
                                    }
                                }
                            }
                        });
                    });
                </script>
            </body>
            </html>
        `;

        await page.setContent(htmlContent, {
            waitUntil: 'networkidle' // Wait for resources to load
        });

        // Wait for chart to render
        await page.waitForFunction(() => {
            const canvas = document.querySelector('canvas');
            return canvas && canvas.width > 0 && canvas.height > 0;
        }, { timeout: 5000 });

        const chartElement = await page.$('canvas');
        if (!chartElement) {
            throw new Error('Chart canvas not found');
        }

        // Capture screenshot
        const buffer = await chartElement.screenshot({
            type: 'png',
            omitBackground: true
        });

        return `data:image/png;base64,${buffer.toString('base64')}`;
    } catch (error) {
        console.error('Error generating chart image:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

function getStudyTipsForDomain(domain: string, grade: string): string[] {
    // Map domain codes to full names
    const domainNames: Record<string, string> = {
        'EE': 'Expressions and Equations',
        'NS': 'The Number System',
        'G': 'Geometry',
        'RP': 'Ratios and Proportional Relationships',
        'OA': 'Operations and Algebraic Thinking',
        'NF': 'Number and Operations-Fractions',
        'MD': 'Measurement and Data',
        'NBT': 'Number and Operations in Base Ten',
        'SP': 'Statistics and Probability',
        'F': 'Functions'
    };

    // Extract domain code
    const domainCode = domain.match(/\((\d+)\.?(\w+)\)/)?.[2] || '';
    const domainName = domainNames[domainCode] || domain;

    // Grade-specific tips
    const gradeTips: Record<string, string[]> = {
        '3': [
            `Practice basic concepts in ${domainName}.`,
            `Use visual aids to understand ${domainName} problems.`,
            `Focus on mastering one ${domainName} concept at a time.`
        ],
        '4': [
            `Build deeper understanding of ${domainName}.`,
            `Practice multi-step ${domainName} problems.`,
            `Double-check your ${domainName} calculations.`
        ],
        '5': [
            `Master advanced ${domainName} concepts.`,
            `Work on complex ${domainName} problem-solving.`,
            `Identify common ${domainName} mistakes.`
        ],
        '6': [
            `Develop conceptual understanding in ${domainName}.`,
            `Practice ${domainName} modeling.`,
            `Apply ${domainName} to real-world situations.`
        ],
        '7': [
            `Focus on abstract thinking in ${domainName}.`,
            `Solve real-world ${domainName} problems.`,
            `Develop multiple ${domainName} solution strategies.`
        ],
        '8': [
            `Prepare for high school level ${domainName}.`,
            `Work on advanced ${domainName} techniques.`,
            `Connect ${domainName} to other math concepts.`
        ]
    };

    // General tips
    const generalTips = [
        `Review incorrect ${domainName} answers to identify patterns.`,
        `Practice timed ${domainName} exercises to improve speed.`,
        `Ask for help with challenging ${domainName} concepts.`,
        `Create a ${domainName} study plan focusing on weak areas.`
    ];

    return [...(gradeTips[grade] || gradeTips['6']), ...generalTips];
}

function getGradeColor(grade: string): string {
    const gradeColors: Record<string, string> = {
        '3': '#FF6384', '4': '#36A2EB', '5': '#FFCE56', 
        '6': '#4BC0C0', '7': '#9966FF', '8': '#FF9F40'
    };
    return gradeColors[grade] || '#3498db';
}