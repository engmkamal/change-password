// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'portal-requestorhome',
//   templateUrl: './requestorhome.component.html',
//   styleUrls: ['./requestorhome.component.scss'],
// })
// export class RequestorhomeComponent implements OnInit {
//   constructor() {}

//   ngOnInit(): void {}
// }
//======================


import { Component, Input, OnInit } from '@angular/core';
import { RequestorinfoloaderService } from '../requestorinfoloader.service';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'portal-requestorhome',
  templateUrl: './requestorhome.component.html',
  styleUrls: ['./requestorhome.component.scss']
})
export class RequestorhomeComponent implements OnInit {

  public empData!: any;
  public _form!: FormGroup;

  // @Input()
  // requestorInfo!: any;

  // @Input() 
  // formGroup!: FormGroup;  

  constructor(
    private requestorinfoloaderService: RequestorinfoloaderService 
    ) {}

  async executeOnInitProcesses(){ 
    this.empData = this.requestorinfoloaderService.gridInfo.empInfo;
    this._form = this.requestorinfoloaderService.gridInfo.formGroup;
  }

  ngOnInit(): void {
    this.executeOnInitProcesses();
  }

}


