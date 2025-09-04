import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    console.log("API: Request received"); // 追加
    const body = await request.json(); // body を変数に格納
    console.log("API: Request body:", body); // 追加
    const { walletAddress } = body; // body から walletAddress を取得

    if (!walletAddress) {
      console.log("API: Wallet address is missing"); // 追加
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    console.log("API: Searching for user with walletAddress:", walletAddress.toLowerCase()); // 追加
    let user = await prisma.user.findUnique({
      where: {
        walletAddress: walletAddress.toLowerCase(),
      },
    });
    console.log("API: User found:", user); // 追加

    if (!user) {
      console.log("API: Creating new user"); // 追加
      user = await prisma.user.create({
        data: {
          walletAddress: walletAddress.toLowerCase(),
          // Other fields like email, name can be added later if needed
        },
      });
      console.log("API: New user created:", user); // 追加
      return NextResponse.json({ message: 'User signed up successfully', user }, { status: 201 });
    } else {
      console.log("API: User logged in"); // 追加
      return NextResponse.json({ message: 'User logged in successfully', user }, { status: 200 });
    }
  } catch (error) {
    console.error('API Error caught in catch block:', error); // 変更
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}