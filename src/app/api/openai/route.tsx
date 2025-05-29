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

### Context ###
- Current date/time: ${currentDateTime}.
- All times in ISO 8601 format (${timezone} timezone).
- If no date is specified in the input for the start of the schedule, use the current date.
- If no times are specified, distribute items across business hours (9 AM - 6 PM).
- No skipping of time slots or the target day.
- If no location specified, use "Online".
- Ensure no time conflicts between items.
- Items should be chronologically ordered.
- Allow 15-30 minute buffers between activities.

### Input ###
${userInput}`;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { prompt } = body;
        const dateNow = new Date().toISOString();

        const completion = await openai.chat.completions.create({
            model: "meta-llama/llama-3.3-8b-instruct:free", // Or use another text model
            messages: [
                {
                    role: "system",
                    content: "You are a Schedule Planner Assistant specializing in converting natural language requests into structured daily agendas.",
                },
                {
                    role: "user",
                    content: createSchedulePrompt({ userInput: prompt, currentDateTime: dateNow }),
                }
            ],
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "schedule",
                    strict: true,
                    schema: {
                        type: "object",
                        properties: {
                            title: {
                                type: "string",
                                description: "Schedule title (10-50 characters)",
                                minLength: 10,
                                maxLength: 50
                            },
                            description: {
                                type: "string",
                                description: "Schedule description (50-150 characters)",
                                minLength: 50,
                                maxLength: 150
                            },
                            agendaItems: {
                                type: "array",
                                description: "List of agenda items",
                                minItems: 3,
                                maxItems: 8,
                                items: {
                                    type: "object",
                                    properties: {
                                        title: {
                                            type: "string",
                                            description: "Agenda item title (5-30 characters)",
                                            minLength: 5,
                                            maxLength: 30
                                        },
                                        description: {
                                            type: "string",
                                            description: "Agenda item description (50-130 characters)",
                                            minLength: 50,
                                            maxLength: 130
                                        },
                                        startTime: {
                                            type: "string",
                                            format: "date-time",
                                            description: "Start time in ISO 8601 format"
                                        },
                                        endTime: {
                                            type: "string",
                                            format: "date-time",
                                            description: "End time in ISO 8601 format"
                                        },
                                        location: {
                                            type: "string",
                                            description: "Location of the agenda item"
                                        }
                                    },
                                    required: ["title", "description", "startTime", "endTime", "location"],
                                    additionalProperties: false
                                }
                            }
                        },
                        required: ["title", "description", "agendaItems"],
                        additionalProperties: false
                    }
                }
            }
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