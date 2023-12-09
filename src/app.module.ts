import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './modules/user/entities/user.entity';
import { ChecklistItem } from './modules/checklist/checklist-item.entity';
import { UserModule } from './modules/user/user.module';
import { CheckListModule } from './modules/checklist/checklist.module';
import { UserSeqMiddleware } from './middlewares/user-seq.middleware';
import { UserChecklist } from './modules/user/entities/user-checklist.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3308,
      username: 'root',
      password: '1234',
      database: 'mama-talk',
      entities: [UserEntity, ChecklistItem, UserChecklist],
      synchronize: true,
    }),
    UserModule,
    CheckListModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.gql'],
      autoSchemaFile: true,
      playground: true,
      context: ({ req }) => ({ req }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserSeqMiddleware).forRoutes('/');
  }
}
