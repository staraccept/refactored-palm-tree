// app/api/pos-recommend/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { posProducts } from '@/lib/posProducts';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'; // Import the type

export async function POST(request: Request) {
    console.log("API Key (route.ts):", process.env.OPENAI_API_KEY); // Keep this for now

    try {
        const { query } = await request.json();

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        const productInfo = posProducts.map(product => ({
            name: product.name,
            bestFor: product.bestFor?.join(', ') || '',
            features: product.features?.join(', ') || '',
        }));

        const messages: ChatCompletionMessageParam[] = [ // Type assertion here
            {
                role: "system",
                content: `You are a helpful assistant that recommends Clover POS systems.
Based on the user's query, recommend the BEST matching Clover products from the list below.

Available Clover Products:
${JSON.stringify(productInfo, null, 2)}

Provide your recommendations in JSON format as an array of product names.  Include ONLY the product names, nothing else.
ABSOLUTELY DO NOT INCLUDE ANY ADDITIONAL TEXT OR MARKDOWN.  RETURN PURE JSON ONLY.

For example:
["Clover Station Duo 2", "Clover Mini 3"]

If no products match, return an empty array.
`
            },
            {
                role: "user",
                content: query
            }
        ];

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            max_tokens: 50,
            temperature: 0.5,
        });

        let recommendedProductNames;
        try {
            if (response.choices[0]?.message?.content) {
                recommendedProductNames = JSON.parse(response.choices[0].message.content.trim());
            } else {
                console.error("OpenAI response missing content:", response);
                return NextResponse.json({ error: 'OpenAI response missing content' }, { status: 500 });
            }
        } catch (parseError) {
            console.error("Error parsing OpenAI response:", parseError);
            console.error("OpenAI response text:", response.choices[0]?.message?.content);
            return NextResponse.json({ error: 'Failed to parse OpenAI response' }, { status: 500 });
        }

        const finalRecommendations = posProducts.filter(product =>
            recommendedProductNames.includes(product.name)
        );

        return NextResponse.json({ recommendations: finalRecommendations }, { status: 200 });

    } catch (error: any) {
        console.error('Error processing recommendation:', error);
        return NextResponse.json({ error: 'Failed to process recommendation' }, { status: 500 });
    }
}