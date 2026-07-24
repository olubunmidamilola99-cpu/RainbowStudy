import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type, Modality } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable is not explicitly set. Requests may fail if key is missing.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// 1. Generate Fragmented Learning Path
app.post('/api/path/generate', async (req, res) => {
  try {
    const { topic, dailyMinutes = 5, skillLevel = 'Beginner', learningStyle = 'Balanced', goal = '' } = req.body;

    if (!topic || typeof topic !== 'string') {
      res.status(400).json({ error: 'Topic is required' });
      return;
    }

    const ai = getGeminiClient();

    const prompt = `You are an expert curriculum architect specializing in "Fragmental Learning" (micro-learning pathing).
Your task is to decompose the topic/goal "${topic}" (${goal ? `Specific Goal: ${goal}` : ''}) into a highly structured, modular, bite-sized learning path.

Target Learner Constraints:
- Daily learning budget: ${dailyMinutes} minutes per day. Keep fragments around 2-4 minutes each!
- Learner skill level: ${skillLevel}
- Primary learning style preference: ${learningStyle}

Deconstruct the path into:
- 3 to 4 sequential Phase Clusters (e.g. "Phase 1: Fundamentals", "Phase 2: Core Concepts", "Phase 3: Applied Skills").
- A total of 8 to 14 atomic "Learning Fragments" divided across these phases.
- Each fragment MUST be standalone, bite-sized, and take 2 to 4 minutes to complete.
- Each fragment MUST include:
  1. Title
  2. Estimated minutes (2-4 mins)
  3. Fragment type ('concept', 'quiz', 'analogy', 'case_study', or 'challenge')
  4. Concise summary (2-3 sentences max)
  5. 3 clear bullet-point key takeaways
  6. 2 key terms with term name and brief definition
  7. A crisp real-world analogy
  8. A practical mini-example or short code snippet if relevant
  9. An interactive 1-question micro-quiz with 2-3 multiple choice options, indicating correct option ID and short explanations for each option.
  10. A 1-sentence mini practice challenge with a hint.

Return strict JSON strictly matching the requested format.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        systemInstruction: 'You generate structured JSON for fragmental learning paths. Keep explanations concise, modular, and engaging. Never output markdown around JSON unless necessary, return plain JSON.',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Catchy course title' },
            targetGoal: { type: Type.STRING, description: 'High level path goal' },
            category: { type: Type.STRING, description: 'Broad category name e.g. Technology, Design, Science, Business' },
            phases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: 'Phase ID e.g. phase-1' },
                  title: { type: Type.STRING, description: 'Phase title' },
                  description: { type: Type.STRING, description: 'Phase summary' },
                  order: { type: Type.INTEGER },
                  estimatedMinutes: { type: Type.INTEGER },
                  fragmentIds: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['id', 'title', 'description', 'order', 'estimatedMinutes', 'fragmentIds'],
              },
            },
            fragments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  phaseId: { type: Type.STRING },
                  order: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  estimatedMinutes: { type: Type.INTEGER },
                  type: { type: Type.STRING, description: 'concept, quiz, analogy, case_study, or challenge' },
                  summary: { type: Type.STRING },
                  takeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
                  keyTerms: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        term: { type: Type.STRING },
                        definition: { type: Type.STRING },
                      },
                      required: ['term', 'definition'],
                    },
                  },
                  analogy: { type: Type.STRING },
                  codeSnippet: { type: Type.STRING },
                  quiz: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      correctOptionId: { type: Type.STRING },
                      conceptSummary: { type: Type.STRING },
                      options: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            id: { type: Type.STRING },
                            text: { type: Type.STRING },
                            explanation: { type: Type.STRING },
                          },
                          required: ['id', 'text', 'explanation'],
                        },
                      },
                    },
                    required: ['question', 'correctOptionId', 'options', 'conceptSummary'],
                  },
                  challenge: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      prompt: { type: Type.STRING },
                      hint: { type: Type.STRING },
                      sampleAnswer: { type: Type.STRING },
                    },
                    required: ['title', 'prompt', 'sampleAnswer'],
                  },
                },
                required: ['id', 'phaseId', 'order', 'title', 'estimatedMinutes', 'type', 'summary', 'takeaways', 'keyTerms'],
              },
            },
          },
          required: ['title', 'targetGoal', 'category', 'phases', 'fragments'],
        },
      },
    });

    const jsonText = response.text || '{}';
    const parsedData = JSON.parse(jsonText);

    // Hydrate runtime defaults for path
    const pathId = `path-${Date.now()}`;
    const formattedPath = {
      id: pathId,
      title: parsedData.title || topic,
      targetGoal: parsedData.targetGoal || goal || `Master ${topic} in fragmental daily steps.`,
      category: parsedData.category || 'General Learning',
      dailyMinutes: Number(dailyMinutes) || 5,
      skillLevel,
      learningStyle,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      iconName: 'Sparkles',
      totalMinutes: parsedData.fragments?.reduce((acc: number, f: any) => acc + (f.estimatedMinutes || 3), 0) || 15,
      phases: parsedData.phases || [],
      fragments: (parsedData.fragments || []).map((f: any, idx: number) => ({
        ...f,
        id: f.id || `frag-${idx + 1}`,
        status: idx === 0 ? 'in_progress' : 'locked',
        prerequisiteIds: idx === 0 ? [] : [`frag-${idx}`],
        estimatedMinutes: f.estimatedMinutes || 3,
      })),
    };

    res.json({ success: true, path: formattedPath });
  } catch (err: any) {
    console.error('Error in /api/path/generate:', err);
    res.status(500).json({ error: err.message || 'Failed to generate learning path' });
  }
});

// 2. Explain Fragment Dynamically ("Explain Like I'm 5", "Analogy", "Practical Code", "Deep Dive")
app.post('/api/fragment/explain', async (req, res) => {
  try {
    const { fragmentTitle, summary, mode = 'eli5' } = req.body;

    if (!fragmentTitle) {
      res.status(400).json({ error: 'Fragment title is required' });
      return;
    }

    const ai = getGeminiClient();

    let modePrompt = '';
    if (mode === 'eli5') {
      modePrompt = 'Explain this concept as if talking to a curious 10-year old using vivid simple metaphors, zero jargon, and an uplifting tone.';
    } else if (mode === 'analogy') {
      modePrompt = 'Provide 2 memorable real-world analogies (e.g. kitchen cooking, traffic flow, sports, household appliances) that make this concept click instantly.';
    } else if (mode === 'code') {
      modePrompt = 'Provide a crisp, practical, line-by-line code or step-by-step practical walk-through demonstrating this concept in action.';
    } else {
      modePrompt = 'Provide a deeper technical breakdown including edge cases, common pitfalls, and industry best practices.';
    }

    const prompt = `Topic Fragment: "${fragmentTitle}"
Summary: "${summary || ''}"

Goal: ${modePrompt}

Return JSON with format:
{
  "content": "Detailed text explanation formatted nicely with spacing",
  "keyHighlights": ["Highlight 1", "Highlight 2", "Highlight 3"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      success: true,
      mode,
      content: parsed.content || 'Unable to generate explanation.',
      keyHighlights: parsed.keyHighlights || [],
    });
  } catch (err: any) {
    console.error('Error in /api/fragment/explain:', err);
    res.status(500).json({ error: err.message || 'Failed to generate explanation' });
  }
});

