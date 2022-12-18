// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'portal-userlogin',
//   templateUrl: './userlogin.component.html',
//   styleUrls: ['./userlogin.component.scss'],
// })
// export class UserloginComponent implements OnInit {
//   constructor() {}

//   ngOnInit(): void {}
// }


//=================


import { Component, OnInit } from '@angular/core';
import { LoginService, LoggeduserinfoService, UserService } from '@portal/shared/data-access-user';

@Component({
  selector: 'portal-user-login',
  templateUrl: './userlogin.component.html',
  styleUrls: ['./userlogin.component.scss']
})
export class UserloginComponent implements OnInit {
  userName = '';
  customerId = '';
  password = '';


  constructor(private userService: UserService) { }

  ngOnInit(): void {
    console.log("UserloginComponent ngOnInit initialized ");
  }

 

  login(): void {
    this.userService.checkCredentials(this.customerId, this.password);
    //this.userService.login(this.userName, this.customerId, this.password);
  }

  logout(): void {
    this.userService.logout();
  }

}

