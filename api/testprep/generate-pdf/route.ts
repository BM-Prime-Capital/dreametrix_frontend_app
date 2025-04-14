// app/api/testprep/generate-pdf/route.ts
import { NextResponse } from 'next/server';
import { generatePdfService } from '../../services/testPrep';

export const dynamic = 'force-dynamic'; // Prevents caching

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data || !data.answers || !data.testDetails) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    // Generate the PDF
    const pdfBuffer = await generatePdfService(data);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=test_results.pdf',
        'Cache-Control': 'no-store'
      }
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
