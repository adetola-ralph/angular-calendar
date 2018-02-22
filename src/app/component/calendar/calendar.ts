import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import months from './months';

@Component({
  templateUrl: './calendar.html',
  selector: 'app-calendar',
  styleUrls: ['./calendar.scss'],
})
export class Calendar implements OnInit {

  @Input() multipleDates;
  @Input() limit;
  @Output() dateSelected = new EventEmitter();

  presentYear = new Date().getFullYear();
  // remember that month starts with 0
  presentMonth = new Date().getMonth();
  presentDay = new Date().getDate();
  visibleYear;
  visibleMonth;
  visibleDay;
  selectedDate: Date | Array<Date>;
  days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  months = months;
  multiple: boolean;

  constructor() {}

  ngOnInit() {
    this.multiple = this.multipleDates || false;
    this.visibleMonth = this.presentMonth;
    this.visibleYear = this.presentYear;
    this.visibleDay = this.presentDay;
    if (!this.multiple) {
      this.selectedDate = new Date(
        this.visibleYear,
        this.visibleMonth,
        this.visibleDay
      );
    } else {
      this.selectedDate = [];
      this.selectedDate.push(new Date(
        this.visibleYear,
        this.visibleMonth,
        this.visibleDay
      ));
    }
    
  }

  private get returnedYear(): number|string {
    return this.visibleYear || this.presentYear;
  }

  private get returnedMonth(): string {
    const monthIndex = (typeof this.visibleMonth === 'number') ? this.visibleMonth : this.presentMonth;
    return this.months[monthIndex].name;
  }

  private get returnedMonthIndex(): number|string {
    return (typeof this.visibleMonth === 'number') ? this.visibleMonth : this.presentMonth;;
  }

  private get returnMonthCalendarDays(): Array<Array<number>> {
    const year = this.returnedYear;
    const month = this.returnedMonthIndex;
    return this.getDays(year, month);
  }

  private getDays(year, month): Array<Array<number>> {
    const date = new Date(year, month, 1);
    let dayArray = [[]];

    for (let day = 1, weekNumber = 0; date.getMonth() === month; day++, date.setDate(day)) {
      const dayIndex = date.getDay();
      if (dayArray[weekNumber].length === 7) {
        dayArray.push([]);
        weekNumber++;
      }

      dayArray[weekNumber][dayIndex] = day;
    }

    return dayArray;
  }

  private previousMonth() {
    let month =
      (typeof this.visibleMonth === 'number') ? this.visibleMonth : this.presentMonth;
    let year = this.visibleYear ? this.visibleYear : this.presentYear;
    month = month - 1;

    if (month === -1) {
      this.visibleYear = year - 1;
      this.visibleMonth = 11;
    } else {
      this.visibleMonth = month;
    }
  }

  private nextMonth() {
    let month =
      (typeof this.visibleMonth === 'number') ? this.visibleMonth : this.presentMonth;
    let year = this.visibleYear ? this.visibleYear : this.presentYear;
    month = month + 1;

    if (month === 12) {
      this.visibleYear = year + 1;
      this.visibleMonth = 0;
    } else {
      this.visibleMonth = month;
    }
  }

  private selected(day) {
  if (!this.selectedDate) {
      return false;
    }

    if (this.multiple) {
      var index = this.selectedDate.findIndex((value) => {
        return day === value.getDate() && this.visibleMonth === value.getMonth() &&
        this.visibleYear === value.getFullYear()
      });
      return index !== -1;
    } else {
      return (
        day === this.selectedDate.getDate() &&
        this.visibleMonth === this.selectedDate.getMonth() &&
        this.visibleYear === this.selectedDate.getFullYear()
      );
    }
  }

  private select(day) {
    if (!day) {
      return;
    }

    if (this.multiple) {
      var index = this.selectedDate.findIndex((value) => {
        return day === value.getDate() && this.visibleMonth === value.getMonth() &&
        this.visibleYear === value.getFullYear()
      });
      
      if (index !== -1) {
        this.selectedDate.splice(index, 1);
        // this.dateSelected.emit(this.selectedDate);
        return;
      }
      
      if (this.limit && this.selectedDate.length === this.limit) {
        return;
      }

      const date = new Date(
        this.visibleYear,
        this.visibleMonth,
        day
      );

      this.selectedDate.push(date);
    } else {
      this.visibleDay = day;
      this.selectedDate = new Date(
        this.visibleYear,
        this.visibleMonth,
        this.visibleDay
      );
      this.visibleDay = day;
      this.selectedDate = new Date(
        this.visibleYear,
        this.visibleMonth,
        this.visibleDay
      );
    }

    this.dateSelected.emit(this.selectedDate);
  }

}
