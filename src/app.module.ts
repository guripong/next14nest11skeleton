import {
  // MiddlewareConsumer,  NestModule ,
  Module,
} from '@nestjs/common';
// import { ClientModule } from '@/modules/client/client.module';
// import { AuthModule } from '@/modules/auth/auth.module';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
// import { UsersModule } from '@/modules/users/users.module';
// import cookieParser from 'cookie-parser';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(cookieParser()).forRoutes('*');
//   }
// }