// 3. Fragmentize Text / Article / Document into Micro-Learning Cards
app.post('/api/fragmentize/text', async (req, res) => {
  try {
    const { sourceText, titleHint = 'Custom Fragmented Article' } = req.body;

    if (!sourceText || sourceText.trim().length < 20) {
      res.status(400).json({ error: 'Source text must be at least 20 characters long' });
      return;
    }

    const ai = getGeminiClient();

    const prompt = `You are the Edupath AI Text Deconstructor.
Analyze the following source text and fragment it into 3 to 5 bite-sized, sequential micro-learning cards (2-3 minutes each).

Source Text Title Hint: "${titleHint}"
Source Content:
"""
${sourceText.slice(0, 4000)}
"""

Format each fragment with:
- Title
- 2-minute estimated time
- Summary (2 sentences max)
- 3 key takeaways
- 1 key term with definition
- 1 interactive micro-quiz (question, 2 choices, correct option ID, short explanations)

Return JSON format:
{
  "title": "Overall Deconstructed Course Title",
  "targetGoal": "Deconstructed micro-path from provided text",
  "fragments": [
    {
      "title": "Fragment Title",
      "summary": "Summary",
      "takeaways": ["Takeaway 1", "Takeaway 2"],
      "keyTerms": [{"term": "Term", "definition": "Def"}],
      "analogy": "Quick analogy",
      "quiz": {
        "question": "Question text",
        "correctOptionId": "opt-1",
        "conceptSummary": "Why this matters",
        "options": [
          {"id": "opt-1", "text": "Choice 1", "explanation": "Correct answer reason"},
          {"id": "opt-2", "text": "Choice 2", "explanation": "Incorrect reason"}
        ]
      }
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    // Build path structure from fragments
    const pathId = `path-frag-${Date.now()}`;
    const rawFragments = parsed.fragments || [];
    const phaseId = `phase-1`;

    const formattedFragments = rawFragments.map((f: any, idx: number) => ({
      id: `frag-${idx + 1}`,
      phaseId,
      order: idx + 1,
      title: f.title || `Fragment ${idx + 1}`,
      estimatedMinutes: 3,
      type: 'concept',
      status: idx === 0 ? 'in_progress' : 'locked',
      prerequisiteIds: idx === 0 ? [] : [`frag-${idx}`],
      summary: f.summary || '',
      takeaways: f.takeaways || [],
      keyTerms: f.keyTerms || [],
      analogy: f.analogy || '',
      quiz: f.quiz || undefined,
    }));

    const pathObj = {
      id: pathId,
      title: parsed.title || `Fragmented: ${titleHint}`,
      targetGoal: parsed.targetGoal || 'Deconstructed text into bite-sized learning cards',
      category: 'Text Fragmentizer',
      dailyMinutes: 5,
      skillLevel: 'Intermediate',
      learningStyle: 'Balanced',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      iconName: 'FileText',
      totalMinutes: formattedFragments.length * 3,
      phases: [
        {
          id: phaseId,
          title: 'Deconstructed Core Modules',
          description: 'Atomic learning cards generated from source document.',
          order: 1,
          estimatedMinutes: formattedFragments.length * 3,
          fragmentIds: formattedFragments.map((f: any) => f.id),
        },
      ],
      fragments: formattedFragments,
    };

    res.json({ success: true, path: pathObj });
  } catch (err: any) {
    console.error('Error in /api/fragmentize/text:', err);
    res.status(500).json({ error: err.message || 'Failed to fragmentize text' });
  }
});

// 4. Challenge Evaluator
app.post('/api/quiz/evaluate', async (req, res) => {
  try {
    const { challengePrompt, userAnswer } = req.body;

    if (!userAnswer || !userAnswer.trim()) {
      res.status(400).json({ error: 'User answer is required' });
      return;
    }

    const ai = getGeminiClient();

    const prompt = `Challenge Prompt: "${challengePrompt}"
User Submitted Solution: "${userAnswer}"

Evaluate the solution constructively in 3 short bullet points:
1. What was done well
2. Any missing key nuance
3. Score out of 10 with friendly encouraging feedback.

Return JSON:
{
  "score": 9,
  "passed": true,
  "feedback": "Encouraging summary",
  "highlights": ["Well done point", "Key nuance note"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, evaluation: parsed });
  } catch (err: any) {
    console.error('Error in /api/quiz/evaluate:', err);
    res.status(500).json({ error: err.message || 'Failed to evaluate challenge' });
  }
});

