import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { UserService } from '../user.service';

@Component({
  selector: 'portal-userlogin',
  templateUrl: './userlogin.component.html',
  styleUrls: ['./userlogin.component.scss']
})
export class UserloginComponent implements OnInit {
  userName = '';
  customerId = '';
  password = '';


  constructor(
    //private userService: UserService,
    private _loginService: LoginService) { }

  ngOnInit(): void {
    console.log("UserloginComponent ngOnInit initialized ");
  }

 

  login(): void {
    
    this._loginService.checkCredentials(this.customerId, this.password);

    //this.userService.checkCredentials(this.customerId, this.password);
  }

  logout(): void {
    localStorage.clear();

    //this._loginService.logout();
    //this.userService.logout();
  }

}
