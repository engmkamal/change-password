export interface IAssignee {  
  rowId?: any;   
  Title?: string;
  TaskId?: string;
  AssignedToName?: string;
  AssignedToEmail?: string;
  AssignedToDesignation?: string;
  ExpectedTimeTaken?: number;
  ActualTimeTaken?: number,
  AssignedTaskStatus?: string,
  AcceptedTimeTaken?: number,
  AssigneeQuery?:string
};

export interface IAssignedTask { 
  rowId?: any;    
  Title: string;
  TaskId: string;
  TaskTitle: string;
  ExpectedStartDate: Date;
  ExpectedEndDate: Date;
  Assignees?: IAssignee[];
  ReporterId?: any;
  ReporterName?: any;
  ReporterEmail?: any;
};

  export interface ISupportQuery {
    Title: string;
    Created: any;        
    Status: string;
    ProcessByName: any;
    ProcessByEmail: string;
    QueryOrResponse: string;
  }

  export interface IProcessLog {
    Title: string;
    Created: any;        
    Status: string;
    ProcessByName: any;
    ProcessByEmail: string;
    Comments: string;
  }
  
  export interface IAttachmentFiles {
    FileName: any;
    ServerRelativeUrl: any; 
  }
  
  export interface IAttachment {
    Title: string;
    ActionBy: any;        
    ActionDate: any;
    AttachmentFiles: IAttachmentFiles[];
    Attachments: boolean;
    rowId?: any;
  };
  
  export interface ISystemDetail {
    rowId?: any;
    SystemType: string;
    SystemModule: string;        
    SAPCustomerNumber: string;
    SUser: string;
    SystemDescription: string;
    Manufacturer: string;
    Model: string;
    OperatingSystem: string;
    OSRelease: string;
    DatabaseName: string;
    DatabaseRelease: string;
    PersonIncharge: string;
    SIContactNo: string;
    SIEmail: string;
  };

  export interface ISystemDetailToDB {
    SystemType: string;
    SystemModule: string;        
    SAPCustomerNumber: string;
    SUser: string;
    SystemDescription: string;
    Manufacturer: string;
    Model: string;
    OperatingSystem: string;
    OSRelease: string;
    DatabaseName: string;
    DatabaseRelease: string;
    PersonIncharge: string;
    SIContactNo: string;
    SIEmail: string;
  };
  
  export interface IRequestor {
    CustId: string;
    CustName: string;
    CustCompanyName: string;
    CustCompany1stAddress?: string;
    Cust1stEmail: string;
    Cust1stMobile: string;
    CustDesignation?: string;
  }

  export interface IEmployee {
    EmpId: string;
    EmpName: string;
    EmpCompanyName: string;
    EmpCompany1stAddress?: string;
    Emp1stEmail: string;
    Emp1stMobile: string;
    EmpDesignation?: string;
  }
  
  export interface IAppParameters {    
    
    ProblemDescription: {
      RequestFor: string;
      RequestCategory: string;
      Subject: string;
      Description: string;
    };
    PriorityInfo: {          
      Priority: string;
      EmergContact?: string;
      BusinessImpact?: string;
      EmergContactNumber?: string;
      EmergContactEmail?: string;
    };
    Attachments?: IAttachment[];
    SystemDetail?: ISystemDetail;
    ProcessLogs?: IProcessLog[];
    Comments?: string;
    AssignedTasks?: IAssignedTask[];
    ChildInfo?: any;
    Action?:any;

  }
  
  export interface ISupModel {
    uId?: any;
    readMode?: any;
    ID?: any;
    Title?: any;
    Status?: any;
    Employee?: IEmployee;
    Requestor?: IRequestor;
    AppParameters?: IAppParameters;
    PendingTo?: any;
    Action?:any;
    RequestorAdId?: any;
    sapModules?: any;
    otherCategories?: any;
    OnBehalfOf?: boolean
  }

