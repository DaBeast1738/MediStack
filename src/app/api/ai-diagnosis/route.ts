import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export async function POST(req: Request) {
  try {
    const { symptoms, conversationId } = await req.json();
    console.log("Received Symptoms:", symptoms); // ✅ Debug input

    if (!symptoms) {
      return NextResponse.json({ error: "Symptoms are required" }, { status: 400 });
    }

    // OpenAI API Call
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      store: true,
      messages: [
        { role: "system", content: `You are an AI medical assistant with the knowledge of the world's best doctors. 
          Provide a structured response with:
          - **Possible Diagnoses**
          - **Additional Symptoms to Monitor**
          - **Recommended Next Steps**
          - **A Reminder to Consult a Doctor**` },
        { role: "user", content: `Symptoms: ${symptoms}` }
      ]
    });

    console.log("OpenAI API Response:", completion); // ✅ Debug response

    const rawResponse = completion.choices?.[0]?.message?.content || "No diagnosis available.";

    // Format response into Markdown/HTML-friendly format
    const formattedResponse = rawResponse
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold formatting
      .replace(/\n/g, "<br />"); // Line breaks for HTML display

    return NextResponse.json({
      diagnosis: formattedResponse,
      conversationId: completion.id,
    });

  } catch (error) {
    console.error("🚨 OpenAI API Request Failed:", error);
    return NextResponse.json({ error: `OpenAI API request failed: ${error.message}` }, { status: 500 });
  }
}
