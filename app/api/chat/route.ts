import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";
import { RESUME_GUIDANCE } from "./resume_guidance";
import { error } from "console";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set the runtime to edge for best performance
export const runtime = "edge";

export async function POST(req: Request) {
  // Wrap with a try/catch to handle API errors
  try {
    // Extract the `prompt` from the body of the request
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];
    const prompt = lastMessage?.role === "user" ? lastMessage.content : null;
    console.log(messages)
    console.log(prompt);

    if (prompt == null) throw Error();

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      stream: true,
      messages: [
        {
          role: "user",
          content: `You are an expert resume reviewer for software engineers.
            Review the following work experience from a software engineer's resume: ${prompt}.
            This experience may be one or more bullet points. Rewrite the work experience as effective bullet points. The output should be the same number of bullets as the input. Use your own knowledge and the following guidlines to write the bullet points: 
            ${RESUME_GUIDANCE}. Do not make up fake metrics. Respond with a list array of points separated by |. Only respond with a list.`,
        },
      ],
    });
    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    // Check if the error is an APIError
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      throw error;
    }
  }
}
