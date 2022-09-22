import * as moment from 'moment';

export class ColumnDefinition{
    private elGui!:any;
    private dbInfo!:any;

    constructor(
        i:any,
        element:any,
        eGui: HTMLDivElement){
            this.elGui = eGui;
            this.dbInfo = i;
        }


    private setTitleWithMDField(el:any) {
        return {
        headerName: el.headerName,
        field: el.field,
        cellRenderer: 'agGroupCellRenderer',
        sortable: true,
        enableRowGroup: false,
        filter: 'agSetColumnFilter',
        filterParams: {
            resetButton: true,
        },
        minWidth: el.minWidth, 
        maxWidth: el.maxWidth,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        editable: false,
        cellClass: "titleWithMDFieldClass",
        cellStyle: function (params:any) {
            if (params.value != '') {
            return {
                textItems: 'center !important',
                display: 'flex',
                alignSelf: 'normal',
                marginTop: '-8px',
                marginBottom: '0px',
                borderBottom: '0px',
                paddingBottom: '0px'
            };
            } else {
            return {
                textAlign: 'center',
            }
            }
        }
        };
    }

    private setTitleWitouthMDField(el:any) {
        return {
        headerName: el.headerName,
        field: el.field,
        //cellRenderer: 'agGroupCellRenderer',
        sortable: true,
        enableRowGroup: false,
        filter: 'agSetColumnFilter',
        filterParams: {
            resetButton: true,
        },
        minWidth: el.minWidth, 
        maxWidth: el.maxWidth,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        cellClass: "ag-header-group-cell-label",
        editable: false,
        cellStyle: function (params:any) {
            if (params.value != '') {
            return {
                textAlign: 'center',
                display: 'flex',
            };
            } else {
            return {
                textAlign: 'center',
            }
            }
        },
        };
    }

    private setDateField(el:any) {
        const dtFld = {
        headerName: el.headerName,
        //valueGetter: function (params:any) { if (params.data[el.valueGetter] != null && params.data[el.valueGetter] != undefined) { return moment((params.data[el.valueGetter]).split("T")[0]).format("DD MMM, YYYY"); } },            
        sortable: true,
        enableRowGroup: true,
        filter: 'agDateColumnFilter',
        filterParams: {
            // comparator: function (filterLocalDateAtMidnight:any, cellValue:any) {
            //   const dateAsString = moment(cellValue).format('DD/MM/YYYY');
            //   const dateParts = dateAsString.split('/');
            //   const cellDate = new Date(
            //     Number(dateParts[2]),
            //     Number(dateParts[1]) - 1,
            //     Number(dateParts[0])
            //   );
            //   if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
            //     return 0;
            //   }
            //   if (cellDate < filterLocalDateAtMidnight) {
            //     return -1;
            //   }
            //   if (cellDate > filterLocalDateAtMidnight) {
            //     return 1;
            //   }
            // },
            //applyButton: true,
            resetButton: true,
        },
        // valueFormatter: function(params) {
        //     return moment(params.value).format('DD MMM, YYYY');
        // },
        columnGroupShow: 'open',
        cellClass: "ag-header-group-cell-label",
        cellStyle: function (params:any) {
            if (params.value != '') {
            return {
                //color: 'red', 
                //backgroundColor: 'green',
                textAlign: 'center',
                display: 'flex',
            };
            } else {
            return {
                textAlign: 'center',
            }
            }
        },
        minWidth: el.minWidth, 
        maxWidth: el.maxWidth,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        editable: el.editable,
        cellEditor: 'agTextCellEditor'
        }

        return dtFld;
    }

