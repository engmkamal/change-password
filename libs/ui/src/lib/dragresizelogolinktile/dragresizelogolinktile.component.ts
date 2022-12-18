import { ResizedEvent } from 'angular-resize-event';

import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';

import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  Output,
  EventEmitter,
  OnInit,
  AfterViewInit,
  Input
} from '@angular/core';
import { Subject, merge, of } from 'rxjs';
import { tap, auditTime, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'portal-dragresizelogolinktile',
  templateUrl: './dragresizelogolinktile.component.html',
  styleUrls: ['./dragresizelogolinktile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragresizelogolinktileComponent implements OnInit, AfterViewInit {

  opened: boolean;
  isCardExpanded = false;

  // width: number;
  // height: number;

  public style: object = {};

  @Output() resized = new EventEmitter<DOMRect>();

  @Output() outputToParent = new EventEmitter<any>();

  private startSize$ = new Subject<DOMRect>();
  private dragMove$ = new Subject<CdkDragMove>();
  private dragMoveAudited$ = this.dragMove$.pipe(
    withLatestFrom(this.startSize$),
    auditTime(16),
    tap(([{ distance }, rect]) => {
      this.el.nativeElement.style.width = `${rect.width + distance.x}px`;
      this.el.nativeElement.style.height = `${rect.height + distance.y}px`;
    })
  );

  sub$ = merge(this.dragMoveAudited$, of(true));

  width: number;
  height: number;

  dragPosition = {x: 0, y: 0};

  @Input() 
  public requestInfo: any;

  matCardTitle = "matCardTitle";
  matCardSubtitle = "matCardSubtitle";
  matCardContent = "matCardContent";
  matCardImage = "matCardImage";
  matCardActions = "matCardActions";
  matCardFooter = "matCardFooter";

  divStyle = {
    resize: 'both',
    overflow: 'auto',
    width: '310px',
    height: '250px',
    background: 'lightblue'    
  }

  styleTitle = {
    textAlign: 'center', 
    color: 'aliceblue',
    fontFamily:'Arial',
    fontWeight: 200,
    fontSize: '20px'
  }

  styleSubTitle = {
    textAlign: 'center', 
    color: 'aliceblue',
    fontFamily:'Arial',
    fontWeight: 100,
    fontSize: '14px'
  }

  styleContent = {
    textAlign: 'left', 
    color: 'aliceblue',
    fontFamily:'Arial',
    fontWeight: 100,
    fontSize: '10px'
  }

  constructor(private el: ElementRef<HTMLElement>) {
    this.opened = true;
    this.width = 310;
    this.height = 250;    
  }

  ngOnInit(): void {
    //this.dragPosition = {x: this.requestInfo.MatcardInfo.dragPosition.x, y: this.requestInfo.MatcardInfo.dragPosition.y};
    //this.dragPosition = {x: this.requestInfo.MatcardInfo.dragPosition.x, y: this.requestInfo.MatcardInfo.dragPosition.y};
    this.matCardTitle = this.requestInfo.MatcardInfo.matCardTitle;
    this.matCardSubtitle = this.requestInfo.MatcardInfo.matCardSubtitle;
    this.matCardContent = this.requestInfo.MatcardInfo.matCardContent;
    this.matCardImage = this.requestInfo.MatcardInfo.matCardImage;
    this.matCardActions = this.requestInfo.MatcardInfo.matCardActions;
    this.matCardFooter = this.requestInfo.MatcardInfo.matCardFooter;
    this.divStyle = { 
      resize: this.requestInfo.MatcardInfo.divStyle.resize,
      overflow: this.requestInfo.MatcardInfo.divStyle.overflow,
      width: this.requestInfo.MatcardInfo.divStyle.width,
      height: this.requestInfo.MatcardInfo.divStyle.height,
      background: this.requestInfo.MatcardInfo.divStyle.background
    };
    
    if(this.requestInfo.MatcardInfo.styleTitle){
      this.styleTitle = {
        textAlign: this.requestInfo.MatcardInfo.styleTitle.textAlign, 
        color: this.requestInfo.MatcardInfo.styleTitle.color,
        fontFamily:this.requestInfo.MatcardInfo.styleTitle.fontFamily,
        fontWeight: this.requestInfo.MatcardInfo.styleTitle.fontWeight,
        fontSize: this.requestInfo.MatcardInfo.styleTitle.fontSize
      }
      
    };

    if(this.requestInfo.MatcardInfo.styleSubTitle){
      this.styleSubTitle = {
        textAlign: this.requestInfo.MatcardInfo.styleSubTitle.textAlign, 
        color: this.requestInfo.MatcardInfo.styleSubTitle.color,
        fontFamily:this.requestInfo.MatcardInfo.styleSubTitle.fontFamily,
        fontWeight: this.requestInfo.MatcardInfo.styleSubTitle.fontWeight,
        fontSize: this.requestInfo.MatcardInfo.styleSubTitle.fontSize
      }
      
    };
    if(this.requestInfo.MatcardInfo.styleContent){
      this.styleContent = {
        textAlign: this.requestInfo.MatcardInfo.styleContent.textAlign, 
        color: this.requestInfo.MatcardInfo.styleContent.color,
        fontFamily:this.requestInfo.MatcardInfo.styleContent.fontFamily,
        fontWeight: this.requestInfo.MatcardInfo.styleContent.fontWeight,
        fontSize: this.requestInfo.MatcardInfo.styleContent.fontSize
      }
      
    }
    //console.log("Draggable and resizable component initialized !"); 
    
    
  }

  ngAfterViewInit(){
    this.dragPosition = {x: this.requestInfo.MatcardInfo.dragPosition.x, y: this.requestInfo.MatcardInfo.dragPosition.y};
    
  }

  expand() {
    const _comData = {
      opened : false,
      isCardExpanded: !this.isCardExpanded
    }
    const data = {
      compData : _comData
    }
    this.outputToParent.emit(data);

    // if(this.opened){
    //   this.opened = false;
    // }
    this.isCardExpanded = !this.isCardExpanded;
  }

  onResized(event: ResizedEvent) {
    this.width = event.newRect.width;
    this.height = event.newRect.height;

    console.log('width', this.width);
    console.log('height', this.height);   
    
    //alert("onResized called !!!");

    this.style = {
      //position: 'fixed',
      //left: `250px`,
      //top: `260px`,
      width: `${this.width}px`,
      height: `${this.height}px`
    };
  }

  dragStarted(): void {
    this.startSize$.next(this.el.nativeElement.getBoundingClientRect());
  }

  dragEnded($event: CdkDragEnd): void {
    $event.source._dragRef.reset();
    this.resized.emit(this.el.nativeElement.getBoundingClientRect());
  }

  dragMoved($event: CdkDragMove): void {
    this.dragMove$.next($event);
  }

  changePosition() {
    this.dragPosition = {x: this.dragPosition.x + 50, y: this.dragPosition.y + 50};
  }

  emitEventToParent(e:any){
    this.outputToParent.emit(this.matCardTitle);
  }

}



