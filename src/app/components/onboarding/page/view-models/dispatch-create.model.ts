export class SpecialTripViewModel{
    DeliverymanID:number
    BranchID:number
    OrdersID:number[]=[]
    SpecialTripReasonID :number = 1
    SpecialTripReasonNote:string
 }

export class ScheduledOrderViewModel {
    OrderID: number;
    ScheduledTime: any = new Date;
    ScheduledDateTime: any = "13:00";
}

export class UpdateOrderInfoViewModel {
    OrderID: number
    Address: string
    Note: string
    ServicesID: number[] = []
}