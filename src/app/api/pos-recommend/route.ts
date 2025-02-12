import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { posProducts } from '@/lib/posProducts'
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

// If you're deploying to a Next.js edge environment on Cloudflare, you may need this:
// export const runtime = 'edge';

// Handle OPTIONS to prevent 405 on Cloudflare.
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Allow': 'POST, OPTIONS'
      }
    }
  )
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    const productInfo = posProducts.map(product => ({
      name: product.name,
      identifier: product.identifier,
      bestFor: product.bestFor,
      businessTypes: product.searchTerms.businessTypes,
      useCases: product.searchTerms.useCase,
      primaryCategory: product.primaryCategory,
      size: product.size
    }))

    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
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
        role: 'user',
        content: query
      }
    ]

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

    // Note: The standard OpenAI Node SDK typically expects "model" to be something like "gpt-3.5-turbo" or "gpt-4".
    // If "gpt-4o-mini" is an internal or fine-tuned model, ensure your environment can access it.
    // Also remove `response_format` if your version of openai library doesn't support it.
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // or "gpt-4" or your internal model
      messages,
      max_tokens: 50,
      temperature: 0.3
      // Remove if not supported:
      // response_format: { type: "json_object" }
    })

    let recommendedIds: string[] = []

    try {
      const content = response.choices[0]?.message?.content
      if (content) {
        const parsed = JSON.parse(content.trim())

        // Accept array of strings:
        if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
          recommendedIds = parsed
        }
        // Accept object with 'identifier' property containing array of strings:
        else if (
          typeof parsed === 'object' &&
          parsed !== null &&
          Array.isArray(parsed.identifier) &&
          parsed.identifier.every((item: any) => typeof item === 'string')
        ) {
          recommendedIds = parsed.identifier
        }
        // Accept object with 'recommendations' property (array of strings):
        else if (
          typeof parsed === 'object' &&
          parsed !== null &&
          Array.isArray(parsed.recommendations) &&
          parsed.recommendations.every((item: any) => typeof item === 'string')
        ) {
          recommendedIds = parsed.recommendations
        }
        // Accept object with single string 'identifier':
        else if (
          typeof parsed === 'object' &&
          parsed !== null &&
          typeof parsed.identifier === 'string'
        ) {
          recommendedIds = [parsed.identifier]
        } else {
          console.error('Invalid response format', parsed)
          return NextResponse.json(
            { error: 'Invalid response format. Expected an array of strings or an appropriate object structure.' },
            { status: 500 }
          )
        }
      } else {
        console.error('OpenAI response missing content:', response)
        return NextResponse.json({ error: 'OpenAI response missing content' }, { status: 500 })
      }
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError)
      console.error('Raw response:', response.choices[0]?.message?.content)
      return NextResponse.json({ error: 'Failed to parse OpenAI response' }, { status: 500 })
    }

    // Build final data with any complementary products
    const recommendations = recommendedIds
      .map((id: string) => {
        const product = posProducts.find(p => p.identifier === id)
        if (!product) return null
        const relatedProducts = (product.complementaryProducts || [])
          .map((relatedId: string) => posProducts.find(p => p.identifier === relatedId))
          .filter(Boolean)
          .slice(0, 2)
        return { ...product, relatedProducts }
      })
      .filter(Boolean)

    return NextResponse.json(
      {
        recommendations,
        query
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error processing recommendation:', error)
    return NextResponse.json(
      {
        error: 'Failed to process recommendation',
        details: error.message
      },
      { status: 500 }
    )
  }
}
 