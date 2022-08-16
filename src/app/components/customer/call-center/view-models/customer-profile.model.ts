import { CustomerShippingAddressViewModel } from './customerr-shipping-address.model';
import { CustomerOrderViewModel } from './customer-order.model';

export class CustomerProfileViewModel {
    ID: number
    CreatedDate: Date
    BranchID: number;
    BranchName: string;
    Name: string
    Code: string
    Number: string
    Mobile: string
    Email: string
    IsActive: boolean
    ShippingAddresses: CustomerShippingAddressViewModel[]
    Orders: CustomerOrderViewModel[];

}