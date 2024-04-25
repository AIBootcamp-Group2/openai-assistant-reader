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
    defaultHeaders: {"OpenAI-Beta": "assistants=v1"}
  });


export async function POST(req: NextRequest) {
  try {
    // Extract JSON data from the request
    const data = await req.json();

    // Retrieve 'threadId' from JSON data
    const threadId = data.threadId;

    // Log the received thread ID for debugging
    console.log(`Received request with threadId: ${threadId}`);

    // Retrieve messages for the given thread ID using the OpenAI API
    const messages = await openai.beta.threads.messages.list(threadId);
    
    messages.data.forEach((message, index) => {
      console.log(`Message ${index + 1} content:`, message.content);
    });
    // Log the count of retrieved messages for debugging
    console.log(`Retrieved ${messages.data.length} messages`);

    
    // Find the first assistant message
    const assistantMessage = messages.data.find(message => message.role === 'assistant');

    if (!assistantMessage) {
      return NextResponse.json({ error: "No assistant message found" });
    }

    const assistantMessageContent = assistantMessage.content.at(0);
    if (!assistantMessageContent) {
      return NextResponse.json({ error: "No assistant message content found" });
    }

    if (assistantMessageContent.type !== "text") {
      return NextResponse.json({ error: "Assistant message is not text, only text supported in this demo" });
    }
    // get the assistant description messages as a JSON response
    const prompt = assistantMessageContent.text.value;
    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt: prompt.substring(0, Math.min(prompt.length, 1000)),
      size: "1024x1024",
      quality: "standard",
      response_format: "b64_json",
      n: 1,
    });
    return NextResponse.json({image:JSON.stringify(response.data[0].b64_json)})  
  } catch (error) {
    // Log any errors that occur during the process
    console.error(`Error occurred: ${error}`);
  }
}