    private setTextField(el:any){
        const txtFld = {
        headerName: el.headerName,
        field: el.field,
        sortable: true,
        enableRowGroup: true,
        filter: 'agSetColumnFilter',
        filterParams: {
            resetButton: true,
        },
        minWidth: el.minWidth, 
        maxWidth: el.maxWidth,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        editable: el.editable,
        cellEditor: 'agTextCellEditor',
        //cellEditorPopup: true,
        cellClass: "ag-header-group-cell-label",
        cellStyle: function (params:any) {
            if (params.value != '') {
            return {
                textAlign: 'center',
                display: 'flex',
            };
            } else {
            return {
                textAlign: 'center',
            }
            }
        },
        }

        return txtFld;
    }

    private setLargeTextField(el:any) {
        const txtFld = {
        headerName: el.headerName,
        field: el.field,
        sortable: true,
        enableRowGroup: true,
        filter: 'agSetColumnFilter',
        filterParams: {
            resetButton: true,
        },
        minWidth: el.minWidth, 
        maxWidth: el.maxWidth,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        editable: el.editable,
        cellEditor: 'agLargeTextCellEditor',
        //cellEditorPopup: true,
        cellClass: "ag-header-group-cell-label",
        cellStyle: function (params:any) {
            if (params.value != '') {
            return {
                textAlign: 'center',
                display: 'flex',
            };
            } else {
            return {
                textAlign: 'center',
            }
            }
        },
        }

        return txtFld;
    }

    private setSelectField(el:any) {
        const txtFld = {
        headerName: el.headerName,
        field: el.field,
        sortable: true,
        enableRowGroup: true,
        filter: 'agSetColumnFilter',
        filterParams: {
            resetButton: true,
        },
        minWidth: el.minWidth, 
        maxWidth: el.maxWidth,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        editable: el.editable,
        cellEditor: 'agSelectCellEditor', //'agTextCellEditor', //'agLargeTextCellEditor',
        //cellEditorPopup: true,
        cellEditorParams: {
            values: [el.cellEditorParams],
        }, 
        cellClass: "ag-header-group-cell-label",
        cellStyle: function (params:any) {
            if (params.value != '') {
            return {
                textAlign: 'center',
                display: 'flex',
            };
            } else {
            return {
                textAlign: 'center',
            }
            }
        },
        }

        return txtFld;
    }

    private setNumberField(el:any) {
        const numFld = {
        headerName: el.headerName,
        field: el.field,
        sortable: true,
        enableRowGroup: true,
        filter: 'agNumberColumnFilter',
        //filter: 'agSetColumnFilter',
        filterParams: {
            resetButton: true,
        },
        minWidth: el.minWidth, 
        maxWidth: el.maxWidth,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        cellClass: "ag-header-group-cell-label",
        cellStyle: function (params:any) {
            if (params.value != '') {
            return {
                //color: 'red', 
                //backgroundColor: 'green',
                textAlign: 'center',
                display: 'flex',
            };
            } else {
            return {
                textAlign: 'center',
            }
            }
        }
        }
        return numFld;
    }

    private setViewLinkGuidField(el:any) { 

        const vwLnkFld = {
        headerName: el.headerName,
        field: el.field,
        cellRenderer: (params:any)=> {
            return '<a href="https://portal.bergerbd.com/leaveauto/SitePages/' + this.dbInfo.wfName + '.aspx?UniqueId=' + params.value + '&mode=read">view</a>';
        },
        enableRowGroup: false,
        menuTabs: ['columnsMenuTab'],//menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
        editable: false,
        cellClass: "ag-header-group-cell-label",
        cellStyle: function (params:any) {
            if (params.value != '') {
            return {
                textAlign: 'center',
                display: 'flex',
            };
            } else {
            return {
                textAlign: 'center',
            }
            }
        },
        minWidth: el.minWidth, 
        maxWidth: el.maxWidth,
        }

        return vwLnkFld;
    }

