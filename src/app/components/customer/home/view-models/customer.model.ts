export class CustomerViewModel {
    ID: number
    Number: number
    Name: string
    Mobile: string
    OrdersCount: number
    ShippingAddresses: number
    CreatedDate: Date
    IsSelected: boolean
    IsTopPriority: boolean
    IsTransite:boolean
    BranchName :string

    
}
// export class CustomerProfileViewModel {
//     ID: number
//     CreatedDate: Date
//     BranchID: number;
//     BranchName: string;
//     Name: string
//     Code: string
//     Number: string
//     Mobile: string
//     Email: string
//     IsActive: boolean
//     ShippingAddresses: ShippingAddressViewModel[]
//     Orders: CustomerOrderViewModel[];
// }
 export class CustomerOrderViewModel {
    ID: number
    OrderNumber: string
    Amount: number
    PlannedDeliveryTime: Date
    DeliveryTime: Date
    Date: Date
    Address: string
}
