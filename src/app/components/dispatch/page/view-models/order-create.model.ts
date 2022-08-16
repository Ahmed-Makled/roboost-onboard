import { SelectItem } from "src/app/model/shared/select-view-model";

export class OrderCreateViewModel{
    OrderNumber:string
    CustomerName:string=""
    CustomerMobile:string
    CustomerSerialNumber:string
    IsTopPriority:boolean =false;
    MaxPreperationTime:number = 0 ;
    FastOrderReasonID:number=1;
    BranchID:number;
    FastOrderReasonNote:string
    Address:string
    NewAddress:string
    Items:OrderItemModel[]=[]
    Services:SelectItem[]=[]
    IsPaused: boolean =false;
    IsCustomerSearched:boolean =false;
    isNewCustomer:boolean = false
    isNewAddress:boolean = false
    isOtherReason:boolean = false
}
export class OrderItemModel {
    ID: number;
    Name:string;
    Code:string;
    Image:string;
    Price:number;
    PreparationTime:number;
    Quantity: number =1;
    TotalPrice:number;
    IsOnCart:boolean=false
}

export class ShippingAddressViewModel {
    ID: number;
    Address:string;
}
export class ServiceItemViewModel{
    ID :number
    Name :string
    Icon ?:string
    Code:string;
    ServingTime? :number
    Selected?: boolean =false
}
