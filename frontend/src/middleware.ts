import { NextRequest, NextResponse } from 'next/server';

// Usar a variável de ambiente diretamente
const MAIN_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'saas.craftando.com.br';

export default function middleware(request: NextRequest) {
  const { pathname, search, hostname } = request.nextUrl;
  
  // Considerar o host atual como tenant se não for o domínio principal
  // ou localhost (em desenvolvimento)
  const isTenantSubdomain = 
    hostname !== MAIN_DOMAIN && 
    hostname !== 'localhost' && 
    hostname.includes('saas.craftando.com.br');
  
  // Para subdomínios de tenant, redirecionar para a página da loja
  if (isTenantSubdomain) {
    // Extrair o slug do tenant a partir do hostname
    const slug = hostname.split('.')[0];
    
    // Se estamos tentando acessar uma rota de admin ou auth em um subdomínio,
    // redirecionamos para o domínio principal
    if (pathname.startsWith('/admin') || pathname.startsWith('/auth')) {
      const url = request.nextUrl.clone();
      url.hostname = MAIN_DOMAIN;
      return NextResponse.redirect(url);
    }
    
    // Verificar se já estamos em uma rota de loja
    if (pathname.startsWith(`/stores/${slug}`)) {
      return NextResponse.next();
    }
    
    // Redirecionar para a página da loja usando o padrão /stores/[slug]
    const url = request.nextUrl.clone();
    url.pathname = `/stores/${slug}${pathname}`;
    return NextResponse.rewrite(url);
  }
  
  // No domínio principal, permita o acesso normal
  return NextResponse.next();
}

// Especifica em quais caminhos este middleware deve ser executado
export const config = {
  matcher: [
    // Caminhos para aplicar o middleware (praticamente todos)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 