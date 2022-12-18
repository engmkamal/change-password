import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'; 
import { GridReadyEvent, GridApi, ColumnApi } from 'ag-grid-community';
import * as moment from 'moment';
import { ComponentdatabindingService } from '../componentdatabinding.service';

@Component({
  selector: 'portal-displayanyinfohome',
  templateUrl: './displayanyinfohome.component.html',
  styleUrls: ['./displayanyinfohome.component.scss']
})
export class DisplayanyinfohomeComponent implements OnInit{
  defaultColDef: any;
  columnDefs: any;
  rowData: any;
  private api!: GridApi;
  private columnApi!: ColumnApi; 
  @Input() public text = 'Initial text';
  @Input() public gridInfo: any;
  @Output() public clicked!: EventEmitter<any>;
  public gridHeight = 100;
  
  constructor(private componentdatabindingService: ComponentdatabindingService) {}

  async executeOnInitProcesses(){    
    try{ 
      this.defaultColDef = {
        flex: 1,
        minWidth: 50,
        resizable: true, //to resize; add resizable: false to any individual column to disable resizingng that col only
        enableValue: true,       
        sortable: true,
        editable: false
      };
      
      this.gridInfo = this.componentdatabindingService.gridInfo;

      if(this.gridInfo.hasOwnProperty('GridColDef') && this.gridInfo.hasOwnProperty('GridColVal')){
        this.columnDefs = this.gridInfo.GridColDef; 
        this.rowData = this.gridInfo.GridColVal;
        this.gridHeight = 70 + (42 * this.rowData.length);        
      }else{
        this.columnDefs = []; 
        this.rowData = [];
      }

    } 
    catch(err){
      console.log("Error: " + err)
    }
  }

  ngOnInit(): void {
    this.executeOnInitProcesses();
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.columnApi = params.columnApi;
  }

  handleClick(evt: Event) {
    evt.stopPropagation();
    this.clicked.emit('clicked output fired');
  }

}



