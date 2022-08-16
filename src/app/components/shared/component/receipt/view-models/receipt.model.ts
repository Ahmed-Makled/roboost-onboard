export class ReceiptViewModel {
  ID: number
  CompanyName: string
  CompanyMobile: string
  CompanyLogo: string
  OrderNumber: string
  Date: any
  BranchName: string
  BranchPhone: string
  PaymentMethod: string
  CustomerName: string
  CustomerAddress: string
  CustomerMobile: string
  Items: [
    {
      Name: string
      Price: number
      Quantity: number
      Total: number
    }
  ]
  TotalItems: number
  SubAmount: number
  SalesVAT: number
  SalesVATAmount: number
  Discount: number
  DiscountAmount: number
  DeliveryFees: number
  TotalAmount: number
  TotalAfterDiscount: number
  BalanceDue: number
  Footer: string
  CanShowBalanceDue:boolean
  TaxAmount:number
}
