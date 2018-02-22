import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular 5';
  selectedDates;

  oreofe($event) {
    console.log('io')
    this.selectedDates = $event;
    console.log($event, 'pp')
  }
}
