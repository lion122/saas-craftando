/** @type {import('next').NextConfig} */
const nextConfig = {
  // Desativar ESLint e verificação de tipos durante o build para produção
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Configuração de imagens para permitir domínios externos
  images: {
    domains: [
      'saas.craftando.com.br',
      'localhost',
      'res.cloudinary.com', // Se usar Cloudinary para armazenamento de imagens
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.saas.craftando.com.br',
      },
    ],
  },

  // Configuração de domínios para tenants (lojas)
  async rewrites() {
    return [
      // Redireciona requisições de subdomínios para a página da loja
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: '(?<slug>[a-z0-9-]+).saas.craftando.com.br',
          },
        ],
        destination: '/stores/:slug/:path*',
      },
    ];
  },

  // Configuração CORS
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig; 