import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const params = new URLSearchParams(searchParams);
    
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/products?${params.toString()}`;
    console.log('Fazendo requisição para:', apiUrl);
    
    // Envia a requisição para o backend
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error('Erro na resposta da API:', response.status, response.statusText);
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || 'Falha ao buscar produtos' }, 
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('Dados recebidos da API:', JSON.stringify(data));
    
    // Retorna os dados no mesmo formato que o backend
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json(
      { message: 'Erro interno no servidor' }, 
      { status: 500 }
    );
  }
} 