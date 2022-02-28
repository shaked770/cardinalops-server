import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Collection, MongoClient } from 'mongodb';
import { Report, Rule } from '../types';
import getReportAggregation from './queries/getReportAggregation';

@Injectable()
export class ReportRepository {
  constructor(
    @Inject('MONGO') private client: MongoClient,
    private configService: ConfigService,
  ) {}

  private get ruleCollection(): Collection<Rule> {
    return this.client
      .db(this.configService.get('DB'))
      .collection<Rule>(this.configService.get('TICKETS_COLLECTION'));
  }

  getReport(
    fromDate: Date,
    toDate: Date,
    timeBuckets: Date[],
  ): Promise<Report[]> {
    return this.ruleCollection
      .aggregate<Report>(
        getReportAggregation({ fromDate, toDate, timeBuckets }),
      )
      .toArray();
  }
}
