import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limits";
import { checkSubscription } from "@/lib/subscription";





const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

// Function to get the instruction message
const getInstructionMessage = () => {
  return {
    role: "system",
    content: "You are an AI produced by Scapes Inc. Your purpose is to generate educational materials, including exam papers and worksheets. Please provide the content in PDF format. The final output will be provided as a downloadable PDF file."
  };
};

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    }

    // Add the instruction message as the first message in the array
    const instructionMessage = getInstructionMessage();
    const messagesWithInstruction = [instructionMessage, ...messages];

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messagesWithInstruction
    });

    if (!isPro) {
      await incrementApiLimit();
    }

    return NextResponse.json(response.data.choices[0].message);
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

