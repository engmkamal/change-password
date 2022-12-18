export interface IProcessLog {
    CustId: string;
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
    CustId: string;
    ActionBy: any;        
    ActionDate: any;
    AttachmentFiles: IAttachmentFiles[];
    Attachments: boolean;
    ID: number;
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
    BergerTechIncharge: string;
    BergerTechInchargeContactNo: string;
    BergerTechInchargeEmail: string;
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
    CustPassword?: any;
    CustName: string;
    CustCompanyName: string;
    CustCompany1stAddress?: string;
    CustCompany2ndAddress?: string;
    CustCompany3rdAddress?: string;
    Cust1stEmail: string;
    Cust2ndEmail?: string;
    Cust3rdEmail: string;
    Cust1stPhone?: string;
    Cust2ndPhone: string;
    Cust3rdPhone?: string;
    Cust1stMobile: string;
    Cust2ndMobile?: string;
    Cust3rdMobile?: string;
    CustDesignation?: string;
    //PendingTo?: string;
    //Status?: string; 
  }
  
  export interface IAppParameters {
    SystemDetails: ISystemDetail[];
    Requestor: IRequestor;
    Attachments?: IAttachment[];
    ProcessLogs: IProcessLog[];                     
  }
  
  export interface ISupModel {
    uId?: any;
    readMode?: any;
    ID?: any;
    Title?: any;
    Status?: any;
    AppParameters?: IAppParameters;
    PendingWith?: any;
    RequestorAdId?: any;
  }