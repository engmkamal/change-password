import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'portal-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor() {console.log("HomeComponent constructor fn")}

  ngOnInit(): void {console.log("HomeComponent ngOnInit fn")}
}
