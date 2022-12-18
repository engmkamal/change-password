import { Component, OnInit, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { AppdataproviderService } from "@portal/shared/data-access-user";
import { Subscription } from "rxjs";

@Component({
  selector: 'portal-action-buttons-bar',
  templateUrl: './action-buttons-bar.component.html',
  styleUrls: ['./action-buttons-bar.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ActionButtonsBarComponent {
  @Output()
  remove: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  addGroup: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  addCondition: EventEmitter<void> = new EventEmitter<void>();

  @Input() requestInfo: any;

  appDataSubscription!: Subscription;

  _showAddAssigneeBtn = false;
  _showDeleteTaskBtn = false;

  constructor(private appdataproviderService: AppdataproviderService) {}

  ngAfterViewInit(){
    this.appDataSubscription = this.appdataproviderService.appData$.subscribe((res:any) => {
      if (res.uId != "") {       

        if(res.Status == "Submitted" || res.Status == "Assigned" || res.Status == "TaskPickedUp" || res.Status == "UATFeedbackFrmCustomer"){
          this._showAddAssigneeBtn = true;
          this._showDeleteTaskBtn = true;
        }
      }
    });
  }
}
