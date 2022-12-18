import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
//import { dashboardsListsInfo } from '../../../assets/dashboardslistsinfo';


@Component({
  selector: 'portal-myappliedworkflowhome',
  templateUrl: './myappliedworkflowhome.component.html',
  styleUrls: ['./myappliedworkflowhome.component.scss'],
})
export class MyappliedworkflowhomeComponent implements OnInit {

  windowOrigin = window.location.origin;
  allWf:any;
  panelOpenState = false;
    
  constructor(
    private _router:Router,
    private httpClient: HttpClient
    ) { }

  ngOnInit(): void {

    if( localStorage.getItem('logedCustId') == null && localStorage.getItem('logedEmpEmail') == null){
      //window.location.href = this.windowOrigin + '/login';
    }

    
    const dbListsInfoUrl = "/assets/myworkflowslistsinfo.ts";
    //const dbListsInfoUrl = "../../../assets/myworkflowslistsinfo.ts";
    //const dbListsInfoUrl = "http://localhost:4213/assets/myworkflowslistsinfo.ts";
    this.httpClient.get(dbListsInfoUrl).subscribe(data =>{
      this.allWf = data;
    })

    // fetch('../../../assets/dashboardslists.json')
    // .then(res => res.json())
    // .then(jsonData => {
    //   this.allWf = jsonData;
    // });    
    
  }

  trackByFnMenu(index:number, wf:any){
    return wf.WfName;
  }
  //========for passing url link while click on each Menu/Tiles ============
  editButtonClick(wf:any){
    this._router.navigate(['/admin', wf])
  }

}

