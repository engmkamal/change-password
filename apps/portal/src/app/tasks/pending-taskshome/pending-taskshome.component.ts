import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'portal-pending-taskshome',
  templateUrl: './pending-taskshome.component.html',
  styleUrls: ['./pending-taskshome.component.scss'],
})
export class PendingTaskshomeComponent implements OnInit {
  constructor(private router: Router) {
    if( localStorage.getItem('logedCustId') == null && localStorage.getItem('logedEmpEmail') == null){
      this.router.navigate(['/login']);          
    }
  }

  ngOnInit(): void {}
}
