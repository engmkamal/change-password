export interface ISystemDetail {
    SystemType?: any;
    SystemModule?: any;
    SAPCustomerNumber?: any;
    SUser?: any;
    Manufacturer?: any;
    Model?: any;              
    OperatingSystem?: any;
    OSRelease?: any;
    DatabaseName?: any;
    DatabaseRelease?: any;
    PersonIncharge?: any;
    SIContactNo?: any;
    SIEmail?: any;  
  }
  
  export interface ICustomer {
    CustId: any;
    CustPassword: any;
    CustName: any;
    CustCompanyName: any;
    CustCompany1stAddress?: any;
    CustCompany2ndAddress?: any;
    CustCompany3rdAddress?: any;
    Cust1stEmail: any;
    Cust2ndEmail: any;
    Cust3rdEmail: any;
    Cust1stPhone?: any;
    Cust2ndPhone?: any;
    Cust3rdPhone?: any;
    Cust1stMobile?: any;
    Cust2ndMobile?: any;
    Cust3rdMobile?: any;
    CustDesignation?: any;  
    RegistrationDate?: any;
    SystemDetails?: ISystemDetail[];  
  }