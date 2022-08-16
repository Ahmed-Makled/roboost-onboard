export class OrderCreateViewModel {
    ID: string
    Date: Date
    Total: number
    APIKey: string;
    Customer: CustomerCreateViewModel = new CustomerCreateViewModel();
}

export class CustomerCreateViewModel {
    ID: string
    Name: string
    Mobile: string
    Address: AddressCreateViewModel = new AddressCreateViewModel()
}
export class AddressCreateViewModel {
    Street: string
    Building: string
    Floor: string
    Apartment: string
    Landmark: string
}

export class OrderFormViewModel {
    ID: string
    Date: Date
    Total: number
    CustomerID: string
    Name: string
    Mobile: string
    Street: string
    Building: string
    Floor: string
    Apartment: string
    Landmark: string
}