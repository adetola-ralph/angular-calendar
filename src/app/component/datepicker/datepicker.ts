import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { DatePickerService } from './service/datepicker.service';

@Component({
  templateUrl: './datepicker.html',
  selector: 'app-datepicker',
  styleUrls: ['./datepicker.scss'],
  providers: [DatePickerService]
})
export class DatePickerComponent implements OnInit {

  // input for enabling multiple date selection
  @Input() multipleDates;

  // multiple date selection limit
  @Input() limit;

  // for limiting the dates that can be selected
  @Input() minDate;
  @Input() maxDate;

  // emits selected date(s) value
  @Output() dateSelected = new EventEmitter();

  presentYear = new Date().getFullYear();
  // remember that month starts with 0
  presentMonth = new Date().getMonth();
  presentDay = new Date().getDate();
  visibleYear;
  visibleMonth;
  visibleDay;
  selectedDate;
  days = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
  multiple: boolean;
  months;

  // for decades
  presentDecadeStart = Math.floor(this.presentYear / 10) * 10;
  visibleDecadeStart;

  mode = [
    'calendar',
    'month',
    'decade',
  ];
  selectedMode = 0;

  constructor(
    private datePickerService: DatePickerService,
  ) {}

  ngOnInit() {
    this.months = this.datePickerService.getMonths();
    this.multiple = this.multipleDates || false;
    this.visibleMonth = this.presentMonth;
    this.visibleYear = this.presentYear;
    this.visibleDay = this.presentDay;
    this.visibleDecadeStart = this.presentDecadeStart;
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
    return (typeof this.visibleMonth === 'number') ? this.visibleMonth : this.presentMonth;
  }

  private get returnMonthCalendarDays(): Array<Array<number>> {
    const year = this.returnedYear;
    const month = this.returnedMonthIndex;
    return this.datePickerService.getCalendarDays(year, month);
  }

  private get returnedDecadeStart() {
    return this.visibleDecadeStart || this.presentDecadeStart;
  }

  private get returnedDecadeList() {
    return this.datePickerService.getDecade(this.returnedDecadeStart);
  }

  private previousMonth() {
    let month =
      (typeof this.visibleMonth === 'number') ? this.visibleMonth : this.presentMonth;
    const year = this.visibleYear ? this.visibleYear : this.presentYear;
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
    const year = this.visibleYear ? this.visibleYear : this.presentYear;
    month = month + 1;

    if (month === 12) {
      this.visibleYear = year + 1;
      this.visibleMonth = 0;
    } else {
      this.visibleMonth = month;
    }
  }

  private nextYear() {
    let year = this.visibleYear || this.presentYear;
    year++;
    this.visibleYear = year;
  }

  private previousYear() {
    let year = this.visibleYear || this.presentYear;
    year--;
    this.visibleYear = year;
  }

  private previousDecade() {
    let decadeStart = this.visibleDecadeStart || this.presentDecadeStart;
    decadeStart -= 10;
    this.visibleDecadeStart = decadeStart;
  }

  private nextDecade() {
    let decadeStart = this.visibleDecadeStart || this.presentDecadeStart;
    decadeStart += 10;
    this.visibleDecadeStart = decadeStart;
  }

  private previous() {
    if (this.mode[this.selectedMode] === 'calendar') {
      this.previousMonth();
    } else if (this.mode[this.selectedMode] === 'month') {
      this.previousYear();
    } else if (this.mode[this.selectedMode] === 'decade') {
      this.previousDecade();
    }
  }

  private next() {
    if (this.mode[this.selectedMode] === 'calendar') {
      this.nextMonth();
    } else if (this.mode[this.selectedMode] === 'month') {
      this.nextYear();
    } else if (this.mode[this.selectedMode] === 'decade') {
      this.nextDecade();
    }
  }

  private selectedDay(day) {
    if (!this.selectedDate) {
      return false;
    }
    if (this.multiple) {
      const index = this.selectedDate.findIndex((value) => {
        return day === value.getDate() && this.visibleMonth === value.getMonth() &&
        this.visibleYear === value.getFullYear();
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
      const index = this.selectedDate.findIndex((value) => {
        return day === value.getDate() && this.visibleMonth === value.getMonth() &&
        this.visibleYear === value.getFullYear();
      });

      if (index !== -1) {
        this.selectedDate.splice(index, 1);
        this.dateSelected.emit(this.selectedDate);
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
    }

    this.dateSelected.emit(this.selectedDate);
  }

  private selectedMonth(month) {
    if (!this.selectedDate) {
      return false;
    }

    if (!this.multiple) {
      return (
        month === this.selectedDate.getMonth() &&
        this.visibleYear === this.selectedDate.getFullYear()
      );
    }
  }
  private selectedYear(year) {
    if (!this.selectedDate) {
      return false;
    }

    if (!this.multiple) {
      return (
        year === this.selectedDate.getFullYear()
      );
    }
  }

  private selectMonth(month) {
    this.visibleMonth = month;

    if (!this.multiple) {
      this.selectedDate = new Date(
        this.visibleYear,
        this.visibleMonth,
        this.visibleDay
      );
    }

    this.selectedMode = 0;
  }

  private selectYear(year) {
    this.visibleYear = year;

    if (!this.multiple) {
      this.selectedDate = new Date(
        this.visibleYear,
        this.visibleMonth,
        this.visibleDay
      );
    }

    this.selectedMode = 1;
  }

  private switchMode() {
    let mode = this.selectedMode;
    mode++;
    if (mode !== this.mode.length) {
      this.selectedMode = mode;
    }
  }

}
