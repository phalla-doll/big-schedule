import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": "https://big-schedule-eight.vercel.app/",
        "X-Title": "Big Schedule Agenda",
    },
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { prompt } = body;
        const JsonStructuredPrompt =
        `Please generate the following information and respond in JSON format with the following structure:
        {
            "title": "...",
            "description": "...",
            "agendaItems":
            [
                {
                    "title": "...",
                    "description": "...",
                    "startTime": "...",
                    "endTime": "...",
                    "location": "..."
                },
                ...
            ],
        }
        Based on the following input: ${prompt}`;

        const completion = await openai.chat.completions.create({
            model: "deepseek/deepseek-chat-v3-0324:free", // Or use another text model
            messages: [
                {
                    role: "system",
                    content: JsonStructuredPrompt || "You are an expert Schedule Planner Assistant. Your primary goal is to help me manage my calendar efficiently. You understand natural language for dates, times, locations, and event descriptions. You can create new events, modify existing ones, check for scheduling conflicts, and set reminders. Be proactive in suggesting optimal times and always confirm the details (What, When, Where, Who) before scheduling."
                }
            ],
        });

        return NextResponse.json({ result: completion.choices[0].message.content });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}