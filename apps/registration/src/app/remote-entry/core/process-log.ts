export class ProcessLog {

    constructor(
        public Title: string,
        public CustId: string,
        public ActionDate: Date,
        public Status: string,
        public ProcessByName: string,
        public ProcessByEmail?: string,
        public Comments?: string) {}   
    
    
}
