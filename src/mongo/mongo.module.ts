import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoClient, ServerApiVersion } from 'mongodb';

const connectionFactory = {
  provide: 'MONGO',
  useFactory: async (configService: ConfigService): Promise<MongoClient> => {
    const uri = `mongodb+srv://${configService.get(
      'DB_USER',
    )}:${configService.get('DB_PASSWORD')}@${configService.get(
      'CLUSTER',
    )}/${configService.get('DB')}?retryWrites=true&w=majority`;

    try {
      const client = await MongoClient.connect(uri, {
        serverApi: ServerApiVersion.v1,
      });

      return client;
    } catch (error) {
      console.error(
        'Error in Connecting to DB! error message: ' + error.message,
      );
      throw error;
    }
  },
  inject: [ConfigService],
};

@Module({
  imports: [ConfigModule],
  providers: [connectionFactory],
  exports: ['MONGO'],
})
export class MongoModule {}
