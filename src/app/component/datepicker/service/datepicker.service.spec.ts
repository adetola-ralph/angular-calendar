import { TestBed } from '@angular/core/testing';

import { DatePickerService } from './datepicker.service';

let service: DatePickerService;
describe('Date Picker service', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatePickerService]
    });
  });

  beforeEach(() => {
    service = TestBed.get(DatePickerService);
  });

  it('should return an array of months', () => {
    const months = service.getMonths();
    expect(months.length).toBe(12);
    expect(months).toContain({
      name: 'july',
      shortName: 'jul',
      index: 7
    });
  });

  it('should return decade range from year', () => {
    const decadeRange = service.getDecade(1870);
    expect(decadeRange.length).toBe(10);
    expect(decadeRange).toEqual(
      [
        1870,
        1871,
        1872,
        1873,
        1874,
        1875,
        1876,
        1877,
        1878,
        1879,
      ]
    );
  });

  it('checkMinAndMaxDate should throw an error if minDate is empty', () => {
    const method = service.checkMinAndMaxDate;
    expect(() => { method(null, new Date(2018, 4, 1)); }).toThrowError('Please enter minDate');
  });

  it('checkMinAndMaxDate should throw an error if maxDate is empty', () => {
    const method = service.checkMinAndMaxDate;
    expect(() => { method(new Date(2018, 4, 1), null); }).toThrowError('Please enter maxDate');
  });

  it('checkMinAndMaxDate should throw an error if maxDate is less than minDate', () => {
    const method = service.checkMinAndMaxDate;
    expect(() => { method(new Date(2018, 4, 1), new Date(2017, 4, 1)); })
      .toThrowError(`maxDate can't be less than minDate`);
  });

  it('checkMinAndMaxDate should return nothing if all is well', () => {
    const method = service.checkMinAndMaxDate;
    expect(method(new Date(2018, 4, 1), new Date(2019, 4, 1)))
      .toBeUndefined();
  });

  it('dateMinMaxCompare should return false if date is between min and max', () => {
    const result = service.dateMinMaxCompare(
      new Date(2018, 4, 11),
      new Date(2018, 4, 1),
      new Date(2018, 4, 30),
    );

    expect(result).toBe(false);
  });

  it('dateMinMaxCompare should return true if date is less than min', () => {
    const result = service.dateMinMaxCompare(
      new Date(2018, 3, 11),
      new Date(2018, 4, 1),
      new Date(2018, 4, 30),
    );

    expect(result).toBe(true);
  });

  it('dateMinMaxCompare should return true if date is greater than max', () => {
    const result = service.dateMinMaxCompare(
      new Date(2018, 5, 11),
      new Date(2018, 4, 1),
      new Date(2018, 4, 30),
    );

    expect(result).toBe(true);
  });

  it('checkDateInput should throw error if dateInput is greater than max', () => {
    expect(() => {
      service.checkDateInput(
        new Date(2018, 5, 11),
        new Date(2018, 4, 1),
        new Date(2018, 4, 30),
      );
    }).toThrowError(`dateInput can't be greater than maxDate or lesser than minDate`);
  });

  it('checkDateInput should throw error if dateInput is less than min', () => {
    expect(() => {
      service.checkDateInput(
        new Date(2018, 3, 11),
        new Date(2018, 4, 1),
        new Date(2018, 4, 30),
      );
    }).toThrowError(`dateInput can't be greater than maxDate or lesser than minDate`);
  });

  it('checkDateInput should throw error if date in dateInput array is less than min', () => {
    expect(() => {
      service.checkDateInput(
        [new Date(2018, 4, 11), new Date(2018, 3, 11)],
        new Date(2018, 4, 1),
        new Date(2018, 4, 30),
      );
    }).toThrowError(`Values in dateInput can't be greater than maxDate or lesser than minDate`);
  });

  it('checkDateInput should throw error if date in dateInput array is greate than max', () => {
    expect(() => {
      service.checkDateInput(
        [new Date(2018, 4, 11), new Date(2018, 5, 11)],
        new Date(2018, 4, 1),
        new Date(2018, 4, 30),
      );
    }).toThrowError(`Values in dateInput can't be greater than maxDate or lesser than minDate`);
  });
});
