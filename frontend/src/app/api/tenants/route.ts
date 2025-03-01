import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Autenticação necessária' }, 
        { status: 401 }
      );
    }
    
    // Envia a requisição para o backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Falha ao criar loja' }, 
        { status: response.status }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao criar loja:', error);
    return NextResponse.json(
      { message: 'Erro interno no servidor' }, 
      { status: 500 }
    );
  }
} 