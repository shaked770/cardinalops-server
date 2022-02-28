import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from './mongo/mongo.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    ReportModule,
    MongoModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
