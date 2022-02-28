import { Injectable } from '@nestjs/common';
import { bucketSize, Report } from '../types';
import { ReportRepository } from './report.repository';

@Injectable()
export class ReportService {
  constructor(private reportRepository: ReportRepository) {}

  getReport(
    fromDate: Date,
    toDate: Date,
    bucket: bucketSize,
  ): Promise<Report[]> {
    const buckets: Date[] = this.getBucketsFromDates(fromDate, toDate, bucket);
    return this.reportRepository.getReport(fromDate, toDate, buckets);
  }

  private getBucketsFromDates(
    fromDate: Date,
    toDate: Date,
    bucket: string,
  ): Date[] {
    const daysSpan = bucket === 'day' ? 1 : 7;
    const buckets = [];
    let bucketDate = new Date(fromDate.getTime());

    while (bucketDate.getTime() < toDate.getTime()) {
      buckets.push(new Date(bucketDate.getTime()));
      bucketDate.setTime(bucketDate.getTime() + 86400000 * daysSpan);
    }

    buckets.push(toDate);

    return buckets;
  }
}
