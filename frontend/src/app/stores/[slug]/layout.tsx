import React from 'react';
import { api, API_URL } from '@/config/api';
import Link from 'next/link';

async function getStoreBySlug(slug: string) {
  try {
    // Usar fetch diretamente em vez da API do cliente para evitar problemas com localStorage no servidor
    const response = await fetch(`${API_URL}/tenants/slug/${slug}`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar loja: ${response.status}`);
    }
    const store = await response.json();
    return store;
  } catch (error) {
    console.error(`Erro ao buscar loja com slug ${slug}:`, error);
    return null;
  }
}

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const store = await getStoreBySlug(params.slug);

  if (!store) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Loja não encontrada</h1>
          <p className="mt-2 text-gray-600">A loja que você está procurando não existe ou foi removida.</p>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Cabeçalho da loja */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo da loja */}
              <Link href={`/stores/${params.slug}`} className="flex-shrink-0 flex items-center">
                {store.logo ? (
                  <img className="h-8 w-auto" src={store.logo} alt={store.name} />
                ) : (
                  <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
                    {store.name.substring(0, 1)}
                  </div>
                )}
                <span className="ml-2 text-lg font-semibold text-gray-900">{store.name}</span>
              </Link>

              {/* Menu de navegação principal */}
              <nav className="hidden md:ml-8 md:flex md:space-x-8">
                <Link href={`/stores/${params.slug}`} className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                  Início
                </Link>
                <Link href={`/stores/${params.slug}/produtos`} className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                  Produtos
                </Link>
                <Link href={`/stores/${params.slug}/categorias`} className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                  Categorias
                </Link>
                <Link href={`/stores/${params.slug}/sobre`} className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                  Sobre
                </Link>
                <Link href={`/stores/${params.slug}/contato`} className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                  Contato
                </Link>
              </nav>
            </div>

            {/* Botões de ação */}
            <div className="flex items-center">
              {/* Busca */}
              <div className="hidden md:block">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar produtos..."
                    className="w-64 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button className="absolute right-2 top-2 text-gray-400 hover:text-gray-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Botão de conta do usuário */}
              <div className="ml-4 relative">
                <button className="flex items-center text-gray-700 hover:text-gray-900">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="ml-1 hidden md:inline text-sm">Conta</span>
                </button>
              </div>

              {/* Carrinho de compras */}
              <div className="ml-4 relative">
                <button className="flex items-center text-gray-700 hover:text-gray-900">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span className="ml-1 hidden md:inline text-sm">Carrinho</span>
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    0
                  </span>
                </button>
              </div>

              {/* Botão de menu mobile */}
              <div className="ml-4 md:hidden">
                <button className="flex items-center text-gray-700 hover:text-gray-900">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Rodapé */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">{store.name}</h3>
              <p className="text-gray-300 text-sm">
                {store.description || `Bem-vindo à nossa loja online. Encontre os melhores produtos com os melhores preços.`}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Navegação</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>
                  <Link href={`/stores/${params.slug}`} className="hover:text-white">
                    Início
                  </Link>
                </li>
                <li>
                  <Link href={`/stores/${params.slug}/produtos`} className="hover:text-white">
                    Produtos
                  </Link>
                </li>
                <li>
                  <Link href={`/stores/${params.slug}/categorias`} className="hover:text-white">
                    Categorias
                  </Link>
                </li>
                <li>
                  <Link href={`/stores/${params.slug}/sobre`} className="hover:text-white">
                    Sobre
                  </Link>
                </li>
                <li>
                  <Link href={`/stores/${params.slug}/contato`} className="hover:text-white">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>
                  <Link href={`/stores/${params.slug}/politica-de-privacidade`} className="hover:text-white">
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link href={`/stores/${params.slug}/termos-de-uso`} className="hover:text-white">
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link href={`/stores/${params.slug}/devolucoes`} className="hover:text-white">
                    Política de Devoluções
                  </Link>
                </li>
                <li>
                  <Link href={`/stores/${params.slug}/faq`} className="hover:text-white">
                    Perguntas Frequentes
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                {store.email && (
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${store.email}`} className="hover:text-white">
                      {store.email}
                    </a>
                  </li>
                )}
                {store.phone && (
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${store.phone}`} className="hover:text-white">
                      {store.phone}
                    </a>
                  </li>
                )}
                {store.address && (
                  <li className="flex items-start">
                    <svg className="h-5 w-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{store.address}</span>
                  </li>
                )}
              </ul>

              <div className="mt-4 flex space-x-4">
                {store.socialMedia?.facebook && (
                  <a href={store.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                )}
                {store.socialMedia?.instagram && (
                  <a href={store.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                    <span className="sr-only">Instagram</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                )}
                {store.socialMedia?.twitter && (
                  <a href={store.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} {store.name}. Todos os direitos reservados.</p>
            <p className="mt-2">
              Powered by <a href="https://saas.craftando.com.br" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Craftando SaaS</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 