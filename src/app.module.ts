import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';  // 修改导入的 ORM 模块
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({  // 使用 TypeORM 的配置方法
            type: 'mysql',          // 注意这里使用 type 替代 dialect
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '', 10), // 建议加上进制参数
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            charset: "utf8mb4",
            synchronize: true,      // 保持与之前相同的同步行为
        }),
        UserModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
