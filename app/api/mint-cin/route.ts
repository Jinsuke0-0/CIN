import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import CINTokenABI from '@/lib/abi/CINToken.json';

const CIN_TOKEN_ADDRESS = "0xD6533D9b1705c01D048D8CcA087F0426d1A09d08";
const MINT_AMOUNT = ethers.parseUnits("50", 18); // 50 CIN with 18 decimals

export async function POST(request: Request) {
  try {
    const { userAddress } = await request.json();

    if (!userAddress || !ethers.isAddress(userAddress)) {
      return NextResponse.json({ error: 'Invalid user address' }, { status: 400 });
    }

    const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('TOKEN_OWNER_PRIVATE_KEY is not set in environment variables');
    }

    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://127.0.0.1:8545'); // Use your RPC URL
    const wallet = new ethers.Wallet(privateKey, provider);
    const tokenContract = new ethers.Contract(CIN_TOKEN_ADDRESS, CINTokenABI.abi, wallet);

    // Mint tokens to the new user
    const tx = await tokenContract.mint(userAddress, MINT_AMOUNT);
    await tx.wait(); // Wait for the transaction to be mined

    return NextResponse.json({ message: 'CIN minted successfully', transactionHash: tx.hash });
  } catch (error: any) {
    console.error('Minting failed:', error);
    return NextResponse.json({ error: error.message || 'Minting failed' }, { status: 500 });
  }
}
