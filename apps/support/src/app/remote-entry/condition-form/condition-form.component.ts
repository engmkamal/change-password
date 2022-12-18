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
  NG_VALUE_ACCESSOR
} from "@angular/forms";
//import { AppdataproviderService } from "@portal/shared/data-access-user";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

//import { ControlContainer, FormGroupDirective, FormControl } from '@angular/forms';

export interface ConditionFormComponentData {
  SampleID?: string;  
  SampleDescription?: string;
  Appearance?: string;
  ReferenceNo?: string;
  SampleType?: string;
  MaterialConstruction?: string;
  SampleQuantity?: string;
  SpecificRequirement?: string;
}

@Component({
  selector: 'portal-condition-form',
  templateUrl: './condition-form.component.html',
  styleUrls: ['./condition-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ConditionFormComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.Emulated
})
export class ConditionFormComponent implements ControlValueAccessor, OnDestroy, OnInit {
  // @Input()
  // formLabel: string | number = "Condition";

  @Input()
  formLabel: string | number = "Sample";

  @Output()
  remove: EventEmitter<void> = new EventEmitter<void>();

  @Input() requestInfo!: any;

  _form!: FormGroup;

  //sampleID;

  sampleInfo!:any;

  sampleTypes = [ "Solid", "Liquid", "Powder", "Paste", "Textile", "Painted Substance", "Others" ];

  @Input() formGroup: any;
  
  @Input()
  childGroup!: any;

  @Output() 
  outputToParent = new EventEmitter<any>();

  private _onChange!: (
    value: ConditionFormComponentData | null | undefined
  ) => void;

  private _destroy$: Subject<void> = new Subject<void>();
  appDataSubscription!: Subscription;

  _showDeleteAssigneeBtn = false;

  constructor(
    private _fb: FormBuilder,
    //private appdataproviderService: AppdataproviderService
    ) {}

  ngOnInit() {
    //this._createFormGroup();
    this._setupObservables();
  }

  ngOnDestroy() {
    if (this._destroy$ && !this._destroy$.closed) {
      this._destroy$.next();
      this._destroy$.complete();
    };

    this.appDataSubscription.unsubscribe();
  }

  writeValue(value: ConditionFormComponentData): void {
    if (!value) {
      return;
    }

    this._form.patchValue(value);
    this.sampleInfo = value;
    //this.sampleID = value.SampleID;
    //this._form.controls.SampleID.patchValue("value.SampleID");
  }
  registerOnChange(
    fn: (v: ConditionFormComponentData | null | undefined) => void
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
    this._form = this._fb.group({
      AssignedToName: ['', ""],
      AssignedToEmail: ['', ""],
      AssignedToDesignation: ['', ""]
    });
  }

  private _setupObservables() {
    this._form.valueChanges.pipe(takeUntil(this._destroy$)).subscribe(value => {
      if (this._onChange) {
        this._onChange(value);
      }
    });
  }

  showSmplLbl(){
    if(this.requestInfo.uId != ""){
      return true;
    }else{return false;}
  };

  _selectionAssignee(e:any){
    this.childGroup.controls.AssignedToEmail.patchValue(e.AssignedToEmail);
    this.childGroup.controls.AssignedToDesignation.patchValue(e.AssignedToDesignation);
  };

  GetOutputVal(e:any){
    this.outputToParent.emit(e);
  };
  
  ngAfterViewInit(){

    if (this.requestInfo.uId != "") {       

      if(this.requestInfo.Status == "UATRequest" ){
        this._showDeleteAssigneeBtn = false;
      }else if(this.requestInfo.Status == "UATFeedbackFrmCustomer" ){
        this._showDeleteAssigneeBtn = true;
      }else if(this.requestInfo.Status == "Submitted" ){
        this._showDeleteAssigneeBtn = true;
      }
    }

    // this.appDataSubscription = this.appdataproviderService.appData$.subscribe((res:any) => {
    //   if (res.uId != "") {       

    //     if(res.Status == "UATRequest" ){
    //       this._showDeleteAssigneeBtn = false;
    //     }else if(res.Status == "UATFeedbackFrmCustomer" ){
    //       this._showDeleteAssigneeBtn = true;
    //     }
    //   }
    // });
  };

}

