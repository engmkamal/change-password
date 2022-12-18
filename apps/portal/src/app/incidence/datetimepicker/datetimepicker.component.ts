import { Component, VERSION, NgZone, OnInit, ViewChild, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import * as moment from 'moment';
//import moment from 'moment';
//import * as _moment from 'moment';
//const moment = _moment;

import { ThemePalette } from '@angular/material/core';
import { NgxMatDatetimePicker } from '@angular-material-components/datetime-picker';

//https://stackblitz.com/edit/demo-ngx-mat-datetime-picker?file=src%2Fapp%2Fapp.component.html
@Component({
  selector: 'portal-datetimepicker',
   templateUrl: './datetimepicker.component.html',
   styleUrls: ['./datetimepicker.component.scss'],
})
export class DatetimepickerComponent {
  @ViewChild('picker') picker: any;
  //   @ViewChild('picker', {read: ElementRef}) private _pickerPanelOrigin: ElementRef;
  public date: moment.Moment | any; // moment.Moment; any
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public minDate: moment.Moment | any; // moment.Moment; any
  public maxDate: moment.Moment | any; // moment.Moment; any
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';

  // public formGroup = new FormGroup({
  //   date: new FormControl(null, [Validators.required]),
  //   date2: new FormControl(null, [Validators.required]),
  // });
  public dateControl = new FormControl(new Date());
  public dateControlMinMax = new FormControl(new Date());

  public options = [
    { value: true, label: 'True' },
    { value: false, label: 'False' },
  ];

  public listColors = ['primary', 'accent', 'warn'];

  public stepHours = [1, 2, 3, 4, 5];
  public stepMinutes = [1, 5, 10, 15, 20, 25];
  public stepSeconds = [1, 5, 10, 15, 20, 25];

  public codeDatePicker = `
<mat-form-field>
  <input matInput [ngxMatDatetimePicker]="picker" 
                  placeholder="Choose a date" 
                  [formControl]="dateControl"
                  [min]="minDate" [max]="maxDate" 
                  [disabled]="disabled">
  <mat-datepicker-toggle matSuffix [for]="picker">
  </mat-datepicker-toggle>
  <ngx-mat-datetime-picker #picker 
    [showSpinners]="showSpinners" 
    [showSeconds]="showSeconds"
    [stepHour]="stepHour" [stepMinute]="stepMinute" 
    [stepSecond]="stepSecond"
    [touchUi]="touchUi"
    [color]="color">
  </ngx-mat-datetime-picker>
</mat-form-field>`;

  public codeTimePicker = `
<ngx-mat-timepicker 
            [(ngModel)]="date" [disabled]="disabled" 
            [showSpinners]="showSpinners"
            [stepHour]="stepHour" [stepMinute]="stepMinute" 
            [stepSecond]="stepSecond" 
            [showSeconds]="showSeconds">
</ngx-mat-timepicker>`;

  public codeFormGroup = `
  <div [formGroup]="formGroup">
    <mat-form-field>
      <input matInput [ngxMatDatetimePicker]="picker1" 
      placeholder="Choose a date" formControlName="date">
      <mat-datepicker-toggle matSuffix [for]="picker1"></mat-datepicker-toggle>
      <ngx-mat-datetime-picker #picker1></ngx-mat-datetime-picker>
    </mat-form-field>
  </div>`;

  public code1 = `formGroup.get('date').value?.toLocaleString()`;

  public codeFormGroup2 = `
  <form [formGroup]="formGroup">
    <ngx-mat-timepicker formControlName="date2"></ngx-mat-timepicker>
  </form>`;

  public code2 = `formGroup.get('date2').value?.toLocaleString()`;

  name = 'Angular ' + VERSION.major;

  @Input()
  formGroup!: any

  @Input()
  formControlName!: any;

  @Input()
  dateInfo!: any;

  constructor(
    //private http: HttpClient,
    //private zone: NgZone,
    public _domSanitizer: DomSanitizer,
    public matIconRegistry: MatIconRegistry
  ) {
    const THUMBUP_ICON =
      `
      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.` +
      `44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5` +
      `1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"/>
      </svg>
    `;
    //this.matIconRegistry.addSvgIcon(`done`, `path_to_custom_icon.svg`);
    matIconRegistry.addSvgIconLiteral(
      'done',
      _domSanitizer.bypassSecurityTrustHtml(THUMBUP_ICON)
    );
  }
  //public static Now = (): _moment.Moment => moment();
  ngOnInit() {
    this.date = new Date();
    //this.date = moment(new Date(2021, 9, 4, 5, 6, 7)); //.format("YYYY-MM-DD HH:mm:ss");
  }
  toggleMinDate(evt: any) {
    if (evt.checked) {
      this._setMinDate();
    } else {
      this.minDate = null;
    }
  }

  toggleMaxDate(evt: any) {
    if (evt.checked) {
      this._setMaxDate();
    } else {
      this.maxDate = null;
    }
  }

  closePicker() {
    this.picker.cancel();
  }

  private _setMinDate() {
    const now = new Date();
    this.minDate = new Date();
    this.minDate.setDate(now.getDate() - 1);
  }

  private _setMaxDate() {
    const now = new Date();
    this.maxDate = new Date();
    this.maxDate.setDate(now.getDate() + 1);
  }
}
