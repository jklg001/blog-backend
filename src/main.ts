import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // // 启用跨域配置
  // app.enableCors({
  //   origin: true, // 允许所有来源
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //   credentials: true, // 允许携带认证信息
  // });

  await app.listen(3002);
}
bootstrap();
