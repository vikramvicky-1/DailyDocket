import OpenAI from "openai";
import { SYSTEM_PROMPT } from "./systemPrompt.js";

const client = new OpenAI({
    baseURL: "https://integrate.api.nvidia.com/v1",
    apiKey: process.env.NVIDIA_API_KEY,
});

export async function POST(request) {
    try {
        const { messages, dataSnapshot } = await request.json();

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return new Response(
                JSON.stringify({ error: "Messages array is required." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Build the system message with live data context
        let systemContent = SYSTEM_PROMPT;
        if (dataSnapshot) {
            systemContent += `\n\n═══ LIVE APPLICATION DATA (READ-ONLY SNAPSHOT) ═══\n${JSON.stringify(dataSnapshot, null, 2)}`;
        }

        // Prepend system prompt to every request
        const fullMessages = [
            { role: "system", content: systemContent },
            ...messages,
        ];

        const completion = await client.chat.completions.create({
            model: "deepseek-ai/deepseek-v3.1-terminus",
            messages: fullMessages,
            temperature: 0.2,
            top_p: 0.7,
            max_tokens: 8192,
            extra_body: { chat_template_kwargs: { thinking: true } },
            stream: true,
        });

        // Create a ReadableStream for SSE
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of completion) {
                        if (!chunk.choices || chunk.choices.length === 0) continue;

                        // Handle reasoning/thinking content
                        const reasoning = chunk.choices[0]?.delta?.reasoning_content;
                        if (reasoning) {
                            controller.enqueue(
                                new TextEncoder().encode(
                                    `data: ${JSON.stringify({ reasoning })}\n\n`
                                )
                            );
                        }

                        // Handle main content
                        const content = chunk.choices[0]?.delta?.content;
                        if (content) {
                            controller.enqueue(
                                new TextEncoder().encode(
                                    `data: ${JSON.stringify({ content })}\n\n`
                                )
                            );
                        }
                    }
                    controller.enqueue(
                        new TextEncoder().encode("data: [DONE]\n\n")
                    );
                    controller.close();
                } catch (err) {
                    console.error("Stream error:", err);
                    controller.enqueue(
                        new TextEncoder().encode(
                            `data: ${JSON.stringify({ error: "Stream interrupted." })}\n\n`
                        )
                    );
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        console.error("Chat API error:", error);
        return new Response(
            JSON.stringify({
                error: "An error occurred while processing your request.",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
