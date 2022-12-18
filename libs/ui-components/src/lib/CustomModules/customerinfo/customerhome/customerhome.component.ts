import { Component, Input, OnInit } from '@angular/core';
import { CustomerInfoloaderService } from '../customer-infoloader.service';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'portal-customerhome',
  templateUrl: './customerhome.component.html',
  styleUrls: ['./customerhome.component.scss']
})
export class CustomerhomeComponent implements OnInit {

  public requestorData!: any;
  public _form!: FormGroup;

  // @Input()
  // requestorInfo!: any;

  // @Input() 
  // formGroup!: FormGroup;  

  constructor(
    private customerInfoloaderService: CustomerInfoloaderService 
    ) {}

  async executeOnInitProcesses(){ 
    this.requestorData = this.customerInfoloaderService.gridInfo.requestorInfo;
    this._form = this.customerInfoloaderService.gridInfo.formGroup;
  }

  ngOnInit(): void {
    this.executeOnInitProcesses();
  }

}