    private setViewLinkUrlField(el:any) { 

        const vwLnkFld = {
        headerName: el.headerName,
        field: el.field,
        cellRenderer: (params:any)=> {
            return `<a href="${params.value}" >View</a>`;
        },
        enableRowGroup: false,
        menuTabs: ['columnsMenuTab'],//menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
        editable: false,
        cellClass: "ag-header-group-cell-label",
        cellStyle: function (params:any) {
            if (params.value != '') {
            return {
                textAlign: 'center',
                display: 'flex',
            };
            } else {
            return {
                textAlign: 'center',
            }
            }
        },
        minWidth: el.minWidth, 
        maxWidth: el.maxWidth,
        }

        return vwLnkFld;
    }

    private setViewOnTitleUrlField(el:any) { 

        const vwLnkFld = {
        headerName: el.headerName,
        field: el.field,
        cellRenderer: (params:any)=> {
            const title = params.data['Title'];
            return `<a href="${params.value}" style="color:blue;">${title}</a>`;
        },
        enableRowGroup: false,
        menuTabs: ['columnsMenuTab'],//menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
        editable: false,
        cellClass: "ag-header-group-cell-label",
        cellStyle: function (params:any) {
            if (params.value != '') {
            return {
                textAlign: 'center',
                display: 'flex',
            };
            } else {
            return {
                textAlign: 'center',
            }
            }
        },
        minWidth: el.minWidth, 
        maxWidth: el.maxWidth,
        }

        return vwLnkFld;
    }

    private setActionViewLinkGuidField = (el:any)=> {

        const vwLnkFld = {
        headerName: el.headerName,
        field: el.field,
        cellRenderer: (params:any)=> {
            const editingCells = params.api.getEditingCells();
            const isCurrentRowEditing = editingCells.some((cell:any) => {
            return cell.rowIndex === params.node.rowIndex;
            });
        
            if (isCurrentRowEditing) {
            this.elGui.innerHTML = `
                <a  class="action-button update"  data-action="update" style="margin: 0px; padding: 0px 5px; font-size: 14px; color: blue; cursor:pointer" onmouseover="this.style.color='green'" onmouseout="this.style.color='blue'" > Update  </a>
                <a  class="action-button cancel"  data-action="cancel" style="margin: 0px; padding: 0px 5px; font-size: 14px; color: blue; cursor:pointer" onmouseover="this.style.color='red'" onmouseout="this.style.color='blue'" > Cancel </a>
                `;
            } else {
                this.elGui.innerHTML = `                    
                <Button class="action-button edit" data-action="edit" variant="outlined" color="primary" (click)="handleUpdate(params.data)" style="height:20px;">Edit</Button>
                <Button class="action-button delete" data-action="delete" variant="outlined" color="secondary" style="height:20px;">Delete</Button>                    
                `;
            }
            return this.elGui;
        },           
        enableRowGroup: false,
        menuTabs: [],
        editable: false,
        cellClass: "ag-header-group-cell-label",
        cellStyle: function (params:any) {
            if (params.value != '') {
            return {
                textAlign: 'center',
                display: 'flex',
            };
            } else {
            return {
                textAlign: 'center',
            }
            }
        },
        minWidth: el.minWidth, 
        maxWidth: el.maxWidth,
        }

        return vwLnkFld;
    }

    private setViewLinkIdField(el:any) {
        const vwLnkFld = {
            headerName: el.headerName,
            field: el.field,
            cellRenderer: function (params:any) {
              //const siteUrl = window.location.href + el.siteUrl;
              const url = "https://portal.bergerbd.com/" +  el.siteUrl + params.data.ID + el.mode;
    
              return '<a href="' + url+ '" >View</a>';
              //return '<a href="' + url+ '" target="_blank">View</a>';
    
            },
            enableRowGroup: false,
            menuTabs: ['generalMenuTab', 'columnsMenuTab'],
            editable: false,
            cellClass: "ag-header-group-cell-label",
            cellStyle: function (params:any) {
              if (params.value != '') {
                return {
                  textAlign: 'center',
                  display: 'flex',
                };
              } else {
                return {
                  textAlign: 'center',
                }
              }
            },
            minWidth: el.minWidth, 
            maxWidth: el.maxWidth,
          }
    
          return vwLnkFld;
    }

