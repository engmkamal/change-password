import { Injectable } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ControlContainer, FormGroupDirective } from '@angular/forms';

@Injectable({
  providedIn: 'any'
})
export class RequestorinfoloaderService {
  public gridInfo!: any;
  public _form!: FormGroup;

  constructor() { }
}