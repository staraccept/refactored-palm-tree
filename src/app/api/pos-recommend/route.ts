// app/api/pos-recommend/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { posProducts } from '@/lib/posProducts';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export async function POST(request: Request) {
    try {
        const { query } = await request.json();

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        const productInfo = posProducts.map(product => ({
            name: product.name,
            identifier: product.identifier, // Include the identifier
            bestFor: product.bestFor,
            businessTypes: product.searchTerms.businessTypes,
            useCases: product.searchTerms.useCase,
            primaryCategory: product.primaryCategory,
            size: product.size
        }));

        const messages: ChatCompletionMessageParam[] = [
            {
                role: "system",
                content: `You are a Clover POS system recommendation expert. Your task is to analyze user queries and recommend the most suitable Clover products.

Available Products:
${JSON.stringify(productInfo, null, 2)}

Consider these factors when making recommendations:
1. Business type matches (e.g., restaurant, retail, service)
2. Use case alignment (e.g., mobile, fixed location, high volume)
3. Size requirements (compact, standard, large)
4. Primary category fit (pos, peripheral, mobile, selfservice)

Return recommendations as a JSON array of product identifiers, ordered by relevance. Include 1-3 products maximum.
Format: ["identifier1", "identifier2"]

Example: ["duo2", "kds"]

Return ONLY the JSON array. No additional text or explanation.`
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
            model: "gpt-4o",  // Keep gpt-4o
            messages: messages,
            max_tokens: 50,
            temperature: 0.3, // Lower temperature for more deterministic output
            response_format: { type: "json_object" } // Add back response_format
        });

        let recommendedIds: string[];
        try {
            if (response.choices[0]?.message?.content) {
                const parsed = JSON.parse(response.choices[0].message.content.trim());
                recommendedIds = Array.isArray(parsed) ? parsed : parsed.recommendations;
            } else {
                console.error("OpenAI response missing content:", response);
                return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
            }
        } catch (parseError) {
            console.error("Error parsing OpenAI response:", parseError);
            console.error("Raw response:", response.choices[0]?.message?.content);
            return NextResponse.json({ error: 'Failed to parse response' }, { status: 500 });
        }
      // Get full product details and related products
        const recommendations = recommendedIds.map((id: string) => {
            const product = posProducts.find(p => p.identifier === id);
            if (!product) return null;

            // Get 1-2 complementary products
            const relatedProducts = (product.complementaryProducts || [])
                .map((relatedId: string) => posProducts.find(p => p.identifier === relatedId))
                .filter(Boolean)
                .slice(0, 2);

            return {
                ...product,
                relatedProducts
            };
        }).filter(Boolean);

        return NextResponse.json({
            recommendations,
            query // Include original query for reference
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error processing recommendation:', error);
        return NextResponse.json({
            error: 'Failed to process recommendation',
            details: error.message,
            fullError: error // Corrected duplicate property
        }, { status: 500 });
    }
}