[
    {
        "WfName": "PendingApproval",
        "AcessPermission": "Public", 
        "AuthGroups": ["Berger Portal Owners"],
        "AuthUsersADId": [208, 296, 350, 21, 1026],
        "AuthUsersEmpId": [1270, 334],  
        "DisplayTxt": "Pending Approval",
        "ViewUrl": { "siteUrl": "leaveauto/SitePages/PendingApproval.aspx?UniqueId=", "qryStrKeyTyp": "GUID", "mode": "&mode=read", "titleTag": "ITSR-" },
        "MasterListInfo": { "name": "PendingApproval", "select": "GUID,ID,Title,ProcessName,RequestedByName,Status,EmployeeID,RequestedByEmail,RequestLink,PendingWith/ID,PendingWith/Title,Author/ID,Created,Author/Title,Author/Office,Author/JobTitle,Modified&$expand=PendingWith/ID,Author/ID&$orderby=Created desc", "primaryKey": "Title"},
        "RenderDetListInfo": [{ "name": "PendingApproval", "select": "GUID,ID,Title,ProcessName,RequestedByName,Status,EmployeeID,RequestedByEmail,RequestLink,PendingWith/ID,PendingWith/Title,Author/ID,Created,Author/Title,Author/Office,Author/JobTitle&$expand=PendingWith/ID,Author/ID&$orderby=Created desc"}],
        "DetailsListInfo": [{ "name": "PendingApproval", "select": "GUID,ID,Title,ProcessName,RequestedByName,Status,EmployeeID,RequestedByEmail,RequestLink,PendingWith/ID,PendingWith/Title,Author/ID,Created,Author/Title,Author/Office,Author/JobTitle&$expand=PendingWith/ID,Author/ID&$orderby=Created desc", "primaryKey": "Title"}],
        "DbViewColDef": [
            { "fldType": "ViewOnTitleUrlField", "headerName": "Request ID", "field": "ProcessLink", "editable":false, "minWidth": 120, "maxWidth": 160 },
            { "fldType": "TextField", "headerName": "Customer Id", "field": "CustId", "editable":false, "minWidth": 160, "maxWidth": 300 },            
            { "fldType": "TextField", "headerName": "Requested by", "field": "CustName", "editable":false, "minWidth": 160, "maxWidth": 280 },
            { "fldType": "TextField", "headerName": "Company Name", "field": "CustCompanyName", "editable":false, "minWidth": 160, "maxWidth": 280 },
            { "fldType": "TextField", "headerName": "Email", "field": "Cust1stEmail", "editable":false, "minWidth": 160, "maxWidth": 280 },
            { "fldType": "TextField", "headerName": "RegistrationFor", "field": "RegistrationFor", "editable":false, "minWidth": 160, "maxWidth": 280 },
            { "fldType": "TextField", "headerName": "Status", "field": "Status", "editable":false, "minWidth": 150, "maxWidth": 500 },
            { "fldType": "GetSetDateTimeField", "headerName": "Created Date Time", "field": "Created", "valueGetter":"Created", "editable":false, "minWidth": 150, "maxWidth": 250 }
        ],
        "MasterDetailViewColDef": []
    }
]
