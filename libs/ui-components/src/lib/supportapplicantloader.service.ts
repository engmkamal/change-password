// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class SupportapplicantloaderService {

//   constructor() { }
// }
//=============


import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'any'
})
export class SupportapplicantloaderService {

  public description!: string;
  public text!: string;
  public gridInfo!:any;
  public clicked = new EventEmitter();  

  constructor() { }
}