    private setViewOnTitleIDField(el:any) {
        const vwLnkFld = {
            headerName: el.headerName,
            field: el.field,
            cellRenderer: function (params:any) {
              //const siteUrl = window.location.href + el.siteUrl;
              const url = "https://portal.bergerbd.com/" +  el.siteUrl + params.data.ID + el.mode;
    
              //return '<a href="' + url+ '" target="_blank">View</a>';
              const title = params.data[el.field];

              return `<a href="${url}" onmouseover="Click to view and process">${title}</a>`;
    
            },
            enableRowGroup: false,
            menuTabs: ['generalMenuTab', 'columnsMenuTab'],
            editable: false,
            cellClass: "ag-header-group-cell-label",
            cellStyle: function (params:any) {
              if (params.value != '') {
                return {
                  textAlign: 'center',
                  display: 'flex',
                };
              } else {
                return {
                  textAlign: 'center',
                }
              }
            },
            minWidth: el.minWidth, 
            maxWidth: el.maxWidth,
          }
    
          return vwLnkFld;
    }

    private setGetSetDateField(el:any) {
        const dtFld = {
        headerName: el.headerName,
        valueGetter: function (params:any) { 
            if (params.data[el.valueGetter] != null && params.data[el.valueGetter] != undefined) { 
            return moment((params.data[el.valueGetter]).split("T")[0]).format("DD MMM, YYYY");
            } 
            return null;
        },
        //valueGetter: el.valueGetter,
        //valueGetter: function(params){return moment((params.data.Created).split("T")[0]).format("DD MMM, YYYY")},
        //valueSetter: el.valueSetter,
        sortable: true,
        enableRowGroup: true,
        filter: 'agDateColumnFilter',
        filterParams: {
            comparator: function (filterLocalDateAtMidnight:any, cellValue:any) {
            const dateAsString = moment(cellValue).format('DD/MM/YYYY');
            const dateParts = dateAsString.split('/');
            const cellDate = new Date(
                Number(dateParts[2]),
                Number(dateParts[1]) - 1,
                Number(dateParts[0])
            );
            if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
                return 0;
            }
            if (cellDate < filterLocalDateAtMidnight) {
                return -1;
            }
            if (cellDate > filterLocalDateAtMidnight) {
                return 1;
            }
            return null;
            },
            //applyButton: true,
            resetButton: true,
        },
        columnGroupShow: 'open',
        cellClass: "ag-header-group-cell-label",
        cellStyle: function (params:any) {
            if (params.value != '') {
            return {
                //color: 'red', 
                //backgroundColor: 'green',
                textAlign: 'center',
                display: 'flex',
            };
            } else {
            return {
                textAlign: 'center',
            }
            }
        },
        minWidth: el.minWidth, 
        maxWidth: el.maxWidth,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        editable: el.editable,
        cellEditor: 'agTextCellEditor',
        //cellEditorPopup: true,
        }

