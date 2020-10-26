import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as csurf from 'csurf';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import * as compression from 'compression';

const { PORT, NODE_ENV } = process.env;

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['error', 'warn'],
  });
  app.setGlobalPrefix('v1');
  app.use(helmet());

  if(NODE_ENV === 'production') {
    app.use(csurf());
  }
  
  app.use(
    rateLimit({
      max: 100, // limit each IP to 100 requests per windowMs
      windowMs: 2 * 60 * 1000, // 2 minutes
    }),
  );
  app.use(compression());

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Traze Trip')
    .setDescription('Traze Trip Admin API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
  console.log(`App started at port ${PORT}`);
}

bootstrap();
