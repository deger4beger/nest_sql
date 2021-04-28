import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm"
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { IdeasModule } from './ideas/ideas.module';
import { HttpErrorFilter } from './shared/httpError.filter';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { UserModule } from './user/user.module';
import { CommentsModule } from './comments/comments.module';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
    imports: [
        TypeOrmModule.forRoot(),
        GraphQLModule.forRoot({
            typePaths: ["./**/*.graphql"]
        }),
        IdeasModule,
        UserModule,
        CommentsModule
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpErrorFilter
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor
        }
    ]
})
export class AppModule {}
