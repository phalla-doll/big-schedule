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

interface PromptConfig {
    userInput: string;
    currentDateTime: string;
    timezone?: string;
}

const createSchedulePrompt = ({ userInput, currentDateTime, timezone = 'UTC' }: PromptConfig): string => `
### System Role ###
You are a Schedule Planner Assistant specializing in converting natural language requests into structured daily agendas.

### Output Format ###
Return ONLY a valid JSON object with this exact structure:
{
  "title": "string (10-50 characters)",
  "description": "string (50-150 characters)", 
  "agendaItems": [ // NOTE: The key MUST be "agendaItems" (plural), NOT "agendaItem"
    {
      "title": "string (5-30 characters)",
      "description": "string (20-100 characters)",
      "startTime": "ISO 8601 string",
      "endTime": "ISO 8601 string", 
      "location": "string"
    }
  ]
}

### Requirements ###
- Generate 3-8 agenda items for a single day
- All times in ISO 8601 format (${timezone} timezone)
- If no location specified, use "Online"
- Ensure no time conflicts between items
- Items should be chronologically ordered
- Allow 15-30 minute buffers between activities

### Context ###
- Current date/time: ${currentDateTime}
- If no date specified, use current date
- If no times specified, distribute items across business hours (9 AM - 6 PM)

### Input ###
${userInput}

### Validation ###
- All agendaItems must have startTime and endTime on the same date
- startTime must be before endTime
- Each item duration: 15 minutes to 4 hours
- No overlapping time slots
- No skipping of time slots or the target day

Return only the JSON object, no additional text.`;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { prompt } = body;
        const dateNow = new Date().toISOString();

        const completion = await openai.chat.completions.create({
            model: "deepseek/deepseek-chat-v3-0324:free", // Or use another text model
            messages: [
                {
                    role: "system",
                    content: createSchedulePrompt({ userInput: prompt, currentDateTime: dateNow }) || "You are an expert Schedule Planner Assistant. Your primary goal is to help me manage my calendar efficiently. You understand natural language for dates, times, locations, and event descriptions. You can create new events, modify existing ones, check for scheduling conflicts, and set reminders. Be proactive in suggesting optimal times and always confirm the details (What, When, Where, Who) before scheduling."
                }
            ],
        });

        let content = completion.choices[0].message.content;
        let jsonResponse;

        if (content) {
            // Extract the first JSON object from the string
            const jsonMatch = content.match(/{[\s\S]*}/);
            if (jsonMatch) {
                content = jsonMatch[0];
            }

            try {
                jsonResponse = JSON.parse(content);
            } catch (e) {
                console.error("Failed to parse JSON from LLM response:", e);
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