        return dtFld;
    }

    private setGetSetDateTimeField(el:any) {
        const dtFld = {
        headerName: el.headerName,
        valueGetter: function (params:any) { 
            if (params.data[el.valueGetter] != null && params.data[el.valueGetter] != undefined) { 
            return moment((params.data[el.valueGetter]).split("Z")[0]).format("DD MMM, YYYY HH:mm:ss"); 
            } 
            return null;
        },
        //valueGetter: el.valueGetter,
        //valueGetter: function(params){return moment((params.data.Created).split("T")[0]).format("DD MMM, YYYY")},
        //valueSetter: el.valueSetter,
        sortable: true,
        enableRowGroup: true,
        filter: 'agDateColumnFilter',
        filterParams: {
            comparator: function (filterLocalDateAtMidnight:any, cellValue:any) {
            const dateAsString = moment(cellValue).format('DD/MM/YYYY');
            const dateParts = dateAsString.split('/');
            const cellDate = new Date(
                Number(dateParts[2]),
                Number(dateParts[1]) - 1,
                Number(dateParts[0])
            );
            if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
                return 0;
            }
            if (cellDate < filterLocalDateAtMidnight) {
                return -1;
            }
            if (cellDate > filterLocalDateAtMidnight) {
                return 1;
            }
            return null;
            },
            //applyButton: true,
            resetButton: true,
        },
        columnGroupShow: 'open',
        cellClass: "ag-header-group-cell-label",
        cellStyle: function (params:any) {
            if (params.value != '') {
            return {
                //color: 'red', 
                //backgroundColor: 'green',
                textAlign: 'center',
                display: 'flex',
            };
            } else {
            return {
                textAlign: 'center',
            }
            }
        },
        minWidth: el.minWidth, 
        maxWidth: el.maxWidth,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        editable: el.editable,
        cellEditor: 'agTextCellEditor',
        //cellEditorPopup: true,
        }

        return dtFld;
    }

    private setGetSetTextField(el:any) {
        const txtFld = {
        headerName: el.headerName,
        //field: el.field,
        valueGetter: el.valueGetter,
        //valueGetter: function(params){if(params.data[el.valueGetter] != null && params.data[el.valueGetter] != undefined){console.log(el.valueGetter); return el.valueGetter}},
        //valueSetter: el.valueSetter,
        sortable: true,
        enableRowGroup: true,
        filter: 'agSetColumnFilter',
        filterParams: {
            resetButton: true,
        },
        minWidth: el.minWidth, 
        maxWidth: el.maxWidth,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        editable: el.editable,
        cellEditor: 'agTextCellEditor',
        cellClass: "ag-header-group-cell-label",
        cellStyle: function (params:any) {
            if (params.value != '') {
            return {
                textAlign: 'center',
                display: 'flex',
            };
            } else {
            return {
                textAlign: 'center',
            }
            }
        },
        }

        return txtFld;
    }

    private setGetSetNumberField(el:any) {
        const numFld = {
        headerName: el.headerName,
        //field: el.field,
        valueGetter: el.valueGetter,
        //valueSetter: el.valueSetter,
        sortable: true,
        enableRowGroup: true,
        filter: 'agNumberColumnFilter',
        //filter: 'agSetColumnFilter',
        filterParams: {
            resetButton: true,
        },
        minWidth: el.minWidth, 
        maxWidth: el.maxWidth,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        cellClass: "ag-header-group-cell-label",
        cellStyle: function (params:any) {
            if (params.value != '') {
            return {
                //color: 'red', 
                //backgroundColor: 'green',
                textAlign: 'center',
                display: 'flex',
            };
            } else {
            return {
                textAlign: 'center',
            }
            }
        },
        editable: el.editable,
        cellEditor: 'agTextCellEditor'
        }
        return numFld;
    }

    private setCustomLinkField(el:any) {
        const vwLnkFld = {
        headerName: el.headerName,
        field: el.field,
        // cellRenderer: (params:any)=> {
        //   return '<a href="https://portal.bergerbd.com/leaveauto/SitePages/' + this.dashboardsListsInfo[i.listIndex].WfName + '.aspx?UniqueId=' + params.value + '&mode=read" target="_blank">View</a>';    
        // },
        enableRowGroup: false,
        menuTabs: ['generalMenuTab', 'columnsMenuTab'],
        editable: false,
        cellClass: "ag-header-group-cell-label",
        cellStyle: function (params:any) {
            if (params.value != '') {
            return {
                textAlign: 'center',
                display: 'flex',
            };
            } else {
            return {
                textAlign: 'center',
            }
            }
        },
        minWidth: el.minWidth, 
        maxWidth: el.maxWidth,
        }

        return vwLnkFld;
    }

    private setGetSetPeopleField(el:any) {
        const txtFld = {
        headerName: el.headerName,
        //field: el.field,
        valueGetter: function (params:any) {
            let pending = "";
            if (typeof params.data[el.valueGetter].results == "object") {
            if (params.data[el.valueGetter].results.length > 0) {
                
                for (let i = 0; i < (params.data[el.valueGetter].results.length); i++) {
                pending += params.data[el.valueGetter].results[i].Title + ';  ';
                }
                // (params.data[el.valueGetter].results).forEach(ele => {
                //   pending += ele.Title + ';  ';
                //   return pending;
                // }); 
                return pending;
                //return params.data[el.valueGetter].results.length;         
            }
            //return params.data[el.valueGetter].results.length;
            //return params.data[el.valueGetter].results[0].Title;
            }
            return pending;
            //return '';
        },
        //valueSetter: el.valueSetter,
        sortable: true,
        enableRowGroup: true,
        filter: 'agSetColumnFilter',
        filterParams: {
            resetButton: true,
        },
        cellStyle: { 'white-space': 'normal', 'line-height': 1.5 },
        autoHeight: true,
        minWidth: el.minWidth, 
        maxWidth: el.maxWidth,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        //cellClass: "ag-header-group-cell-label",
        // cellStyle: function(params) {
        //   if (params.value !='') {
        //       return {
        //       textAlign: 'center', 
        //       display: 'flex',
        //     };
        //   } else {
        //       return {
        //         textAlign: 'center',
        //       }
        //     }
        // },    
        }

        return txtFld;
    }

    private setGetSetMulLinTextField(el:any){
        const txtFld = {
        headerName: el.headerName,
        //field: el.field,        
        valueGetter: function (params:any) {
            return params.data[el.valueGetter];
        },
        //valueSetter: el.valueSetter,
        sortable: true,
        enableRowGroup: true,
        filter: 'agSetColumnFilter',
        filterParams: {
            resetButton: true,
        },
        minWidth: el.minWidth, 
        maxWidth: el.maxWidth,
        menuTabs: ['filterMenuTab', 'generalMenuTab'],
        cellClass: "ag-header-group-cell-label",
        cellStyle: { 'white-space': 'normal', 'line-height': 1.5 },
        autoHeight: true,
        editable: el.editable,
        cellEditor: 'agLargeTextCellEditor',
        cellEditorPopup: true,   
        }

        return txtFld;
    }    
           
  
    fieldMapper(element:any) {

        const ftype = element.fldType;

        const mapper:any = {
            "TitleWithMDField": this.setTitleWithMDField(element),
            "TitleWitouthMDField": this.setTitleWitouthMDField(element),
            "DateField": this.setDateField(element),
            "TextField": this.setTextField(element),
            "LargeTextField": this.setLargeTextField(element),
            "NumberField": this.setNumberField(element),
            "GetSetDateField": this.setGetSetDateField(element),
            "GetSetDateTimeField": this.setGetSetDateTimeField(element),
            "GetSetTextField": this.setGetSetTextField(element),
            "GetSetLargeTextField": this.setLargeTextField(element),
            "GetSetNumberField": this.setGetSetNumberField(element),
            "CustomLinkField": this.setCustomLinkField(element),
            "GetSetPeopleField": this.setGetSetPeopleField(element),
            "GetSetMulLinTextField": this.setGetSetMulLinTextField(element),
            "SelectField": this.setSelectField(element),
            "ActionViewLinkGuidField": this.setActionViewLinkGuidField(element),
            "ViewLinkGuidField": this.setViewLinkGuidField(element),
            "ViewLinkUrlField": this.setViewLinkUrlField(element),
            "ViewLinkIdField": this.setViewLinkIdField(element),
            "ViewOnTitleIdField": this.setViewOnTitleIDField(element), 
            "ViewOnTitleUrlField": this.setViewOnTitleUrlField(element)
            
        }

        return mapper[ftype]
        
    };
}