// 5. Generate Practice Questions
app.post('/api/exam/practice-questions', async (req, res) => {
  try {
    const { subject, topic, difficulty = 'medium', count = 4 } = req.body;

    if (!subject || !topic) {
      res.status(400).json({ error: 'Subject and Topic are required' });
      return;
    }

    const ai = getGeminiClient();

    const prompt = `You are a top exam preparation expert.
Generate ${count} targeted practice exam questions for:
Subject: "${subject}"
Topic: "${topic}"
Difficulty Level: "${difficulty}"

Each question should have:
- Clear question text
- 4 plausible options (A, B, C, D)
- The correct option ID
- A detailed step-by-step solution explanation
- A quick memory tip/trick for this question type.

Return strict JSON matching:
{
  "subject": "${subject}",
  "topic": "${topic}",
  "questions": [
    {
      "id": "q1",
      "question": "Question text here",
      "options": [
        {"id": "A", "text": "Option A"},
        {"id": "B", "text": "Option B"},
        {"id": "C", "text": "Option C"},
        {"id": "D", "text": "Option D"}
      ],
      "correctOptionId": "A",
      "explanation": "Step-by-step breakdown of why A is correct",
      "proTip": "Quick memory shortcut or formula application note"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (err: any) {
    console.error('Error in /api/exam/practice-questions:', err);
    // Instant fallback if network or API call is degraded
    res.json({
      success: true,
      data: {
        subject: req.body.subject || 'Subject',
        topic: req.body.topic || 'Topic',
        questions: [
          {
            id: 'q1',
            question: `Which fundamental principle is central to solving problems in ${req.body.topic || 'this topic'}?`,
            options: [
              { id: 'A', text: 'Systematic step-by-step analysis & formula application' },
              { id: 'B', text: 'Random estimation without units' },
              { id: 'C', text: 'Skipping intermediate calculation steps' },
              { id: 'D', text: 'Only memorizing final answer values' }
            ],
            correctOptionId: 'A',
            explanation: `In ${req.body.subject || 'this subject'}, applying systematic step-by-step formulas ensures accuracy in exam conditions.`,
            proTip: 'Always write down given values and target variables first!'
          },
          {
            id: 'q2',
            question: `What is a recommended first step when approaching a high-mark question on ${req.body.topic || 'this topic'}?`,
            options: [
              { id: 'A', text: 'Identify given conditions and underline key terms' },
              { id: 'B', text: 'Immediately start writing without reading the full question' },
              { id: 'C', text: 'Guess the option with the highest number' },
              { id: 'D', text: 'Leave the question blank until the last 2 minutes' }
            ],
            correctOptionId: 'A',
            explanation: 'Underlining keywords prevents silly mistakes and misreading target units during high-pressure tests.',
            proTip: 'Double-check SI units before doing final arithmetic.'
          }
        ]
      }
    });
  }
});

// 6. Generate Exam Tips & Strategy
app.post('/api/exam/tips', async (req, res) => {
  try {
    const { subject, topic, testScore, examScore } = req.body;

    if (!subject || !topic) {
      res.status(400).json({ error: 'Subject and Topic are required' });
      return;
    }

    const ai = getGeminiClient();

    const prompt = `You are an elite academic strategy coach and exam top-scorer.
Provide tailored high-impact exam preparation tips and revision strategies for:
Subject: "${subject}"
Topic: "${topic}"
${testScore ? `Recent Test Score: ${testScore}` : ''}
${examScore ? `Recent Exam Score: ${examScore}` : ''}

Provide a structured JSON output with:
1. Performance Diagnosis / Motivational Summary
2. 4 Actionable High-Yield Exam Hacks & Hacks (Time management, question breakdown tricks, calculation shortcuts)
3. 3 Common Mistakes & Pitfalls to avoid in "${topic}" exams
4. A 5-point Quick Revision Checklist before test day.
5. 2 Memory Mnemonics or Memory Visual Hooks for "${topic}"

Return JSON matching:
{
  "performanceSummary": "Diagnosis summary",
  "examHacks": [
    {"title": "Hack title", "description": "How to execute it on the exam"}
  ],
  "commonPitfalls": [
    {"pitfall": "Mistake name", "solution": "How to avoid"}
  ],
  "revisionChecklist": ["Checklist item 1", "Checklist item 2", "Checklist item 3", "Checklist item 4", "Checklist item 5"],
  "mnemonics": [
    {"mnemonic": "RAM", "meaning": "Random Access Memory - temporary workspace"}
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, tips: parsed });
  } catch (err: any) {
    console.error('Error in /api/exam/tips:', err);
    // Instant fallback
    res.json({
      success: true,
      tips: {
        performanceSummary: `Strong progress logged in ${req.body.subject || 'Subject'} (${req.body.topic || 'Topic'}). Focus on high-yield formulas and active recall sessions.`,
        examHacks: [
          { title: 'The 2-Minute Scan', description: 'Scan the full exam paper first to answer quick high-confidence questions first.' },
          { title: 'Unit Conversion Check', description: 'Highlight units in every question before calculating final numeric values.' }
        ],
        commonPitfalls: [
          { pitfall: 'Misreading question negative constraints (e.g. "Which is NOT...")', solution: 'Circle keywords like NOT, ALWAYS, or EXCEPT in bold pencil.' },
          { pitfall: 'Rushing step explanations', solution: 'Show intermediate working out to secure partial credit marks.' }
        ],
        revisionChecklist: [
          `Review core definitions for ${req.body.topic}`,
          'Practice 3 timed past-paper questions',
          'Verify key formula variables',
          'Teach key concepts aloud without looking at notes',
          'Get 8 hours of sleep before test day'
        ],
        mnemonics: [
          { mnemonic: 'STAR', meaning: 'State given, Target variable, Apply formula, Review units' }
        ]
      }
    });
  }
});

