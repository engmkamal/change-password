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
            { "fldType": "ViewOnTitleUrlField", "headerName": "Request ID", "field": "RequestLink", "editable":false, "minWidth": 120, "maxWidth": 160 },
            { "fldType": "TextField", "headerName": "Support Subject", "field": "Subject", "editable":false, "minWidth": 200, "maxWidth": 300 },            
            { "fldType": "TextField", "headerName": "Priority", "field": "Priority", "editable":false, "minWidth": 160, "maxWidth": 200 },
            { "fldType": "TextField", "headerName": "Status", "field": "Status", "editable":false, "minWidth": 150, "maxWidth": 200 },
            { "fldType": "TextField", "headerName": "Pending To", "field": "AllPendingTo", "editable":false, "minWidth": 150, "maxWidth": 200 },
            { "fldType": "GetSetDateTimeField", "headerName": "Created Date Time", "field": "Created", "valueGetter":"Created", "editable":false, "minWidth": 150, "maxWidth": 250 }
        ],
        "MasterDetailViewColDef": []
    }
]
