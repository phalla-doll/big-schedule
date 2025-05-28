import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openRouterApiKey = process.env.OPENROUTER_API_KEY!;

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: openRouterApiKey,
    defaultHeaders: {
        "HTTP-Referer": "https://big-schedule-eight.vercel.app/",
        "X-Title": "Big Schedule Agenda",
    },
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { prompt } = body;
        const dateNow = new Date().toISOString();
        const JsonStructuredPrompt =
        `Please generate the following information and respond in JSON format with the following structure:
        {
            "title": "...",
            "description": "...",
            "agendaItems": [
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
        Based on the following input: "${prompt}".

        ### Instructions ###
        - Result should be in medium length.
        - startTime and endTime should be in the format of ISO 8601.
        - In a day should have at least a few agendaItems (few activities).
        - If there is no date or time mentioned, the current date and time is ${dateNow}.
        - Please make sure to not change the property name in JSON structure.
        - If there is no location mentioned, use "Online" as the default location.
        - Don't include any additional text or explanations, just return the JSON object.
        `;

        const completion = await openai.chat.completions.create({
            model: "deepseek/deepseek-chat-v3-0324:free", // Or use another text model
            messages: [
                {
                    role: "system",
                    content: JsonStructuredPrompt || "You are an expert Schedule Planner Assistant. Your primary goal is to help me manage my calendar efficiently. You understand natural language for dates, times, locations, and event descriptions. You can create new events, modify existing ones, check for scheduling conflicts, and set reminders. Be proactive in suggesting optimal times and always confirm the details (What, When, Where, Who) before scheduling."
                }
            ],
        });

        let content = completion.choices[0].message.content;
        let jsonResponse;

        if (content) {
            // Remove Markdown code block fences if present
            const match = content.match(/```json\s*([\s\S]*?)\s*```|([\s\S]*)/);
            if (match && (match[1] || match[2])) {
                content = match[1] || match[2]; // Prefer captured JSON within ```json ... ```, otherwise take the whole string
            }
            
            try {
                jsonResponse = JSON.parse(content);
            } catch (e) {
                console.error("Failed to parse JSON from LLM response:", e);
                // Potentially return the raw content or a specific error if parsing fails
                return NextResponse.json({ error: "Failed to parse LLM response as JSON", raw_content: content }, { status: 500 });
            }
        } else {
            return NextResponse.json({ error: "No content received from LLM" }, { status: 500 });
        }

        return NextResponse.json({ result: jsonResponse });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}