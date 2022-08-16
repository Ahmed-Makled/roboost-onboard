import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DummyDataService {

  DummyTrips = []
  DummyAgents = []
  DummyStores = []
  DummyOrders = []

  StoreListNames = [
    'Zalando', 'Mansoura Store', 'Smart Store', 'Shopperia Store', 'RedFox Store', 'Magnolia Store',
    'Foodology Store', 'Dollarhut', 'Costco Store', 'Etsy Store', 'Ocado'
  ]
  AgentListNames = [
    'James', 'Robert', 'John', 'Michael', 'David', 'William',
    'Richard', 'Joseph', 'Thomas', 'Charles', 'Daniel'
  ]
  constructor() {
    this.GenerateData()

  }


  GenerateData() {
    for (let i = 1; i < 10; i++) {

      let storObj = {
        "Name": this.StoreListNames[i], "Code": `p3sqRmBHLcN+${i}`, "ID": `${i}`, "Longitude": 31.340478, "Latitude": 30.0796471,
        "NumberOfAgents": `${i}`, "NumberOfTrips": ` ${i}`, "NumberOfTasks": `${i}`
      }

      let orderObjTrip = {
        "ID": `3691741${i}`, "TripID": `1941874${i}`, "CustomerID": 0, "BranchID": ` ${i}`, "AreaID": `1097${i}`,
        "BranchName": this.StoreListNames[i],
        "OrderNumber": `AE5AA554-7${i}`, "Code": `7w1HQXoJ6P${i}`, "Name": null, "Mobile": null,
        "Address": " محطة شدس براج الزهور 2 16- - الدور شقة ", "ServicesCount": 0,
        "PlannedDistance": 184.09, "Distance": 0, "PlannedDeliveryTime": "2022-07-31T12:11:03.16",
        "Date": "2022-07-31T11:31:03", "SpentTime": 92728, "RemainingTime": -90328,
        "DeliveryTimeStatusName": null, "DeliveryTimeStatus": 0, "DistanceStatus": 0, "DistanceStatusName": null,
        "Duration": 0, "Priority": null, "Amount": 0, "Status": randomArrayShuffle([2, 3, 7]), "StatusName": null,
        "PlannedLongitude": 29.9697291, "PlannedLatitude": 31.2398227,
        "Longitude": 0, "Latitude": 0, "HasGoogleLocation": true,
        "IsTopPriority": `${i % 2 == 1 ? true : false}`, "IsPaused": `${i % 2 == 0 ? true : false}`, "Rate": 0,
        "RateName": null, "Note": null, "OrderDeliveryTime": `${i}`, "IsTransite": `${i % 2 == 0 ? true : false}`,
        "District": null, "ServicesData": null, "Services": null
      }



      let orderObj
      let orders = []
      // for (let j = 1; j < 5; j++) {
        orders.push(orderObjTrip)
        let agentObj = {
          "ID": `11${i}`, "Name": this.AgentListNames[i], "StatusName": "On Duty", "StatusID": randomArrayShuffle([2, 1,3]),
          "StatusColor":  randomArrayShuffle(['#03A8FF', '#32cc3e','#e61721']), "Image": "https://api.roboost.app/uploads/deliverymen/deliveryman_character.png",
          "BranchID": `${i}`, "BranchName": this.StoreListNames[i], "AreaID": `1097${i}`, "Longitude": 31.390185, "Latitude": 30.0539764
        }
        this.DummyAgents.push(agentObj)

      // }
      for (let j = 1; j < 30; j++) {
        orderObj = {
          "ID": `3691741${j}`, "TripID": `1941874${i}`, "CustomerID": 0, "BranchID": ` ${i}`, "AreaID": `1097${i}`,
          "BranchName": this.StoreListNames[i],
          "OrderNumber": `AE5AA554-7${i}`, "Code": `7w1HQXoJ6P${j}`, "Name": null, "Mobile": null,
          "Address": " محطة شدس براج الزهور 2 16- - الدور شقة ", "ServicesCount": 0,
          "PlannedDistance": 184.09, "Distance": 0, "PlannedDeliveryTime": "2022-07-31T12:11:03.16",
          "Date": "2022-07-31T11:31:03", "SpentTime": 92728, "RemainingTime": -90328,
          "DeliveryTimeStatusName": null, "DeliveryTimeStatus": 0, "DistanceStatus": 0, "DistanceStatusName": null,
          "Duration": 0, "Priority": null, "Amount": 0, "Status": randomArrayShuffle([1, 9]), "StatusName": null,
          "PlannedLongitude": 29.9697291, "PlannedLatitude": 31.2398227,
          "Longitude": 0, "Latitude": 0, "HasGoogleLocation": true,
          "IsTopPriority": randomArrayShuffle([true, false]), "IsPaused": randomArrayShuffle([true, false]), "Rate": 0,
          "RateName": null, "Note": null, "OrderDeliveryTime": `${j}`, "IsTransite": randomArrayShuffle([true, false]),
          "District": null, "ServicesData": null, "Services": null
        }
        this.DummyOrders.push(orderObj)

      }



      let tripObj = {
        "ID": `1941874${i}`, "Number": `225${i}`, "Code": `OfKOPgqmFk${i}`, "DeliverymanID": `11${i}`, "DeliverymanName": this.AgentListNames[i],
        "DeliverymanImage": "https://api.roboost.app/uploads/deliverymen/deliveryman_character.png", "BranchID": `${i}`,
        "AreaID": `1097${i}`, "BranchName": this.StoreListNames[i], "Status": 10,
        "StatusName": "Started", "StartTime": "2022-07-31T11:30:38.2903258",
        "CloseTime": null, "CreatedDate": "2022-07-31T11:30:23.4584394", "RateStatus": 0, "RateStatusName": "NOT_RATED",
        "PlannedCompleteTime": "2022-07-31T12:40:23.3113493", "IsPaused": false, "PlannedDuration": 0,
        "ServingTime": 5, "SpentTime": 92770, "ExcelantMaxTime": 315, "GoodMaxTime": 375, "LateMaxTime": 450,
        "Performance": { "ID": 1941874, "Rate": 4, "StatusName": "TOO LATE", "RemainingTime": 0, "Color": "#b5062b" },
        "PlannedCompleteTimeInt": -97075, "IsSpecialTrip": false, "ArrivalTime": "2022-07-31T16:52:58.28",
        "PickupTime": "2022-07-31T16:53:04.557", "ArrivalTimeSecond": 6,
        "Orders": orders
      }
      this.DummyTrips.push(tripObj)
      this.DummyStores.push(storObj)
    }
  }



}
// j % 2 == 1 ? true : false

function randomArrayShuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
    return array 

   
}
