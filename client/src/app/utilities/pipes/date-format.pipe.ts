import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    let dateToFormat = new Date(value);
    let dateString = dateToFormat.getMonth() + '/' + dateToFormat.getDay() + '/' + dateToFormat.getFullYear();
    if (this.isToday(dateToFormat)) {
      dateString += ' ' + dateToFormat.getHours() + ':' + dateToFormat.getMinutes();
    }

    return dateString;
  }

  private isToday(date: Date): boolean {
    let now = new Date();
    return (date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDay() === now.getDay());
  }
}