// 7. Interactive Q&A Chat Assistant
app.post('/api/chat/ask', async (req, res) => {
  try {
    const { message, subject, topic, chatCharacter = 'rainbow', conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const ai = getGeminiClient();

    let personaInstruction = 'You are Rainbow AI Tutor, an encouraging, super-smart, and friendly study assistant using vivid analogies and step-by-step clarity.';
    if (chatCharacter === 'socrates') {
      personaInstruction = 'You are Socrates Professor, a wise and insightful academic mentor. Guide the student using the Socratic method—ask thought-provoking questions and encourage them to deduce the concepts logically step-by-step.';
    } else if (chatCharacter === 'buddy') {
      personaInstruction = 'You are a Friendly Study Buddy, an upbeat, energetic peer student. Keep responses casual, concise, highly relatable, and packed with fast study hacks and zero fluff.';
    } else if (chatCharacter === 'coach') {
      personaInstruction = 'You are a Strict Exam Coach, a direct, high-yield exam preparation specialist. Focus on exam board marking schemes, common traps, time management, and securing maximum credit marks.';
    } else if (chatCharacter === 'einstein') {
      personaInstruction = 'You are Professor Einstein, a brilliant, passionate science and math guru. Explain principles with deep conceptual clarity, mental models, formula breakdowns, and contagious curiosity.';
    } else if (chatCharacter === 'storyteller') {
      personaInstruction = 'You are a Creative Memory Storyteller. Weave study concepts into vivid visual metaphors, memorable stories, and mnemonic memory palaces that make complex facts unforgettable.';
    } else if (chatCharacter === 'questmaster') {
      personaInstruction = 'You are an RPG Quest Master. Treat study topics as epic gaming quests and boss battles! Reward curiosity with level-up analogies and motivational gamer energy.';
    } else if (chatCharacter === 'calming') {
      personaInstruction = 'You are a Mindful Calming Mentor. Speak in a soothing, reassuring, anti-anxiety tone that relieves exam stress and guides the student peacefully at their own comfortable pace.';
    } else if (chatCharacter === 'detective') {
      personaInstruction = 'You are a Logic Detective. Treat questions as forensic cases—analyze evidence, uncover hidden clues, and solve conceptual mysteries step-by-step with sharp analytical deduction.';
    } else if (chatCharacter === 'timetraveler') {
      personaInstruction = 'You are a Historical Time Traveler. Explain historical events, scientific discoveries, and literature as if you were an eyewitness who personally traveled to those epochs.';
    } else if (chatCharacter === 'cybercoder') {
      personaInstruction = 'You are a Tech Cyber-Coder. Focus on crisp logic, algorithmic efficiency, clean code structures, syntax traps, and tech-driven problem-solving methods.';
    } else if (chatCharacter === 'wiseowl') {
      personaInstruction = 'You are the Wise Owl Academy Dean. Provide high-level academic guidance, structured essay outlines, rigorous citations, and scholarly depth.';
    }

    const systemInstruction = `${personaInstruction}
${subject ? `Current Subject Context: ${subject}` : ''}
${topic ? `Current Topic Context: ${topic}` : ''}

Your goal:
- Answer student questions clearly with clear explanations, bullet points, or step-by-step examples.
- Maintain your persona consistently throughout the response.
- Focus on helping the student understand concepts deeply and score top marks in tests and exams.`;

    const chatMessages = conversationHistory.map((m: any) => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.text}`).join('\n');
    const fullPrompt = `${chatMessages ? `Previous Conversation:\n${chatMessages}\n\n` : ''}Student: ${message}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: fullPrompt,
      config: {
        systemInstruction,
      },
    });

    const replyText = response.text || "I'm here to help you study! Could you repeat your question?";
    res.json({ success: true, reply: replyText });
  } catch (err: any) {
    console.error('Error in /api/chat/ask:', err);
    res.json({ 
      success: true, 
      reply: `That's a great study question about ${req.body.topic || 'your topic'}! To master this concept: 1. Break down the key terms and definitions. 2. Practice applying the core formula step-by-step. 3. Test your recall with sample practice questions!` 
    });
  }
});

// 8. Generate TTS Audio Message (Gemini Speech API)
app.post('/api/chat/tts', async (req, res) => {
  try {
    const { text, voice = 'Kore' } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text is required for TTS' });
      return;
    }

    const ai = getGeminiClient();

    // Limit text to avoid quota overflow
    const cleanText = text.slice(0, 400).replace(/[*#_~`]/g, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text: `Say clearly and encouragingly: ${cleanText}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (base64Audio) {
      res.json({ success: true, audioBase64: base64Audio, mimeType: 'audio/pcm;rate=24000' });
    } else {
      res.json({ success: false, message: 'Audio generation unavailable' });
    }
  } catch (err: any) {
    console.error('Error in /api/chat/tts:', err);
    // Return gracefully so client can fall back to Web Speech Synthesis API
    res.json({ success: false, error: err.message });
  }
});

async function startServer() {
  // Serve Vite in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Edupath AI server running on http://localhost:${PORT}`);
  });
}

startServer();
