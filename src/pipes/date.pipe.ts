import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class DatePipe implements PipeTransform {
  transform(value: any, _) {
    return value ? new Date(+value) : value;
  }
}
