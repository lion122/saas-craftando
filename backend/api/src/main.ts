import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitando CORS para o frontend
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'https://saas.craftando.com.br',
      /\.saas\.craftando\.com\.br$/, // Permite todos os subdomínios para as lojas dos tenants
    ],
    credentials: true,
  });
  
  // Configurando validação global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  
  // Configurando Swagger para documentação da API
  const config = new DocumentBuilder()
    .setTitle('E-commerce SaaS API')
    .setDescription('API para plataforma de e-commerce multi-tenant')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(process.env.BASE_URL || 'https://saas.craftando.com.br/api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  // Prefixo global para todas as rotas da API
  app.setGlobalPrefix('api');
  
  await app.listen(process.env.PORT || 3001);
  console.log(`Aplicação rodando em: ${await app.getUrl()}`);
}
bootstrap();
