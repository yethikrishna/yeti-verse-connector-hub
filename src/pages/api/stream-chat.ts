import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSentEventStream } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

export const config = {
  api: {
    bodyParser: true,
    responseLimit: '8mb',
  },
};

interface StreamChatRequest {
  provider: string;
  model: string;
  messages: Array<{ role: string; content: string }>;
  max_tokens?: number;
  temperature?: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { provider, model, messages, max_tokens = 2000, temperature = 0.7 }: StreamChatRequest = req.body;

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');

    // Create SSE stream
    const stream = createServerSentEventStream(res);

    // Call appropriate AI provider based on selection
    switch (provider) {
      case 'openai':
        await handleOpenAIStream(stream, model, messages, max_tokens, temperature);
        break;
      case 'openrouter':
        await handleOpenRouterStream(stream, model, messages, max_tokens, temperature);
        break;
      case 'gemini':
        await handleGeminiStream(stream, model, messages, max_tokens, temperature);
        break;
      default:
        stream.write({ data: JSON.stringify({ error: 'Unsupported provider' }) });
        break;
    }

    // Close the stream
    stream.close();
    res.end();
  } catch (error) {
    console.error('Stream error:', error);
    res.status(500).json({ error: 'Failed to process stream' });
  }
}

async function handleOpenAIStream(stream: any, model: string, messages: any[], max_tokens: number, temperature: number) {
  const { data: openaiKey } = await supabase
    .from('secrets')
    .select('value')
    .eq('name', 'OPENAI_API_KEY')
    .single();

  if (!openaiKey) throw new Error('OpenAI API key not found');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openaiKey.value}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens,
      temperature,
      stream: true,
    }),
  });

  if (!response.body) throw new Error('No response body');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter(line => line.trim() !== '');

    for (const line of lines) {
      const data = line.replace(/^data: /, '');
      if (data === '[DONE]') break;

      try {
        const json = JSON.parse(data);
        const content = json.choices[0]?.delta?.content || '';
        if (content) {
          stream.write({ data: JSON.stringify({ content }) });
        }
      } catch (e) {
        console.error('Error parsing SSE:', e);
      }
    }
  }
}

// Implement similar handlers for other providers (OpenRouter, Gemini, etc.)
async function handleOpenRouterStream(stream: any, model: string, messages: any[], max_tokens: number, temperature: number) {
  // Implementation for OpenRouter streaming
  const { data: openrouterKey } = await supabase
    .from('secrets')
    .select('value')
    .eq('name', 'OPENROUTER_API_KEY')
    .single();

  if (!openrouterKey) throw new Error('OpenRouter API key not found');

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openrouterKey.value}`,
      'HTTP-Referer': `${process.env.NEXT_PUBLIC_APP_URL}`,
      'X-Title': 'Yeti AI Connector Hub',
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens,
      temperature,
      stream: true,
    }),
  });

  if (!response.body) throw new Error('No response body');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter(line => line.trim() !== '');

    for (const line of lines) {
      const data = line.replace(/^data: /, '');
      if (data === '[DONE]') break;

      try {
        const json = JSON.parse(data);
        const content = json.choices[0]?.delta?.content || '';
        if (content) {
          stream.write({ data: JSON.stringify({ content }) });
        }
      } catch (e) {
        console.error('Error parsing OpenRouter SSE:', e);
      }
    }
  }
}

async function handleGeminiStream(stream: any, model: string, messages: any[], max_tokens: number, temperature: number) {
  // Implementation for Gemini streaming
  const { data: geminiKey } = await supabase
    .from('secrets')
    .select('value')
    .eq('name', 'GEMINI_API_KEY')
    .single();

  if (!geminiKey) throw new Error('Gemini API key not found');

  // Convert messages to Gemini format
  const geminiMessages = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${geminiKey.value}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: geminiMessages,
      generationConfig: {
        maxOutputTokens: max_tokens,
        temperature,
      },
      stream: true,
    }),
  });

  if (!response.body) throw new Error('No response body');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter(line => line.trim() !== '');

    for (const line of lines) {
      try {
        const json = JSON.parse(line);
        const content = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (content) {
          stream.write({ data: JSON.stringify({ content }) });
        }
      } catch (e) {
        console.error('Error parsing Gemini SSE:', e);
      }
    }
  }
}