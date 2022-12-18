import { MediaMatcher } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, HostListener } from '@angular/core';
import { from, of } from 'rxjs'; 
import { groupBy, map, mergeMap, reduce, toArray } from 'rxjs/operators';
import { SplistcrudService, BreakpointObserverService } from '@portal/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'



interface IWorkflow {
  ID:number;
  Category: string; 
  SubCategory: string; 
  PageURL: string; 
  ChildSubCategory: string;
  BgImage: string;
}

interface IDragPosition {
  x: number; 
  y: number;
}

interface IDivStyle {   
  resize: string;
  overflow: string;
  width: string;
  height: string;
  background: string;  
}

interface IStyleTitle{
  textAlign: string;
  color: string;
  fontFamily: string;
  fontWeight: number;
  fontSize: string;
}

interface IMatCard{   
    uId: string;
    readMode: string;
    Status: string;
    logedUserAdId: number;
    MatcardInfo: {            
      matCardTitle: string;
      matCardSubtitle: string;
      matCardContent: string;
      matCardImage: string;
      matCardActions: string;
      matCardFooter: string;
      divStyle: IDivStyle;
      styleTitle: IStyleTitle;
      dragPosition: IDragPosition;
      pageUrl: string;
    }
}


@Component({
  selector: 'portal-homemenus',
  templateUrl: './homemenus.component.html',
  styleUrls: ['./homemenus.component.scss'],
})
export class HomemenusComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('homeMenusDiv') homeMenusDiv!: ElementRef;

  currentBreakpoint = '';

  deviceWidth = 310;

  contentDivWidth = 310;

  mobileQuery: MediaQueryList;
  //fillerNav = Array.from({length: 50}, (_, i) => `Nav Sidebar Item ${i + 1}`);  
  isCardExpanded = false; //== Mat Card == 
  private _mobileQueryListener: () => void;
  wfDepartments:any[] =[];
  allWorkflows:any[] =[];  


  opened: boolean;

  private columnNo = 0;
  private rowNo = 0;

  dragPosition = {x: 0, y: 0};

  cardInfo: any = {};

  financeDept:any = {}; 

 
  cardInfo1: any = {};

  cardInfo4: any = {};

  cardInfo3: any = {};

  cardInfo5: any = {};

  cardInfo6: any = {};

  cardInfo7: any = {};

  cardInfo2: any = {};

  _matcardInfo = { 
    dragPosition: {x: 10, y: 10},
    divStyle: {
      resize: 'both',
      overflow: 'hidden',
      width: '200px',
      height: '100px',
      background: '#CC3B5D'
    },
    matCardTitle: 'Finance',
    matCardSubtitle: '11',
    matCardContent: '',
    matCardImage: '',
    matCardActions: '',
    matCardFooter: '',
  };

  _matcardInfo2 = { 
    dragPosition: {x: 380, y: 10},
    divStyle: {
      resize: 'both',
      overflow: 'hidden',
      width: '200px',
      height: '100px',
      background: '#D9AB29'
    },
    matCardTitle: 'Approval Flow',
    matCardSubtitle: '',
    matCardContent: '',
    matCardImage: '',
    matCardActions: '',
    matCardFooter: '',
  };

  _matcardInfo3 = { 
    dragPosition: {x: 750, y: 10},
    divStyle: {
      resize: 'both',
      overflow: 'hidden',
      width: '310px',
      height: '110px',
      background: 'purple'
    },
    matCardTitle: 'Dashboard',
    matCardSubtitle: '',
    matCardContent: '',
    matCardImage: '',
    matCardActions: '',
    matCardFooter: '',
  };
  
  groupedWorkflow$ = [];

  categorizedWorkflow:any[] = [];

  workflowSource: IWorkflow[] = [
    {      
      ID: 1, 
      Category: 'Report Incident', 
      SubCategory: 'Report Incident', 
      PageURL: 'support', 
      ChildSubCategory: 'Report Incident',
      BgImage: '../../../assets/homemenus/deshboard.png'     
    },
    {      
      ID: 2, 
      Category: 'View Incidents', 
      SubCategory: 'View Incidents', 
      PageURL: 'myrequests', 
      ChildSubCategory: 'View Incidents',
      BgImage: '../../../assets/homemenus/myIncidents.png'
    },
    {      
      ID: 3, 
      Category: 'Pending Tasks', 
      SubCategory: 'Fixed Asset Acquisition', 
      PageURL: 'pendings', 
      ChildSubCategory: 'Pending Tasks',
      BgImage: '../../../assets/homemenus/deshboard.png'
    },
    {      
      ID: 4, 
      Category: 'Task Delegation', 
      SubCategory: 'Task Delegation', 
      PageURL: 'delegation', 
      ChildSubCategory: 'Task Delegation',
      BgImage: '../../../assets/homemenus/deshboard.png'
    },
    {      
      ID: 5, 
      Category: 'Support Request Dashboard', 
      SubCategory: 'Support Request Dashboard', 
      PageURL: 'supportdb', 
      ChildSubCategory: 'Support Request Dashboard',
      BgImage: '../../../assets/homemenus/deshboard.png'
    },
    {      
      ID: 6, 
      Category: 'Tasks Board', 
      SubCategory: 'Tasks Board', 
      PageURL: 'tasksboard', 
      ChildSubCategory: 'Tasks Board',
      BgImage: '../../../assets/homemenus/deshboard.png'
    },
    {      
      ID: 7, 
      Category: 'Edite System Data', 
      SubCategory: 'Edite System Data', 
      PageURL: 'systemdata', 
      ChildSubCategory: 'Edite System Data',
      BgImage: '../../../assets/homemenus/deshboard.png'
    },
    {      
      ID: 8, 
      Category: 'Change Password', 
      SubCategory: 'Change Password', 
      PageURL: 'changepass', 
      ChildSubCategory: 'Change Password',
      BgImage: '../../../assets/homemenus/deshboard.png'
    }
    
  ];

  workflows: IWorkflow[] = [];

  search = '';

  _logedUserAdId:any;

  listInfo = {
    name: "",
    select: "",
    expand: "",
    filterBy: "",
    filterWith: "",
    top: 1000
  };

  
  showDeptWiseWFDiv = false;
  showAllWFDiv = false;

  allWFsDivH = 600;

  //@ViewChild(DragndresizableComponent, {static : true}) child : DragndresizableComponent;

  public getScreenWidth: any;
  public getScreenHeight: any;
  
  // @HostListener('window:resize', ['$event'])
  // onWindowResize() {
  //   this.getScreenWidth = window.innerWidth;
  //   this.getScreenHeight = window.innerHeight;
  // }
  

  constructor(
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher, 
    private splistcrudService: SplistcrudService,
    private breakpointObserverService: BreakpointObserverService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);    

    this.opened = true; //for open side nav onInit
    
  }

  async ngOnInit() {
    

    const divStyle = {
      resize: 'both',
      overflow: 'auto',
      width: '310px',
      height: '350px',
    };

    //this._matcardInfo.divStyle = divStyle;

    this.deviceWidth = this.breakpointObserverService.screenWidth();

    if(this.opened){
      this.contentDivWidth =  this.deviceWidth - 270;
    }else {
      this.contentDivWidth = this.deviceWidth;
    }

    const _matcardInfo = { 
      dragPosition: {x: 10, y: 10},
      divStyle: {
        resize: 'both',
        overflow: 'hidden',
        width: '200px',
        height: '100px',
        background: '#CC3B5D'
      },
      matCardTitle: 'Create New Request',
      matCardSubtitle: '',
      matCardContent: '',
      matCardImage: '',
      matCardActions: '',
      matCardFooter: '',
    };

    this.workflows = this.workflowSource;
    

    this.splistcrudService.getSPLoggedInUser().then((res) => {
      this._logedUserAdId = res;      
      const wfQuery = `getbytitle('BusinessProcess')/items?&$top=200&$select=Category,SubCategory,ChildSubCategory,PageURL`;

        from(
          this.splistcrudService.getListItems(wfQuery)
          ).subscribe(
            (res) =>{ 
              //this.workflowSource = res;//activate for importing from any DB
              //this.onDeptWiseWorkflow(res);                 
              this.onDeptWiseWorkflow(this.workflowSource);                  
            },    
            (err) => {
                console.log(err)
            },
          );     

    });

    // this.splistcrudService.getSPLoggedInUser().then((res) => {
    //   this._logedUserAdId = res;
    //   const query = `getbytitle('BergerEmployeeInformation')/items?&$top=2000000&$select=EmployeeName,Email/ID,Email/Title,Email/EMail,OptManagerEmail/ID,OptManagerEmail/Title,DeptID,EmployeeId,EmployeeGrade,Department,Designation,OfficeLocation,Mobile,CostCenter&$expand=Email/ID,OptManagerEmail/ID&$filter=Email/ID eq '${this._logedUserAdId}'`;
      
    //     from(
    //       this.splistcrudService.getListItems(query)
    //       ).subscribe(
    //         (res) =>{ 
                  
    //         },    
    //         (err) => {
    //             console.log(err)
    //         },
    //       ); 

    // });
    
    
    this.breakpointObserverService
    .breakpoint$.subscribe(() =>
      this.currentBreakpoint = this.breakpointObserverService.breakpointChanged()
    );

    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngAfterViewInit() {
    const homeMenusDivHeight = this.homeMenusDiv.nativeElement.offsetHeight;
    console.log("homeMenusDivHeight: " + homeMenusDivHeight);
}

  changePosition() {
    this.dragPosition = {x: this.dragPosition.x + 50, y: this.dragPosition.y + 50};
  }

  GetOutputVal(valFrmChild: any) {
    this.opened = valFrmChild.compData.opened;
    this.isCardExpanded = valFrmChild.compData.isCardExpanded;
  }  

  onSearchChange(search: string){    
    const i = "";
    this.allWorkflows = [];

    this.workflowSource.forEach(w => {
      if(w.ChildSubCategory.toLowerCase().includes(search.toLowerCase())){
        this.createMatCardOnSearchWF(w, i);
        //this.allWorkflows.push(w);        
      }      
    });

  }

  onDeptWiseWorkflow(wfSource:any){
    of(wfSource).pipe(
      mergeMap((res:any) => res),
      groupBy((item:any) => item.Category),
      mergeMap(obs => {
        const obsT = obs; 
          return obs.pipe(
              toArray(),
              map((items:any) => {
                  // items.subscribe((p:any) =>{
                  // })
                  // if(obs.key == 'Finance'){
                  //   this.createMatCard(obs);
                  // }

                  this.createMatCard(obs, items);
                  this.showDeptWiseWFDiv = true;
                  this.showAllWFDiv = false;
                  return { key:obs.key, value: items }
              })
          )
      }), toArray()
    ).subscribe((p:any) =>{
      this.categorizedWorkflow = [];
      this.categorizedWorkflow = p;
      console.log('result: ' + JSON.stringify(p)); 
    })    
  }

  createMatCard(obs:any, items:any){

    let card: IMatCard;
    let xXis:number;
    let yXis:number;    

    const eRelement = Math.floor(this.contentDivWidth/250);
    this.columnNo = Math.floor(this.wfDepartments.length  % eRelement);
    this.rowNo = Math.floor(this.wfDepartments.length  / eRelement);

    xXis = 10 + (this.columnNo * 250);
    yXis = 10 + (this.rowNo * 150);   
    
    if(this.contentDivWidth - ( this.wfDepartments.length * 250) > 255){
      xXis = 10 + (this.columnNo * 250);
      yXis = 10 + (this.rowNo * 150);

      card = {
        uId: '',
        readMode: '',
        Status: '',
        logedUserAdId: 0,
        MatcardInfo: {            
          matCardTitle: obs.key,
          matCardSubtitle: items.length,
          matCardContent: '',
          matCardImage: items[0].BgImage,
          matCardActions: '',
          matCardFooter: '',
          divStyle: {
            resize: 'both',
            overflow: 'hidden',
            width: '200px',
            height: '90px',
            background: 'lightblue'
          },
          styleTitle:{
            textAlign: 'center', 
            color: 'aliceblue',
            fontFamily:'Arial',
            fontWeight: 200,
            fontSize: '20px'
          },         
          dragPosition: {
            x: xXis, 
            y: yXis,
          },
          pageUrl: items[0].PageURL
        }
      };

      
    }else{
      xXis = 10 + (this.columnNo * 250);
      yXis = 10 + (this.rowNo * 150);

      card = {
        uId: '',
        readMode: '',
        Status: '',
        logedUserAdId: 0,
        MatcardInfo: {            
          matCardTitle: obs.key,
          matCardSubtitle: items.length,
          matCardContent: '',
          matCardImage: items[0].BgImage, 
          matCardActions: '',
          matCardFooter: '',
          divStyle: {
            resize: 'both',
            overflow: 'hidden',
            width: '200px',
            height: '100px',
            background: 'lightblue'
          },
          styleTitle:{
            textAlign: 'center', 
            color: 'aliceblue',
            fontFamily:'Arial',
            fontWeight: 200,
            fontSize: '20px'
          },
          dragPosition: {
            x: xXis, 
            y: yXis,
          },
          pageUrl: items[0].PageURL
        }
      };
    }   

    this.wfDepartments.push(card);
   
  }

  moveCard(){
    let xXis:number;
    let yXis:number;
    const eRelement = Math.floor(this.contentDivWidth/250);    

    for (let j =0; j<this.wfDepartments.length ; j++){

      this.columnNo = Math.floor(j % eRelement);
      this.rowNo = Math.floor(j / eRelement);

      xXis = 10 + (this.columnNo * 250);
      yXis = 10 + (this.rowNo * 150);

      this.wfDepartments[j].MatcardInfo.dragPosition.x = xXis;
      this.wfDepartments[j].MatcardInfo.dragPosition.y = yXis;
    }

    //alert("Delayed for 1 second.");
  }

  showAllWF(){
    this.showDeptWiseWFDiv = false;
    this.allWorkflows = [];
    

    of(this.workflowSource).pipe(
      mergeMap((res:any) => res),
      groupBy((item:any) => item.SubCategory),
      mergeMap(obs => {
        const obsT = obs; 
          return obs.pipe(
              toArray(),
              map((items:any) => {
                  // items.subscribe((p:any) =>{
                  // })
                  // if(obs.key == 'Finance'){
                  //   this.createMatCard(obs);
                  // }

                  this.createMatCardForAllWF(obs, items);
                  this.showDeptWiseWFDiv = false;
                  this.showAllWFDiv = true;
                  return { key:obs.key, value: items }
              })
          )
      }), toArray()
    ).subscribe((p:any) =>{
      this.categorizedWorkflow = [];
      this.categorizedWorkflow = p;
      console.log('result: ' + JSON.stringify(p));
 
    })

    this.showAllWFDiv = true;
              
  }

  showDeptWF(){   

    this.showAllWFDiv = false;
    this.showDeptWiseWFDiv = true;   
  }

  createMatCardForAllWF(obs:any, items:any){

    let card: IMatCard;
    let xXis:number;
    let yXis:number;    

    const eRelement = Math.floor(this.contentDivWidth/250);
    this.columnNo = Math.floor(this.allWorkflows.length  % eRelement);
    this.rowNo = Math.floor(this.allWorkflows.length  / eRelement);

    xXis = 10 + (this.columnNo * 250);
    yXis = 10 + (this.rowNo * 150);   
    
    if(this.contentDivWidth - ( this.allWorkflows.length * 250) > 255){
      xXis = 10 + (this.columnNo * 250);
      yXis = 10 + (this.rowNo * 150);

      card = {
        uId: '',
        readMode: '',
        Status: '',
        logedUserAdId: 0,
        MatcardInfo: {            
          matCardTitle: obs.key,
          matCardSubtitle: '',
          matCardContent: '',
          matCardImage: items.BgImage,
          matCardActions: '',
          matCardFooter: '',
          divStyle: {
            resize: 'both',
            overflow: 'hidden',
            width: '200px',
            height: '80px',
            background: '#D9AB29'
          },
          styleTitle:{
            textAlign: 'center', 
            color: 'aliceblue',
            fontFamily:'Arial',
            fontWeight: 200,
            fontSize: '20px'
          },
          dragPosition: {
            x: xXis, 
            y: yXis,
          },
          pageUrl: items[0].PageURL
        }
      };

      
    }else{
      xXis = 10 + (this.columnNo * 250);
      yXis = 10 + (this.rowNo * 150);

      card = {
        uId: '',
        readMode: '',
        Status: '',
        logedUserAdId: 0,
        MatcardInfo: {            
          matCardTitle: obs.key,
          matCardSubtitle: '',
          matCardContent: '',
          matCardImage: items.BgImage,
          matCardActions: '',
          matCardFooter: '',
          divStyle: {
            resize: 'both',
            overflow: 'hidden',
            width: '200px',
            height: '80px',
            background: '#D9AB29'
          },
          styleTitle:{
            textAlign: 'center', 
            color: 'aliceblue',
            fontFamily:'Arial',
            fontWeight: 200,
            fontSize: '20px'
          },
          dragPosition: {
            x: xXis, 
            y: yXis,
          },
          pageUrl: items[0].PageURL
        },
        
      };
    } 
    
    this.allWorkflows.push(card);

    this.allWFsDivH = 180 * this.rowNo;
  }

  createMatCardOnSearchWF(obs:any, items:any){

    let card: IMatCard;
    let xXis:number;
    let yXis:number;    

    const eRelement = Math.floor(this.contentDivWidth/250);
    this.columnNo = Math.floor(this.allWorkflows.length  % eRelement);
    this.rowNo = Math.floor(this.allWorkflows.length  / eRelement);

    xXis = 10 + (this.columnNo * 250);
    yXis = 10 + (this.rowNo * 150);   
    
    if(this.contentDivWidth - ( this.allWorkflows.length * 250) > 255){
      xXis = 10 + (this.columnNo * 250);
      yXis = 10 + (this.rowNo * 150);

      card = {
        uId: '',
        readMode: '',
        Status: '',
        logedUserAdId: 0,
        MatcardInfo: {            
          matCardTitle: obs.ChildSubCategory,
          matCardSubtitle: '',
          matCardContent: '',
          matCardImage: items.BgImage,
          matCardActions: '',
          matCardFooter: '',
          divStyle: {
            resize: 'both',
            overflow: 'hidden',
            width: '200px',
            height: '80px',
            background: '#D9AB29'
          },
          styleTitle:{
            textAlign: 'center', 
            color: 'aliceblue',
            fontFamily:'Arial',
            fontWeight: 200,
            fontSize: '20px'
          },
          dragPosition: {
            x: xXis, 
            y: yXis,
          },
          pageUrl: items[0].PageURL
        }
      };

      
    }else{
      xXis = 10 + (this.columnNo * 250);
      yXis = 10 + (this.rowNo * 150);

      card = {
        uId: '',
        readMode: '',
        Status: '',
        logedUserAdId: 0,
        MatcardInfo: {            
          matCardTitle: obs.ChildSubCategory,
          matCardSubtitle: '',
          matCardContent: '',
          matCardImage: items.BgImage,
          matCardActions: '',
          matCardFooter: '',
          divStyle: {
            resize: 'both',
            overflow: 'hidden',
            width: '200px',
            height: '80px',
            background: '#D9AB29'
          },
          styleTitle:{
            textAlign: 'center', 
            color: 'aliceblue',
            fontFamily:'Arial',
            fontWeight: 200,
            fontSize: '20px'
          },
          dragPosition: {
            x: xXis, 
            y: yXis,
          },
          pageUrl: items[0].PageURL
        }
      };
    } 
    
    this.allWorkflows.push(card);

    this.allWFsDivH = 180 * this.rowNo;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
  }

}
