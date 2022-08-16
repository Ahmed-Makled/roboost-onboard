import { TrackingNotification } from "./notification.model"

// export class TrackedPickupViewModel {
//   Pickup: PickupViewModel = new PickupViewModel()
//   PickUpUpdateOption: PickUpUpdateOption
//   Notification:TrackingNotification = new TrackingNotification()
// }
export enum PickUpUpdateOption {
  Create = 0,
  Sent_To_Agent = 1,
  Accept =2,
  Arrive =3,
  RecievePickUp = 4,
  ConfirmPickup =5,
  Ignore = 6,
  Delivered = 7,
  Cancel =8,
  Task_Updated = 9,
  Task_Delivered =10 ,
  Task_Can_Not_Deliver=11

}
