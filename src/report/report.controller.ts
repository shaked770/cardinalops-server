import { Controller, Get, Query } from '@nestjs/common';
import { bucketSize } from '../types/bucketSize';
import { DatePipe } from '../pipes/date.pipe';
import { Report } from '../types';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  getReport(
    @Query('fromDate', DatePipe) fromDate?: Date,
    @Query('toDate', DatePipe) toDate?: Date,
    @Query('bucketSize') bucket?: bucketSize,
  ): Promise<Report[]> {
    return this.reportService.getReport(fromDate, toDate, bucket);
  }
}
