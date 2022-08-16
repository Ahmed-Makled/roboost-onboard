export class BroadcastViewModel
{
    Code:string;
    Title?: String;
    CreatedDate:any=new Date();
    Sent?: number;
    SentPercentage?: number;
    Recieved?: number;    
    RecievedPercentage?: number;
    Viewed?:number;
    ViewedPercentage?: number;
    IsActive:boolean;
}

export class BroadcastSearchViewModel {
    Code?:number;
    FromDate:any=new Date();
    ToDate:any=new Date();
}

