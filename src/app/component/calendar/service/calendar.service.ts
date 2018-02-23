import { Injectable } from '@angular/core';
import months from './months';

@Injectable()
export class CalendarService {

  constructor() { }

  getCalendarDays(year, month): Array<Array<number>> {
    const date = new Date(year, month, 1);
    const dayArray = [[]];

    for (let day = 1, weekNumber = 0; date.getMonth() === month; day++, date.setDate(day)) {
      const dayIndex = date.getDay();
      if (dayArray[weekNumber].length === 7) {
        dayArray.push([]);
        weekNumber++;
      }

      dayArray[weekNumber][dayIndex] = day;
    }

    const weekLength = dayArray.length;
    dayArray[weekLength - 1] = dayArray[weekLength - 1].concat(new Array(7 - dayArray[weekLength - 1].length));

    return dayArray;
  }

  getMonths(): Array<any> {
    return months;
  }
}
