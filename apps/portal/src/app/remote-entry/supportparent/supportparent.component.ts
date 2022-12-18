import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Schema } from "@dashjoin/json-schema-form";
import { LoginService } from '@portal/shared/data-access-user';
//import {MatAccordion} from '@angular/material/expansion';

@Component({
  selector: 'portal-supportparent',
  templateUrl: './supportparent.component.html',
  styleUrls: ['./supportparent.component.scss']
})
export class SupportparentComponent implements OnInit {
  _form!: FormGroup;

  requestorsInfo:any;

  panelOpenState = false;

  openedStartDrawer = false;
  openedEndDrawer = false;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  requestInfo: any = {};

 // @ViewChild(MatAccordion) accordion: MatAccordion;

  _matcardInfo = { 
    dragPosition: {x: 10, y: 10},
    divStyle: {
      resize: 'both',
      overflow: 'hidden',
      width: '340px',
      height: '300px',
      background: 'whitesmoke'
    },    
    matCardTitle: 'Info to identify a solution:',
    styleTitle:{
      textAlign: 'center', 
      color: 'navy',
      fontFamily:'Arial',
      fontWeight: 100,
      fontSize: '16px'
    },
    matCardSubtitle: 'Please provide some more details about your issue.',
    styleSubTitle:{
      textAlign: 'left', 
      color: 'black',
      fontFamily:'Arial',
      fontWeight: 80,
      fontSize: '12px'
    },
    matCardContent: '',
    styleContent:{
      textAlign: 'left', 
      color: 'gray',
      fontFamily:'Arial',
      fontWeight: 50,
      fontSize: '10px'
    },
    matCardImage: '',
    matCardActions: '',
    matCardFooter: '',
  };

  requestorSchema: Schema = {
    "type": "object",
    "properties": {
    "System Opener": { type: "string", description: "Please enter your name", style: {width: '400px', height: "10px"} },
    "Contact Details": { type: "string", description: "Please enter your name", style: {width: '400px', "height": "100px"}, widget: "textarea", widgetType: "rich-text-editor" },
    "Systen Information":{
      type: "string",
      widget: "select",
      displayWithChoices: [
        "SAP",
        "Microsoft",
        "AWS"
      ],
      choices: [
        "SAP",
        "Microsoft",
        "AWS"
      ],
      style: {width: '400px', height: "10px"},
    },
    "Product Area":{
      type: "string",
      widget: "select",
      displayWithChoices: [
        "SAP-FICO",
        "SAP-SD",
        "SAP-MM",
        "SAP-PP"
      ],
      choices: [
        "SAP-FICO",
        "SAP-SD",
        "SAP-MM",
        "SAP-PP"
      ],
      style: {width: '400px'},
    }
    }
    
  };

  descriptionSchema: Schema = {
    "type": "object",
    "properties": {
      "DesConsent": { type: "boolean", description: "I Consent to SAP Support......", style: {width: '400px'} },
      "Subject": { type: "string", description: "Give the issue a title", style: {width: '400px'} },
      "Description": { type: "string", description: "Please enter issue details", style: {width: '400px', "height": "100px"}, widget: "textarea", widgetType: "rich-text-editor" },
        
    }    
  };

  attachmentSchema: Schema = {
    "type": "object",
    "properties": {
      "Attachment": { type: "string", widget: "upload", description: "I Consent to SAP Support......", style: {width: '400px'} },      
        
    }    
  };

  prioritySchema: Schema = {
    "type": "object",
    "properties": {
      "Priority":{
        type: "string",
        widget: "select",
        displayWithChoices: [
          "Low-Business operations not affected",
          "Medium-Business operations are affected",
          "High-Business operations are highly affected",
          "Very High-Business operations are extremely affected"
        ],
        choices: [
          "Low-Business operations not affected",
          "Medium-Business operations are affected",
          "High-Business operations are highly affected",
          "Very High-Business operations are extremely affected"
        ],
        style: {width: '400px'},
      }
        
    }
    
  };

  contactDetSchema: Schema = {
    "type": "object",
    "properties": {
      "Name": { type: "string", description: "Please enter your Name", style: {width: '400px', height: "10px"} },
      "Role": { type: "string", description: "Please enter your Role", style: {width: '400px', height: "10px"} },
      "Primary Phone": { type: "string", description: "Please enter your Primary Phone", style: {width: '400px', height: "10px"} },
      "Secondary Phone": { type: "string", description: "Please enter your Secondary Phone", style: {width: '400px', height: "10px"} },
      "Email": { type: "string", description: "Please enter your Email", style: {width: '400px', height: "10px"} },      
      "Time Zone":{
        type: "string",
        widget: "select",
        displayWithChoices: [
          "BDT",
          "BST"
        ],
        choices: [
          "BDT",
          "BST"
        ],
        style: {width: '400px', height: "10px"},
      }
        
    }
    
  };

  constructor(
    private formBuilder: FormBuilder,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef
    ) {
    this.openedStartDrawer = false;
    this.openedEndDrawer = true;

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this._createForm();    

    this.requestorsInfo = {
      EmployeeName: 'Mostafa Kamal',
      Company: 'BPBL',
      EmployeeId: '1270',
      OfficeLocation: 'Corporate',
      Designation: 'Kamal',
      Department: 'Kamal',
      Email: 'Kamal',
      CostCenter: '444444',
      Mobile: '345464',
      RequestDate: '2022'
    };

    this.requestInfo = {
      uId: "",
      readMode: "",
      Status: "",
      MatcardInfo: this._matcardInfo 
    };

   
  }

  private _createForm() {
    this._form = this.formBuilder.group({
        TestParameters: this.formBuilder.array([])
    });
  }

  GetOutputVal(valFrmChild: any) {
    console.log("");
  }
}

