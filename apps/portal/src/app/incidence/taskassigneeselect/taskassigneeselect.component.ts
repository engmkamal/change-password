
import {
  Component,
  OnDestroy,
  Input,
  Output,
  forwardRef,
  EventEmitter,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import {
  ControlValueAccessor,
  FormGroup,
  FormBuilder,
  NG_VALUE_ACCESSOR,
  FormControl,
  FormControlName,
  FormArray,
  ControlContainer,
  FormGroupDirective
} from "@angular/forms";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { NgxMatDatetimePicker } from '@angular-material-components/datetime-picker';


//import { testParametersGroupedMatrix } from '../data';


export interface TaskassigneeselectComponent {
  variable: any;
}

@Component({
  selector: 'portal-taskassigneeselect',
  templateUrl: './taskassigneeselect.component.html',
  styleUrls: ['./taskassigneeselect.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TaskassigneeselectComponent),
      multi: true
    }
  ],
  //encapsulation: ViewEncapsulation.Emulated
})
export class TaskassigneeselectComponent implements ControlValueAccessor, OnDestroy, OnInit {
  // @Input()
  // formLabel: string | number = "Condition";

  @Input()
  requestInfo: any;

  @Input()
  formLabel: string | number = "Sample";

  @Input()
  formGroup!: FormGroup;


  @Output()
  remove: EventEmitter<void> = new EventEmitter<void>();

  _form!: FormGroup;

  selectedTestMethod = "";
  sampleReq = "";
  requiredDay = "";
  //testParameters = testParametersGroupedMatrix;
  selectedTestTitle = '';
  webAbsoluteUrl = window.location.origin + "/leaveauto";

  _frmGrp!: FormArray;

  ExStartDateCtrl = 'ExpectedStartDate';
  ExEndCtrl = 'ExpectedEndDate';

  exStartDateInfo = {
    label: 'Expected Start Date',
    ExStartDateCtrl: 'ExpectedStartDate'
  };

  exEndDateInfo = {
    label: 'Expected Completion Date',
    ExStartDateCtrl: 'ExpectedEndDate'
  };

  private _onChange!: (
    value: TaskassigneeselectComponent | null | undefined
  ) => void;

  private _destroy$: Subject<void> = new Subject<void>();
  
  _taskId: any = "";
  _rowId: any = null;

  @Output() 
  outputToParent = new EventEmitter<any>();

  _swTaskIdFld = true;

  constructor(
    private _fb: FormBuilder,
    private controlContainer: ControlContainer,
    parent: FormGroupDirective 
    ) {
      //this.formGroup = parent.control;
     }

  ngOnInit() {

    if(this.formGroup != undefined){
      this._taskId = this.formGroup.value.TaskId; 
      this._rowId = this.formGroup.value.rowId;
    }

    if(this.formGroup.value.TaskId == ""){
      this._swTaskIdFld = false;
    }
    //this._frmGrp = this.controlContainer.control as FormArray;
    //this._createFormGroup();

    this._setupObservables();
  }

  ngOnDestroy() {
    if (this._destroy$ && !this._destroy$.closed) {
      this._destroy$.next();
      this._destroy$.complete();
    }
  }

  writeValue(value: TaskassigneeselectComponent): void {
    if (!value) {
      return;
    }

    this._form.patchValue(value);
  }
  registerOnChange(
    fn: (v: TaskassigneeselectComponent | null | undefined) => void
  ): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    // TODO: implement this method
    // throw new Error("registerOnTouched not implemented");
  }

  setDisabledState(isDisabled: boolean): void {
    // TODO: implement this method
    // throw new Error("setDisabledState not implemented");
  }

  private _createFormGroup() {
    this.formGroup.addControl('TaskId', this._fb.control(''));
    this.formGroup.addControl('TaskTitle', this._fb.control(''));
    this.formGroup.addControl('ExpectedStartDate', this._fb.control(''));
    this.formGroup.addControl('ExpectedEndDate', this._fb.control(''));
    this.formGroup.addControl('Assignees', this._fb.array([]));   
  };

  private _setupObservables() {
    this.formGroup.valueChanges.pipe(takeUntil(this._destroy$)).subscribe(value => {
      if (this._onChange) {
        this._onChange(value);
      }
    });
  }

  onTestParamSelect(event:any) {
    //====== uncomment for production environment ===
    // if((event.Respectives).some(approver => approver.RAdId == this.requestInfo.logedUserAdId)){
    //   alert("You are not allowed to request for any Test for which you are respnsible to prepare result !");
            
    //   setTimeout(function () {
    //     window.location.href = this.webAbsoluteUrl + '/SitePages/SampleTest.aspx';
    //   }, 4000);
    // }

    // this.selectedTestMethod = event.Method;
    // this.sampleReq = event.SampleReq;
    // this.requiredDay = event.RequiredDay;
  };

  get _conditionsFormArray(): FormArray {
    // let fc = this._form.get("Assignees") as FormArray;
    
    // return fc.get("AssignedTasks") as FormArray;
    return this.formGroup.get("Assignees") as FormArray;
  }



  GetOutputVal(e:any){
    this.outputToParent.emit(e);
  }
}
