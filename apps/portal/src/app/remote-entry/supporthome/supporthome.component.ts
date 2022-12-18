import { Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs/operators';
import { 
  LoginService, 
  //UserService 
} from '@portal/shared/data-access-user';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { SharepointlistService } from '@portal/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Component({
  selector: 'portal-supporthome',
  templateUrl: './supporthome.component.html',
  styleUrls: ['./supporthome.component.scss'],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}
  ]
})
export class SupporthomeComponent implements OnInit {

  windowOrigin = window.location.origin;
  mobileQuery: MediaQueryList;      
  isCardExpanded = false; //== Mat Card ==
  private _mobileQueryListener: () => void;
  opened!: boolean;
  dragPosition = {x: 0, y: 0};
  requestInfo: any = {};

  _form!: FormGroup;

  requestorsInfo:any;

  isLoggedIn$ = this._loginService.isUserLoggedIn$;
  //isLoggedIn$ = this.userService.isUserLoggedIn$;
  showLoginFrm = false;

  nav_position = 'end';
  openedStartDrawer!: boolean;
  openedEndDrawer!: boolean;

  //---for mat card static data ---
  _matcardInfo = { 
    dragPosition: {x: 10, y: 10},
    divStyle: {
      resize: 'both',
      overflow: 'hidden',
      width: '340px',
      height: '300px',
      background: 'whitesmoke'//'#87AFC7'
    },
    matCardTitle: 'Info to identify a solution:',
    styleTitle:{
      textAlign: 'center', 
      color: 'navy',
      fontFamily:'Arial',
      fontWeight: 100,
      fontSize: '16px'
    }, 
    matCardSubtitle: 'Please provide some more details about your issue.',
    styleSubTitle:{
      textAlign: 'left', 
      color: 'black',
      fontFamily:'Arial',
      fontWeight: 80,
      fontSize: '12px'
    },
    matCardContent: '',
    styleContent:{
      textAlign: 'left', 
      color: 'gray',
      fontFamily:'Arial',
      fontWeight: 50,
      fontSize: '10px'
    },
    matCardImage: '',
    matCardActions: '',
    matCardFooter: '',
  };

  BergerEmpEmail = "";

  showEmpLoginFrm = false;

  constructor(
    private formBuilder: FormBuilder,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef,
    //private userService: UserService,
    private _loginService: LoginService,
    private sharepointlistService: SharepointlistService,
    private router: Router) {
      
      this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);   

      this.opened = false; //for open side nav onInit
      this.openedStartDrawer = false;
      this.openedEndDrawer = false;
    }

  ngOnInit(): void {
    //==============checking login authorization ===========
    if( localStorage.getItem('logedCustId') == null && localStorage.getItem('logedEmpEmail') == null){
      window.location.href = this.windowOrigin + '/login';         
    } 
    else {
      this.showLoginFrm = false;
    }
    
    // this.isLoggedIn$
    //   .pipe(distinctUntilChanged())
    //   .subscribe(async (loggedIn) => {
    //     if (!loggedIn) {
    //       window.location.href = this.windowOrigin + '/login';
    //       //this.router.navigate(['/login']);
          
    //     }else if( localStorage.getItem('logedCustId') == null && localStorage.getItem('logedEmpEmail') == null){
    //       window.location.href = this.windowOrigin + '/login';         
    //     } 
    //     else {
    //       this.showLoginFrm = false;
    //     }
    //   });  
    //---------------------------
    this._createForm();    

    this.requestorsInfo = {
      EmployeeName: '',
      Company: '',
      EmployeeId: '',
      OfficeLocation: '',
      Designation: '',
      Department: '',
      Email: '',
      CostCenter: '',
      Mobile: '',
      RequestDate: ''
    };


    //----------for mat card------
    
    this.requestInfo = {
      uId: "",
      readMode: "",
      Status: "",
      MatcardInfo: this._matcardInfo 
    };

    //this.openAsBergerEmp();
  }

  private _createForm() {
    this._form = this.formBuilder.group({
        TestParameters: this.formBuilder.array([])
    });
  }

  ddlChangeSelection(e:any){    
    //this.openedStartDrawer = true;
    this.openedEndDrawer = true;
  }

  GetOutputVal(valFrmChild: any) {
    console.log("");
  }

  loginAsEmployee(){
    //window.location.href = `https://bergerpaintsbd.sharepoint.com/sites/BergerTech/closeConnection.aspx?loginasanotheruser=true&source=/SitePages/bergertechportal.aspx`;
    
    this.showLoginFrm = !this.showLoginFrm;

    this.showEmpLoginFrm = true;
  }

  openAsBergerEmp(){
    this.sharepointlistService.getEmpIdNdAllInfo().then((res) => {
      // EmployeeName: "",
      // Office: "",
      // EmpID:"",
      // ADId: 0,
      // Email: ""

      if(res){
        this.showLoginFrm = false;

        this._loginService.isUserLoggedIn$ = new Observable((observer)=>{
          observer.next(true);
        })

        this._loginService.userName = res.EmployeeName;

        // this.userService.isUserLoggedIn$ = new Observable((observer)=>{
        //   observer.next(true);
        // })

        // this.userService.userName = res.EmployeeName;
      }

      
    })
  };

  onLogout(){
    this._loginService.logout();
    this.showLoginFrm = true;
  };

  loginAsBrgrEmp(empEmail:any){

    this._loginService.logout();

    localStorage.setItem('logedBrgrEmpEmail', empEmail);   
    this.showLoginFrm = true;

  };

  GetMenueOutputVal(pageUrl:any){
    window.location.href = this.windowOrigin + pageUrl ;
  }

  
}



