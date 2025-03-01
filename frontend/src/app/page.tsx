import Link from "next/link";
import { ArrowRight, ShoppingBag, BarChart, Globe, CreditCard, Users, Settings } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">CraftandoSaaS</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/login" 
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Entrar
              </Link>
              <Link 
                href="/auth/register" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Criar Conta
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Crie e gerencie sua loja virtual em minutos
              </h1>
              <p className="text-lg mb-8 text-indigo-100">
                Uma plataforma completa para você criar, personalizar e gerenciar sua loja virtual sem complicações. Venda mais e alcance mais clientes!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/auth/register" 
                  className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-md text-lg font-medium flex items-center justify-center"
                >
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  href="/pricing" 
                  className="border border-white text-white hover:bg-white hover:text-indigo-600 px-6 py-3 rounded-md text-lg font-medium flex items-center justify-center"
                >
                  Ver Planos
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="/hero-image.png" 
                alt="Dashboard da plataforma" 
                className="w-full rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tudo o que você precisa para vender online</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nossa plataforma oferece todas as ferramentas necessárias para criar, gerenciar e expandir sua loja virtual com facilidade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg">
              <Globe className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">Domínio Personalizado</h3>
              <p className="text-gray-600">Conecte seu próprio domínio ou utilize nossos subdomínios para sua loja.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <Settings className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">Personalização Total</h3>
              <p className="text-gray-600">Customize cores, fontes e layout para combinar com sua marca.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <CreditCard className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">Pagamentos Integrados</h3>
              <p className="text-gray-600">Aceite diversos métodos de pagamento com integração simples.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <BarChart className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">Relatórios Detalhados</h3>
              <p className="text-gray-600">Acompanhe vendas, visitas e comportamento dos clientes em tempo real.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <ShoppingBag className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">Gestão de Produtos</h3>
              <p className="text-gray-600">Gerencie inventário, variantes e preços com facilidade.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <Users className="h-12 w-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900">Multiusuários</h3>
              <p className="text-gray-600">Adicione membros da equipe com diferentes níveis de permissão.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Pronto para começar sua jornada?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Junte-se a milhares de empreendedores que já estão vendendo online com nossa plataforma.
          </p>
          <Link 
            href="/auth/register" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-md text-lg font-medium inline-block"
          >
            Criar Minha Loja
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <ShoppingBag className="h-6 w-6 text-indigo-400" />
                <span className="ml-2 text-xl font-bold">CraftandoSaaS</span>
              </div>
              <p className="text-gray-400">
                Plataforma completa para criação e gestão de lojas virtuais.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Produto</h3>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-gray-400 hover:text-white">Funcionalidades</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white">Preços</Link></li>
                <li><Link href="/showcase" className="text-gray-400 hover:text-white">Exemplos</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Empresa</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">Sobre nós</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contato</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Suporte</h3>
              <ul className="space-y-2">
                <li><Link href="/docs" className="text-gray-400 hover:text-white">Documentação</Link></li>
                <li><Link href="/help" className="text-gray-400 hover:text-white">Centro de Ajuda</Link></li>
                <li><Link href="/status" className="text-gray-400 hover:text-white">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} CraftandoSaaS. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
