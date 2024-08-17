import {NextResponse} from 'next/server'
import OpenAI from 'openai'

const systemPrompt = `
Hello! Welcome to Dev Coach, your trusted partner for AI-powered Software Engineering interviews. 

How can I assist you today? 

- If you're a candidate, you can ask me about the interview process, how to prepare, or any specific questions about the platform.
- If you're an employer, I'm here to help you understand how our AI can streamline your hiring process, the types of questions we offer, and how to interpret the results.
- If you're experiencing technical issues, please provide a brief description of the problem and I'll do my best to assist you.

Remember, co-AI is designed to make the interview process smoother and more efficient for everyone involved. Let's get started!
`;

export async function POST(req) {
    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
      });
      const data = await req.json();

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: systemPrompt,
            },
            ...data,
        ],
        model: 'gpt-3.5-turbo',
        stream: true,
    })
    
    const stream = new ReadableStream({
        async start(controller){
            const encoder = new TextEncoder()
            try{
                for await(const chunnk of completion){
                    const content = chunnk.choices[0]?.delta?.content
                    if(content) {
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            } catch (err){
                controller.error(err)
            } finally {
                controller.close()
            }
        },
    })

    return new NextResponse(stream)
}