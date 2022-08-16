export class DeliverymanCreateViewModel {
    ID: number = 0;
    EnrollID: string;
    BranchID: number;
    Name: string;
    UserName: string;
    Password: string;
    Email: string;
    Mobile: string;
    Address: string;
    NationalID: string;
    ServicesID: number[] = []
}

export class AgentChangeStoreViewModel {
    ID: number;
    StoreID: number
}