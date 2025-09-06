import { NextResponse } from 'next/server';
import { upsertUser } from '@/lib/user';

export async function POST(request: Request) {
  try {
    console.log("API: Request received");
    const body = await request.json();
    console.log("API: Request body:", body);
    const { walletAddress } = body as { walletAddress?: string };

    if (!walletAddress || typeof walletAddress !== 'string') {
      console.log("API: Wallet address is missing or invalid");
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    const id = walletAddress.toLowerCase();
    console.log("API: Upserting user with id:", id);
    const { data, error } = await upsertUser(id);
    if (error) {
      console.error("API: Upsert failed:", error);
      return NextResponse.json({ error: 'Failed to upsert user' }, { status: 500 });
    }

    // Supabase upsert doesn't easily differentiate between insert/update without additional logic.
    console.log("API: User upserted:", data);
    return NextResponse.json({ message: 'User logged in successfully', user: data }, { status: 200 });
  } catch (error) {
    console.error('API Error caught in catch block:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}