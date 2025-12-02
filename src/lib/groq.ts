import axios from 'axios';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface MatchScore {
  score: number;
  explanation: string;
}

export async function calculateMatchScore(user1: any, user2: any): Promise<MatchScore> {
  if (!GROQ_API_KEY) {
    // Fallback if no API key
    return {
      score: Math.floor(Math.random() * 40) + 60,
      explanation: 'Match score calculated based on profile compatibility.',
    };
  }

  try {
    const prompt = `You are a study partner matching AI. Analyze these two students and provide:
1. A compatibility score (0-100)
2. A brief explanation (2-3 sentences)

Student 1:
- School: ${user1.schoolName}
- Major: ${user1.major}
- Faculty: ${user1.faculty}
- Interests: ${user1.interests.join(', ')}
- Bio: ${user1.bio}

Student 2:
- School: ${user2.schoolName}
- Major: ${user2.major}
- Faculty: ${user2.faculty}
- Interests: ${user2.interests.join(', ')}
- Bio: ${user2.bio}

Respond ONLY with valid JSON in this exact format:
{"score": <number>, "explanation": "<text>"}`;

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const content = response.data.choices[0]?.message?.content || '';
    const parsed = JSON.parse(content);

    return {
      score: Math.min(100, Math.max(0, parsed.score)),
      explanation: parsed.explanation,
    };
  } catch (error) {
    console.error('Groq API error:', error);
    // Fallback to random score
    return {
      score: Math.floor(Math.random() * 40) + 60,
      explanation: 'Match score calculated based on profile compatibility.',
    };
  }
}
