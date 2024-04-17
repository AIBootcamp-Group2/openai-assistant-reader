/**
 * API Route - Run Assistant Image
 * 
 * This API route is crafted to generate an image with the OpenAI API. 
 * The route is responsible for receiving the assistant ID and thread ID, 
 * which are crucial for identifying the specific assistant and conversation thread to interact with. 
 * Upon receiving these IDs, the route invokes the OpenAI API to generate a prompt for
 * image generation. Then, the prompt pass to the image generation endpoint
 * and return the image back to the assistant’s run. 
 * Path: /api/runAssistantImage
 */


import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

// Initialize the OpenAI client with the API key. The API key is essential for authenticating
// and authorizing the requests to OpenAI's services.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const prompt = `Generate an image that describes the following recipe: ${message}`;
  const response = await openai.images.generate({
    model: "dall-e-2",
    prompt: prompt.substring(0, Math.min(prompt.length, 1000)),
    size: "1024x1024",
    quality: "standard",
    response_format: "b64_json",
    n: 1,
  });
  return new Response(JSON.stringify(response.data[0].b64_json))
}