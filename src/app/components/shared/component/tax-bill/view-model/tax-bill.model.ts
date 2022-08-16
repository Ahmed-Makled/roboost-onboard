export class TaxBillViewModel{
  TotalAmountBeforeTax: number
  TotalOrdersAmountBeforeTax: number
  TotalKmAmountBeforeTax:number
  TaxPercentage:number
  TaxAmount: number
  TotalAmountAfterTax: number
  TotalOrdersAmountAfterTax: number
  TotalKmAmountAfterTax:number
  KmTaxAmount:number
  TaskTaxAmount:number
  Vendor:VendorViewModel= new VendorViewModel()
  Stores:StoreViewModel[]=[]
}
export class VendorViewModel{
  Name: string
  Logo: string
  KmRate: number
  TaskRate: number
  Address: string
  ProviderAddress: string
  ProviderPhone: string
  ProviderHotLine: string
  ProviderTaxNo: string
  ProviderRegistrationNo: string
  ProviderLogo: string
  ProviderBackgroundColor :string
}
export class StoreViewModel{
  StoreName: string
  OutOfZoneOrders: number
  TotalOrders: number
  TaskRate: number
  TasksDueAmount: number
  NoOfKMs: number
  KmRate: number
  KMsDueAmount: number
  TotalAmount: number
}