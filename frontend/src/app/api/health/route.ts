import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Verificar a conexão com a API backend
    const backendResponse = await fetch('http://localhost:3001/api', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const backendStatus = backendResponse.ok ? 'online' : 'offline';
    const backendData = await backendResponse.json().catch(() => null);

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      nextjs: {
        version: process.env.NEXT_PUBLIC_VERSION || 'unknown',
      },
      backend: {
        status: backendStatus,
        message: backendData || 'No response from backend',
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      backend: {
        status: 'offline',
        message: 'Failed to connect to backend',
      }
    }, { status: 500 });
  }
} 