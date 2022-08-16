export class BranchHomeViewModel {
  ID: number
  NameArabic: string
  NameEnglish: string
  Address: string
  DeliverymenCount:number;
  CreatedDate: Date
  APIKey: string
  IsActive: boolean
  IsDeleting: boolean
  LastOrder: Date
}


export class StoreCopyViewModel {
  CopyBranchID: number
  NameArabic: string
  NameEnglish: string
  APIKey: string
  StoreCode:string
}