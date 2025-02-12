// app/api/pos-recommend/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log("POST request received!"); // VERY IMPORTANT - Check for this log
  return NextResponse.json({ message: 'POST request successful!' });
}

export async function OPTIONS(request: Request) { //keep the options
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