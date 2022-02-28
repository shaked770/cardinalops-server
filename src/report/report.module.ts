import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { MongoModule } from '../mongo/mongo.module';
import { ReportRepository } from './report.repository';

@Module({
  imports: [MongoModule, ConfigModule],
  controllers: [ReportController],
  providers: [ReportService, ReportRepository],
})
export class ReportModule {}
