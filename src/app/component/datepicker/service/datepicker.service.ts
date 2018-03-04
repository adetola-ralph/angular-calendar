import { Injectable } from '@angular/core';
import months from './months';

@Injectable()
export class DatePickerService {

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

  getDecade(year): Array<number> {
    const range = [year];
    for (let i = 1; i < 10; i++) {
      const newYear = year + i;
      range.push(newYear);
    }

    return range;
  }

  checkMinAndMaxDate(min, max) {
    if ((min ? !max : max)) {
      const missingInput = !!max ? 'minDate' : 'maxDate';
      throw new Error(`Please enter ${missingInput}`);
    }

    if (min && max && min.getTime() === max.getTime()) {
      throw new Error('minDate cannot be same with maxDate');
    }
  }

  checkDateInput(dateInput, min, max) {
    if (!dateInput || !(min && max)) {
      return;
    }

    if (!Array.isArray(dateInput) && this.dateMinMaxCompare(dateInput, min, max)) {
      throw new Error(`dateInput can't be greater than maxDate or lesser than minDate`);
    }

    if (Array.isArray(dateInput)) {
      const res = dateInput.some((value) => {
        return !(value.getTime() >= min.getTime() &&
          value.getTime() <= max.getTime());
      });

      if (res) {
        throw new Error(`Values in dateInput can't be greater than maxDate or lesser than minDate`);
      }
    }
  }

  dateMinMaxCompare(date, min, max): boolean {
    if (min && max) {
      return !(date.getTime() >= min.getTime() &&
        date.getTime() <= max.getTime());
    }
  }
}
