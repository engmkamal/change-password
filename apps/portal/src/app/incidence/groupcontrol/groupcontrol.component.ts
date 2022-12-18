import {
  Component,
  Input,
  forwardRef,
  Output,
  EventEmitter,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
  ViewEncapsulation
} from "@angular/core";
import {
  ControlContainer,
  FormGroup,
  FormBuilder,
  FormArray,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
  FormControlName
} from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ConditionFormComponentData } from "../condition-form/condition-form.component";

export interface GroupControlComponentData {
  Assignees?: ConditionFormComponentData[];
}

@Component({
  selector: 'portal-groupcontrol',
  templateUrl: './groupcontrol.component.html',
  styleUrls: ['./groupcontrol.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GroupcontrolComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.Emulated
})
export class GroupcontrolComponent implements ControlValueAccessor, OnDestroy, OnInit {
  @Input()
  formLabel: string | number = "Task & Assignee";

  @Input()
  formControlName!: FormControlName | any;

  @Input() requestInfo: any;

  @Output()
  remove: EventEmitter<void> = new EventEmitter<void>();

  _form!: FormGroup;

  @Input()
  formGroupName!: any;

  @Output() 
  outputToParent = new EventEmitter<any>();

  private _onChange!: (
    value: GroupControlComponentData | null | undefined
  ) => void;

  private _destroy$: Subject<void> = new Subject<void>();
  
  @Input()
  childForm!: any;

  constructor(
    private _fb: FormBuilder,
    private _controlContainer: ControlContainer) {}

  ngOnInit() {
    //this._createFormGroup();

    this._setupObservables();
  }

  ngOnDestroy() {
    if (this._destroy$ && !this._destroy$.closed) {
      this._destroy$.next();
      this._destroy$.complete();
    }
  }

  writeValue(value: GroupControlComponentData | null | undefined): void {
    if (!value) {
      return;
    }
    setTimeout(() => {
      if (value.Assignees?.length) {
        this._conditionsFormArray.clear();
        //value.Assignees.forEach(c => this._addCondition());
      }

      //this._form.patchValue(value);
    }, 50);
  }

  registerOnChange(
    fn: (value: GroupControlComponentData | null | undefined) => void
  ): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    // TODO: implement this method
    // throw new Error('registerOnTouched not implemented');
  }

  setDisabledState(isDisabled: boolean): void {
    // TODO: implement this method
    // throw new Error('setDisabledState not implemented');
  }

  _deleteCondition(index: number) {
    this._conditionsFormArray?.removeAt(index);
  }

  
//========= adding new Sample input fields with formControlName ======= 
  _addCondition() {

    let bfg = this._fb.group({      
      AssignedToName: ['', ""],
      AssignedToEmail: ['', ""],
      AssignedToDesignation: ['', ""]
    });    
    
    let frCtl = this.childForm.controls["Assignees"] as FormArray;

    frCtl.push(bfg); 

    setTimeout(() => {
      console.log("Form Value");
      console.log(this.childForm.value);
    }, 30000);
    
  }

  _deleteGroupFromArray(index: number) {
    this._groupsFormArray?.removeAt(index);
  }

  _addGroup() {
    // this._groupsFormArray?.push(
    //   this._fb.control({
    //     Assignees: [],
    //   })
    // );
  }

  get _conditionsFormArray(): FormArray {
    // let fc = this._form.get("Assignees") as FormArray;
    
    // return fc.get("AssignedTasks") as FormArray;
    return this.childForm.get("Assignees") as FormArray;
  }

  get _groupsFormArray(): FormArray {
    //return this._form.controls.AppParameters.controls.AssignedTasks as FormArray;
    return this._form.get("AppParameters") as FormArray;
  }

  

  private _createFormGroup() {
    // this._form = this._fb.group({
    //   AssignedTasks: this._fb.array([]),
    // });
    

    // // add one Sample on the next tick, after the form creation
    // setTimeout(() => this._addCondition());

    this._form = this._controlContainer.control as FormGroup;

    this._form = this._fb.group({      
      AssignedToName: ['', ""],
      AssignedToEmail: ['', ""],
      AssignedToDesignation: ['', ""]      
      //Assignees: this._fb.array([]),
    });

    // add one Sample on the next tick, after the form creation
    //setTimeout(() => this._addCondition());

    
  }

  private _setupObservables() {
    this._form.valueChanges.pipe(takeUntil(this._destroy$)).subscribe(value => {
      if (this._onChange) {
        this._onChange(value);
      }
    });
  };

  get _formControlNamePP(): FormControlName{
    return this.formControlName as FormControlName;
  };

  _pickUpTask(action:any, taskId:any){
    //yet to implement
  }

  GetOutputVal(e:any){
    if(e != ""){
      this.outputToParent.emit(e);
    }
  }
}

