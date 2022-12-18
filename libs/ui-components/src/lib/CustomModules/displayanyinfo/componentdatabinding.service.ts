import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'any'
})
export class ComponentdatabindingService {

  public description!: string;
  public text!: string;
  public gridInfo!:any;
  public clicked = new EventEmitter();  

  constructor() { }
}





