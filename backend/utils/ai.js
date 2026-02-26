const fetch = global.fetch || require('node-fetch');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn('Warning: OPENAI_API_KEY not set. AI features will fail until set.');
}

async function callOpenAI(messages, max_tokens = 400) {
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens,
      temperature: 0.2,
    }),
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`OpenAI error: ${resp.status} ${txt}`);
  }

  const data = await resp.json();
  const msg = data.choices && data.choices[0] && data.choices[0].message;
  return msg ? msg.content : '';
}

function extractJSON(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    const jsonText = text.substring(start, end + 1);
    try {
      return JSON.parse(jsonText);
    } catch (_) {
      // fall through
    }
  }
  // fallback: attempt to parse full text
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
}

async function classifyText(text) {
  if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not set');
  const messages = [
    { role: 'system', content: 'You are a helpful assistant that classifies documents into a single concise category and lists relevant tags. Return output as JSON.' },
    { role: 'user', content: `Classify the following document. Respond only with a JSON object containing keys: "label" (string), "confidence" (number between 0 and 1), "tags" (array of strings). Document:\n\n${text}` },
  ];

  const out = await callOpenAI(messages, 100);
  const parsed = extractJSON(out);
  if (parsed && parsed.label) return parsed;
  // fallback: return minimal
  return { label: 'uncategorized', confidence: 0, tags: [] };
}

async function summarizeText(text) {
  if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not set');
  const messages = [
    { role: 'system', content: 'You are a concise summarization assistant. Produce a brief summary and a list of 3 key bullet points. Return output as JSON.' },
    { role: 'user', content: `Summarize the following document in one short paragraph (<=150 words) and provide an array "keyPoints" with 3 short items. Return only JSON with keys: "summary", "keyPoints". Document:\n\n${text}` },
  ];

  const out = await callOpenAI(messages, 200);
  const parsed = extractJSON(out);
  if (parsed && parsed.summary) return parsed;
  return { summary: '', keyPoints: [] };
}

module.exports = { classifyText, summarizeText };
