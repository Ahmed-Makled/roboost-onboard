export class TaskLogViewModel {
  ID: number
  BranchID: number
  IsLoading: boolean = false
  Items: [
    {
      Name: string
      Image: string
      ServiceID: number
      Price: number
      Quantity: number
    }
  ]
  Services: [
    {
      Name: string
      Image: string
      ServiceID: number
      Price: number
      Quantity: number
    }
  ]
  Logs: [
    {
      Action: number
      ActionName: string
      CreatedDate: any
    }
  ]
}

export class TripLogViewModel {
  IsLoading: boolean = false
  Logs: [
    {
      ID: number
      Action: number
      ActionName: string
      CreatedDate: any
      
    }
  ]
}
