import { WalletTransactionType } from "src/app/enum/wallet-transaction-type";

export class WalletTransactionViewModel {
    ID: number
    CreatedDate: Date;
    DeliverymanName: string;
    TripNumber: number;
    Type: WalletTransactionType;
    TypeName: string;
    Title: string;
    IsAward: boolean;
    Amount: number
    Note: string;
    IsDeleting:boolean;
    Balance:number;
    BranchName:string;
    BranchID :number
    IsSelected: boolean
}