import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  AppdataproviderService,
  LoginService, 
  //LoggeduserinfoService, 
  //UserService 
} from '@portal/shared/data-access-user';

@Component({
  selector: 'portal-loginform',
  templateUrl: './loginform.component.html',
  styleUrls: ['./loginform.component.scss']
})
export class LoginformComponent implements OnInit {
  userName = '';
  customerId = '';
  password = '';

  loginFormGroup!:FormGroup;

  panelOpenState = true;

  _swCustLoginfrm = true;
  _swEmpLoginfrm = false;

  
  uId = "";

  constructor(
    private formBuilder: FormBuilder, 
    //private userService: UserService,
    private _loginService: LoginService,
    //private _appdataproviderService: AppdataproviderService,
    private router: Router) { }

  ngOnInit(): void {

    this.loginFormGroup = this.formBuilder.group({

      Customer: this.formBuilder.group({
        CustId: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(8)])],
        CustPassword: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(8)])],
      }),
      
      Employee: this.formBuilder.group({
        EmpId: [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(8)])],
        EmpEmail: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      }),

    });

  };

 

  login(): void {
    //this._appdataproviderService.checkCredentials(this.loginFormGroup.value.Customer.CustId, this.loginFormGroup.value.Customer.CustPassword);
    this._loginService.checkCredentials(this.loginFormGroup.value.Customer.CustId, this.loginFormGroup.value.Customer.CustPassword);
  }

  logout(): void {
    //this._appdataproviderService.logout();
    this._loginService.logout();
  };

  showEmployeeloginForm(){
    this._swCustLoginfrm = false;
    this._swEmpLoginfrm = true;
  }

  loginAsEmployee(){ 
    
    let empEmail = this.loginFormGroup.value.Employee.EmpEmail;
    let empId = this.loginFormGroup.value.Employee.EmpId;
    this._loginService.loginAsEmployee(empEmail, empId );
    
  }

  // ngOnDestroy(){
  //   this.appDataSubscription.unsubscribe();
  // };



}


