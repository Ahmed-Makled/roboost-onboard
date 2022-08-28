import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DummyDataService {

  DummyTrips = []
  DummyAgents = []
  DummyStores = []
  DummyOrders = []
  DummyTaskDispatchKpi = {
    "AvgDeliveryTime": 11.8,
    "TotalOrders": 66,
    "DeliveredOrders": 24,
    "CanceledOrders": 1
  };
  DummyTripDispatchKpi = {
    "ExcellentTrips": 100.0
  };

  StoreListNames = [
    'Zalando', 'Mansoura Store', 'Smart Store', 'Shopperia Store', 'RedFox Store', 'Magnolia Store',
    'Foodology Store', 'Dollarhut', 'Costco Store', 'Etsy Store', 'Ocado'
  ]
  AgentListNames = [
    'James', 'Robert', 'John', 'Michael', 'David', 'William',
    'Richard', 'Joseph', 'Thomas', 'Charles', 'Daniel'
  ]
  AddressListNames = [
    'Cairo', 'Giza', 'Madīnat as Sādis min Uktūbar', 'Shubrā al Khaymah', 'Al Maḩallah al Kubrá', 'Al Fayyūm',
    'Az Zaqāzīq', 'Ismailia', 'Damietta', 'Shibīn al Kawm', 'Al Qūşīyah'
  ]

  CustomerListNames = [
    'خالد كشميري', 'يَعقوب قمر الدين دبيازة', 'محمد سمبل', 'خضر كراويتة', 'عثمان عبد الجليل ششا', 'Al Fayyūm',
    'خالد كشميري', 'يَعقوب قمر الدين دبيازة', 'محمد سمبل', 'خضر كراويتة', 'عثمان عبد الجليل ششا', 'Al Fayyūm',
  ]
  constructor() {
    this.GenerateData()

  }


  GenerateData() {
    for (let i = 1; i < 10; i++) {

      let storObj = {
        "Name": this.StoreListNames[i], "Code": `p3sqRmBHLcN+${i}`, "ID": `${i}`, "Longitude": 31.340478, "Latitude": 30.0796471,
        "NumberOfAgents": `${i}`, "NumberOfTrips": i, "NumberOfTasks": 13,
      }

      // let orderObjTrip = {
      //   "ID": `3691741${i}`, "TripID": `1941874${i}`, "CustomerID": 0, "BranchID": ` ${i}`, "AreaID": `1097${i}`,
      //   "BranchName": this.StoreListNames[i],
      //   "OrderNumber": `AE5AA554-7${i}`, "Code": `7w1HQXoJ6P${i}`, "Name": this.CustomerListNames[i], "Mobile": null,
      //   "Address": 'الشيخ زايد- 236 الحي التاسع المجاورة.', "ServicesCount": 0,
      //   "PlannedDistance": 184.09, "Distance": 0, "PlannedDeliveryTime":  new Date(),
      //   "Date": new Date(), "SpentTime": 92728, "RemainingTime": 60,
      //   "DeliveryTimeStatusName": null, "DeliveryTimeStatus": 0, "DistanceStatus": 0, "DistanceStatusName": null,
      //   "Duration": 0, "Priority": null, "Amount":66.66, "Status": randomArrayShuffle([2]), "StatusName": null,
      //   "PlannedLongitude": 29.9697291, "PlannedLatitude": 31.2398227,
      //   "Longitude": 0, "Latitude": 0, "HasGoogleLocation": true,
      //   "IsTopPriority": false, "IsPaused": false, "Rate": 0,
      //   "RateName": null, "Note": null, "OrderDeliveryTime": `${i}`, "IsTransite": false,
      //   "District": null, "ServicesData": null, "Services": null
      // }

      let orderObjTrip = {
        "ID": `3691741${i}`,
        "TripID": `186${i}`,
        "CustomerID": 0,
        "BranchID": ` ${i}`,
        "AreaID": `1${i}`,
        "BranchName": this.StoreListNames[i],
        "OrderNumber": `17355${i}`,
        "Code": `1ST68P5Yg4${i}`,
        "Name": this.CustomerListNames[i],
        "Mobile": '01066181942',
        "Address": 'الشيخ زايد- 236 الحي التاسع المجاورة.',
        "ServicesCount": 0,
        "PlannedDistance": 0.24,
        "Distance": 0,
        "PlannedDeliveryTime": "2022-08-24T12:40:00",
        "Date": "2022-08-24T12:10:00",
        "SpentTime": 511,
        "RemainingTime": 1288,
        "DeliveryTimeStatusName": null,
        "DeliveryTimeStatus": 0,
        "DistanceStatus": 0,
        "DistanceStatusName": null,
        "Duration": 0,
        "Priority": null,
        "Amount": 0.05,
        "Status": 2,
        "StatusName": null,
        "PlannedLongitude": 30.9986335,
        "PlannedLatitude": 30.7918739,
        "Longitude": 0,
        "Latitude": 0,
        "HasGoogleLocation": true,
        "IsTopPriority": false,
        "IsPaused": false,
        "Rate": 0,
        "RateName": null,
        "Note": null,
        "OrderDeliveryTime": 30,
        "IsTransite": false,
        "District": null,
        "ServicesData": null,
        "DeliveryVerificationCode": null,
        "Services": null
      }




      let orderObj
      let orders = []
      for (let j = 1; j < 5; j++) {
        orders.push(orderObjTrip)
        let agentObj = {
          "ID": `11${i}`, "Name": this.AgentListNames[i], "StatusName": "On Duty", "StatusID": randomArrayShuffle([2, 1, 3, 3, 1, 2]),
          "StatusColor": randomArrayShuffle(['#03A8FF', '#32cc3e', '#e61721']), "Image": "./assets/image/onboard/" + i + '.jpg',
          "BranchID": `${i}`, "BranchName": this.StoreListNames[i], "AreaID": `1097${i}`, "Longitude": 31.390185, "Latitude": 30.0539764
        }
        this.DummyAgents.push(agentObj)

      }
      for (let j = 1; j < 10; j++) {
        orderObj = {
          "ID": `3691741${j}`, "TripID": null, "CustomerID": 0, "BranchID": ` ${i}`, "AreaID": `1097${i}`,
          "BranchName": this.StoreListNames[i],
          "OrderNumber": `AE5AA554-7${j}`, "Code": `7w1HQXoJ6P${j}`, "Name": this.CustomerListNames[i], "Mobile": null,
          "Address": 'الشيخ زايد- 236 الحي التاسع المجاورة.', "ServicesCount": 0,
          "PlannedDistance": 184.09, "Distance": 10, "PlannedDeliveryTime": new Date(),
          "Date": new Date(), "SpentTime": 10, "RemainingTime": 60,
          "DeliveryTimeStatusName": null, "DeliveryTimeStatus": 0, "DistanceStatus": 0, "DistanceStatusName": null,
          "Duration": 0, "Priority": null, "Amount": 66.66, "Status": j == 1 ? 1 : randomArrayShuffle([9, 1, 9, 9, 9, 1, 9, 1, 1, 1, 9, 1, 9]), "StatusName": null,
          "PlannedLongitude": 29.9697291, "PlannedLatitude": 31.2398227,
          "Longitude": 0, "Latitude": 0, "HasGoogleLocation": true,
          "IsTopPriority": j == 1 ? false : randomArrayShuffle([false, false, true, false, false, true, true, false, true, true, true, false, true, false, false, false,]), "IsPaused": j == 1 ? false : randomArrayShuffle([true, false]), "Rate": 0,
          "RateName": null, "Note": null, "OrderDeliveryTime": `${j}`, "IsTransite": randomArrayShuffle([true, false, true, false, false, true, true, false, true, true, true, false, true, false, false, false,]),
          "District": null, "ServicesData": null, "Services": [{ "ServiceID": 7, "Name": "قياس السكر", "Image": "https://api.tayar.info/uploads/icon/Default_Service.png", "OrderID": 0 }, { "ServiceID": 6, "Name": "قياس ضغط الدم", "Image": "https://api.tayar.info/uploads/icon/Default_Service.png", "OrderID": 0 }, { "ServiceID": 4, "Name": "مشاوير صيدليه", "Image": "https://api.tayar.info/uploads/icon/Default_Service.png", "OrderID": 0 }]
        }
        this.DummyOrders.push(orderObj)

      }



      // let tripObj = {
      //   "ID": `1941874${i}`, "Number": `225${i}`, "Code": `OfKOPgqmFk${i}`, "DeliverymanID": `11${i}`, "DeliverymanName": this.AgentListNames[i],
      //   "DeliverymanImage":"./assets/image/onboard/"+i+'.jpg', "BranchID": `${i}`,
      //   "AreaID": `1097${i}`, "BranchName": this.StoreListNames[i], "Status": 10,
      //   "StatusName": "Started", "StartTime": null,
      //   "CloseTime": null, "CreatedDate": "2022-08-24T12:12:17.0503048", "RateStatus": 0, "RateStatusName": "NOT_RATED",
      //   "PlannedCompleteTime": "2022-08-24T13:22:16.9575477", "IsPaused": false, "PlannedDuration": 0,
      //   "ServingTime": 5, "SpentTime": 92770, "ExcelantMaxTime": 315, "GoodMaxTime": 375, "LateMaxTime": 450,
      //   "Performance": { "ID": 186883, "Rate": 1, "StatusName": "EXCELLENT", "RemainingTime": 315, "Color": "#47bd83" },
      //   "PlannedCompleteTimeInt": -97075, "IsSpecialTrip": false, "ArrivalTime": new Date(),
      //   "PickupTime":  new Date(), "ArrivalTimeSecond": 6,
      //   "Orders": orders
      // }

      let tripObj = {
        "ID": `186${i}`,
        "Number": `225${i}`,
        "Code": `OfKOPgqmFk${i}`,
        "DeliverymanID": `11${i}`,
        "DeliverymanName": this.AgentListNames[i],
        "DeliverymanImage": "./assets/image/onboard/" + i + '.jpg',
        "BranchID": `${i}`,
        "AreaID": `1${i}`,
        "BranchName": this.StoreListNames[i],
        "Status": 10,
        "StatusName": "Started",
        "StartTime": "2022-08-24T12:15:43.7360339",
        "CloseTime": null,
        "CreatedDate": "2022-08-24T12:12:17.0503048",
        "RateStatus": 0,
        "RateStatusName": "NOT_RATED",
        "PlannedCompleteTime": "2022-08-24T13:22:16.9575477",
        "IsPaused": false,
        "PlannedDuration": 0,
        "ServingTime": 5,
        "SpentTime": 171,
        "ExcelantMaxTime": 315,
        "GoodMaxTime": 375,
        "LateMaxTime": 450,
        "Performance": {
          "ID": 186883,
          "Rate": 1,
          "StatusName": "EXCELLENT",
          "RemainingTime": 148,
          "Color": "#47bd83"
        },
        "PlannedCompleteTimeInt": 138,
        "IsSpecialTrip": false,
        "ArrivalTime": "2022-08-24T13:22:16.9575477",
        "PickupTime": null,
        "ArrivalTimeSecond": 0,
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
  return array[0]


}
