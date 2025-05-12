export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log("📝 Incoming messages:", messages);

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not set');
    }

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Utilisez un modèle valide
        messages: [
          {
            role: 'system',
            content: "You are a helpful educational assistant. Provide concise, professional answers."
          },
          ...messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content
          }))
        ],
        stream: true
      })
    });

    if (!openaiRes.ok) {
      const text = await openaiRes.text();
      console.error("🔴 OpenAI error response:", text);
      throw new Error(`OpenAI API error: ${openaiRes.status}`);
    }

    // Créer un transformateur de stream pour parser les événements SSE
    const stream = new TransformStream({
      async transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk);
        // Parser les lignes SSE
        const lines = text.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.replace('data: ', '');
            if (data === '[DONE]') {
              controller.terminate();
              return;
            }
            
            try {
              const json = JSON.parse(data);
              if (json.choices?.[0]?.delta?.content) {
                controller.enqueue(
                  new TextEncoder().encode(json.choices[0].delta.content)
                );
              }
            } catch (err) {
              console.error("Error parsing SSE data:", err);
            }
          }
        }
      }
    });

    return new Response(openaiRes.body?.pipeThrough(stream), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      }
    });

  } catch (err: any) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}