import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { OrderDetailsService } from '../order-details.service';
import { OrderDetailsViewModel } from '../view-models/order-details.model';
import { environment } from 'src/environments/environment';
import { MapLocation } from 'src/app/components/shared/component/map/view-models/Map.model';
import { OrderStatus } from 'src/app/enum/order-status.enum';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { StatusUtilsService } from 'src/app/service/status.service';
import { SharedService } from 'src/app/service/shared.service';
import { OrderLogViewModel } from '../view-models/order-log.model';
import { OrderAction } from 'src/app/enum/order-action.enum';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})

export class IndexComponent implements OnInit {

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _orderDetailsService: OrderDetailsService,
    private _statusUtilsService: StatusUtilsService,
    public _sharedService:SharedService
  ) { }

  page: CRUDIndexPage = new CRUDIndexPage();
  item: OrderDetailsViewModel = new OrderDetailsViewModel();
  orderLocation: MapLocation = new MapLocation();
  zoom = 8;
  previous;
  customerCollapsed = true;
  tripCollapsed = true;
  centerLine: number;
  startLine: number;
  role: string;
  IsShow: boolean
  ImageURl: string
  showMap: boolean = true;
  isArchived: boolean = false
  interval: any

  ngOnInit(): void {
    window.scrollTo(0, 0)
    if (!environment.production) {
      this.showMap = false
    }
    this.initializePage()
  }
  initializePage() {
    this.page.isPageLoaded = false
    this._activatedRoute.paramMap.subscribe(params => {
      this.item.Code = params.get('code')
    })
    this._activatedRoute.queryParamMap.subscribe(params => {
      this.isArchived = JSON.parse(params.get('isArchived'))
    })
      this._orderDetailsService.get(this.item.Code, this.isArchived)   .subscribe(res => {
      this.item = res.Data;
      this.item.TotalPrice = 0;
      this.item.OrderItems.forEach(element => {
        element.TotalPrice = element.Price * element.QTY
        this.item.TotalPrice += element.TotalPrice
        element.TotalPrice = Math.round(element.TotalPrice * 10) / 10
      });
      this.item.TotalPrice = Math.round(this.item.TotalPrice * 10) / 10



      // this.item.StatusColor = this._statusUtilsService.getColors(this.item.Rate);
      if (this.item.Latitude == 0 && this.item.PlannedLatitude > 0) {
        this.item.Latitude = this.item.PlannedLatitude
      }
      if (this.item.Longitude == 0 && this.item.PlannedLongitude > 0) {
        this.item.Longitude = this.item.PlannedLongitude
      }
      this.orderLocation.lng = this.item.PlannedLongitude
      this.orderLocation.lat = this.item.PlannedLatitude
      this.orderLocation.zoom = 18
      this.orderLocation.markers.push({ lat: this.item.PlannedLatitude, lng: this.item.PlannedLongitude })


      // this.item.OrderTrackcingLogs = this.getLogTrackingList()
      // this.item.OrderTrackcingLogs.forEach(element => {
      //   element.OrderStatusPosition = this.calcPosition(this.item.OrderTrackcingLogs.indexOf(element))
      // });
      
      // if (!this.isOrderDelivered() && this.item.Status != OrderStatus.CANCELED) {
      //   console.log('inside if');
      //   clearInterval(this.interval)
      //   this.interval = setInterval(() => {
      //     this.item.OrderTrackcingLogs.forEach(e => {
      //       e.OrderStatusPosition = this.getPosition(e.CreatedDate)
      //       e.OrderStatusPosition = this.calcPosition(this.item.OrderTrackcingLogs.indexOf(e))
      //     })
      //   }, 2000);
      // }



      this.OrderTrackInfo() 




      this.page.isPageLoaded = true
      // this.OrderTrackInfo();
    });

  }
  getTaskRateColor(): string {
    return this._statusUtilsService.getTaskRateColors(this.item.Rate)
  }
  getTripRateColor(): string {
    return this._statusUtilsService.getTripRateColors(this.item.Trip.RateStatus)
  }

  ShowImageItemOrder(i) {
    this.ImageURl = this.item.OrderItems[i].ImageURL
    this.IsShow = false
    setTimeout(() => {
      this.IsShow = true
    }, 10);
  }

  clickedMarker(infowindow) {
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
  }

  isOrderDelivered(status: OrderStatus): boolean {
    return status == OrderStatus.DELIVERED;
  }

  OrderTrackInfo() {
    let CreatedDate = this.item.Date;
    let DeliverdDate = this.item.OrderLogs[this.item.OrderLogs.length - 1]?.CreatedDate;
    let totalTime = this.ConvertToMinutes(DeliverdDate) - this.ConvertToMinutes(CreatedDate)
    this.item.OrderLogs.forEach(element => {
      element.OrderStatusPosition = ((this.ConvertToMinutes(element.CreatedDate) - this.ConvertToMinutes(CreatedDate)) * 100) / totalTime
    });
    this.item.OrderLogs.forEach(element => {
      let i = this.item.OrderLogs.indexOf(element);
      if ((i != 0 && i != (this.item.OrderLogs.length - 1) && element.OrderStatusPosition < 93)) {
        let previousValue =
          this.item.OrderLogs[i].OrderStatusPosition - this.item.OrderLogs[i - 1].OrderStatusPosition
        if (previousValue < 7) {
          this.item.OrderLogs[i].OrderStatusPosition = Math.floor(this.item.OrderLogs[i].OrderStatusPosition)
          if (previousValue >= 6) {
            this.item.OrderLogs[i].OrderStatusPosition += 1
          }
          else if (previousValue >= 5) {
            this.item.OrderLogs[i].OrderStatusPosition += 2
          }
          else if (previousValue >= 4) {
            this.item.OrderLogs[i].OrderStatusPosition += 3
          }
          else if (previousValue >= 3) {
            this.item.OrderLogs[i].OrderStatusPosition += 4
          }
          else if (previousValue >= 2) {
            this.item.OrderLogs[i].OrderStatusPosition += 5
          }
          else if (previousValue >= 1) {
            this.item.OrderLogs[i].OrderStatusPosition += 6
          }
          else {
            this.item.OrderLogs[i].OrderStatusPosition = this.item.OrderLogs[i].OrderStatusPosition + 7
          }
        }
        let nextValue =
          this.item.OrderLogs[i + 1].OrderStatusPosition - this.item.OrderLogs[i].OrderStatusPosition
        if (nextValue < 7) {
          this.item.OrderLogs[i + 1].OrderStatusPosition = Math.floor(this.item.OrderLogs[i + 1].OrderStatusPosition)
          if (nextValue >= 6) {
            this.item.OrderLogs[i + 1].OrderStatusPosition += 1
          }
          else if (nextValue >= 5) {
            this.item.OrderLogs[i + 1].OrderStatusPosition += 2
          }
          else if (nextValue >= 4) {
            this.item.OrderLogs[i + 1].OrderStatusPosition += 3
          }
          else if (nextValue >= 3) {
            this.item.OrderLogs[i + 1].OrderStatusPosition += 4
          }
          else if (nextValue >= 2) {
            this.item.OrderLogs[i + 1].OrderStatusPosition += 5
          }
          else if (nextValue >= 1) {
            this.item.OrderLogs[i + 1].OrderStatusPosition += 6
          }
          else {
            this.item.OrderLogs[i + 1].OrderStatusPosition += 7
          }
        }
      }
    });
    this.item.OrderLogs.forEach(element => {
      let i = this.item.OrderLogs.indexOf(element);
      if ((i != 0 && i != (this.item.OrderLogs.length - 1) && element.OrderStatusPosition < 93)) {
        let previousValue =
          this.item.OrderLogs[i].OrderStatusPosition - this.item.OrderLogs[i - 1].OrderStatusPosition
        if (previousValue < 7) {
          this.item.OrderLogs[i].OrderStatusPosition = Math.floor(this.item.OrderLogs[i].OrderStatusPosition)
          if (previousValue >= 6) {
            this.item.OrderLogs[i].OrderStatusPosition += 1
          }
          else if (previousValue >= 5) {
            this.item.OrderLogs[i].OrderStatusPosition += 2
          }
          else if (previousValue >= 4) {
            this.item.OrderLogs[i].OrderStatusPosition += 3
          }
          else if (previousValue >= 3) {
            this.item.OrderLogs[i].OrderStatusPosition += 4
          }
          else if (previousValue >= 2) {
            this.item.OrderLogs[i].OrderStatusPosition += 5
          }
          else if (previousValue >= 1) {
            this.item.OrderLogs[i].OrderStatusPosition += 6
          }
          else {
            this.item.OrderLogs[i].OrderStatusPosition = this.item.OrderLogs[i].OrderStatusPosition + 7
          }
        }
        let nextValue =
          this.item.OrderLogs[i + 1].OrderStatusPosition - this.item.OrderLogs[i].OrderStatusPosition
        if (nextValue < 7) {
          this.item.OrderLogs[i + 1].OrderStatusPosition = Math.floor(this.item.OrderLogs[i + 1].OrderStatusPosition)
          if (nextValue >= 6) {
            this.item.OrderLogs[i + 1].OrderStatusPosition += 1
          }
          else if (nextValue >= 5) {
            this.item.OrderLogs[i + 1].OrderStatusPosition += 2
          }
          else if (nextValue >= 4) {
            this.item.OrderLogs[i + 1].OrderStatusPosition += 3
          }
          else if (nextValue >= 3) {
            this.item.OrderLogs[i + 1].OrderStatusPosition += 4
          }
          else if (nextValue >= 2) {
            this.item.OrderLogs[i + 1].OrderStatusPosition += 5
          }
          else if (nextValue >= 1) {
            this.item.OrderLogs[i + 1].OrderStatusPosition += 6
          }
          else {
            this.item.OrderLogs[i + 1].OrderStatusPosition += 7
          }
        }

      }
    });
    this.item.OrderLogs.forEach(element => {

      let i = this.item.OrderLogs.indexOf(element);
      if ((i != 0 && i != (this.item.OrderLogs.length - 1) && element.OrderStatusPosition < 93)) {
        let previousValue =
          this.item.OrderLogs[i].OrderStatusPosition - this.item.OrderLogs[i - 1].OrderStatusPosition
        if (previousValue < 7) {
          this.item.OrderLogs[i].OrderStatusPosition = Math.floor(this.item.OrderLogs[i].OrderStatusPosition)
          if (previousValue >= 6) {
            this.item.OrderLogs[i].OrderStatusPosition += 1
          }
          else if (previousValue >= 5) {
            this.item.OrderLogs[i].OrderStatusPosition += 2
          }
          else if (previousValue >= 4) {
            this.item.OrderLogs[i].OrderStatusPosition += 3
          }
          else if (previousValue >= 3) {
            this.item.OrderLogs[i].OrderStatusPosition += 4
          }
          else if (previousValue >= 2) {
            this.item.OrderLogs[i].OrderStatusPosition += 5
          }
          else if (previousValue >= 1) {
            this.item.OrderLogs[i].OrderStatusPosition += 6
          }
          else {
            this.item.OrderLogs[i].OrderStatusPosition = this.item.OrderLogs[i].OrderStatusPosition + 7
          }
        }
        let nextValue =
          this.item.OrderLogs[i + 1].OrderStatusPosition - this.item.OrderLogs[i].OrderStatusPosition
        if (nextValue < 7) {
          this.item.OrderLogs[i + 1].OrderStatusPosition = Math.floor(this.item.OrderLogs[i + 1].OrderStatusPosition)
          if (nextValue >= 6) {
            this.item.OrderLogs[i + 1].OrderStatusPosition += 1
          }
          else if (nextValue >= 5) {
            this.item.OrderLogs[i + 1].OrderStatusPosition += 2
          }
          else if (nextValue >= 4) {
            this.item.OrderLogs[i + 1].OrderStatusPosition += 3
          }
          else if (nextValue >= 3) {
            this.item.OrderLogs[i + 1].OrderStatusPosition += 4
          }
          else if (nextValue >= 2) {
            this.item.OrderLogs[i + 1].OrderStatusPosition += 5
          }
          else if (nextValue >= 1) {
            this.item.OrderLogs[i + 1].OrderStatusPosition += 6
          }
          else {
            this.item.OrderLogs[i + 1].OrderStatusPosition += 7
          }
        }

      }




    });
    this.startLine = this.item.OrderLogs[1]?.OrderStatusPosition;
    this.centerLine = 100 - this.startLine;
  }
  ConvertToMinutes(date): number {
    let days = (new Date(date)).getDay() * 1440
    let hours = (new Date(date)).getHours() * 60;
    let minutes = (new Date(date)).getMinutes();
    let time = days + hours + minutes;
    return time;
  }
  // isOrderDelivered(): boolean {
  //   return this.item.Status == OrderStatus.DELIVERED;
  // }

  // getPosition(date: Date): number {
  //   let duration = (this.getTime(this.getDeliverTime()) - this.getTime(this.item.CreatedDate));
  //   let dist = ((this.getTime(date) - this.getTime(this.item.CreatedDate)) * 100) / duration
  //   return dist
  // }
  // getStartLine(): number {
  //   let item = this.item.OrderLogs.find(i => i.ID == 1)
  //   return item ? this.getPosition(item.CreatedDate) : 0
  // }
  // getDeliverTime(): Date {
  //   return this.isOrderDelivered() ? this.item.DeliveryTime : new Date()
  // }
  // getTime(date: Date): number {
  //   return new Date(date).getTime()
  // }
  // getLogTrackingList(): OrderLogViewModel[] {
  //   return   this.item.OrderLogs.filter(i =>
  //     i.Action != OrderAction.DELIVERED).map(m => {
  //       return {
  //         ...m, Icon: this.getTrackingIcon(m.Action).icon, Color: this.getTrackingIcon(m.Action).color,
  //         OrderStatusPosition: this.getPosition(m.CreatedDate), RateColor: this.getTrackingIcon(m.Action).rateColor
  //       }
  //     })
  // }
 
  // getTrackingIcon(value: number) {
  //   switch (value) {
  //     case OrderAction.CREATED_FROM_POS:
  //       return { rateColor: "", color: "", icon: "/assets/icon/tracking/check_circle.svg" }
  //     case OrderAction.CREATED_BY_BRANCH_MANAGER:
  //       return { rateColor: "#009D4B", color: "point-green", icon: "/assets/icon/tracking/store.svg" }
  //     case OrderAction.READY_AFTER_PREPARATION_TIME:
  //       return { rateColor: "#FFE000", color: "point-yellow", icon: "/assets/icon/tracking/parcel_check.svg" }
  //     case OrderAction.DELIVERED:
  //       return { rateColor: "", color: "", icon: "/assets/icon/tracking/checkbox_multiple.svg" }
  //     default:
  //       return { rateColor: "", color: "", icon: "" }
  //   }
  // }

  // calcPosition(index: number): number {
  //   let position: number = this.item.OrderTrackcingLogs[index].OrderStatusPosition;
  //   if (index > 0) {
  //     let previousPosition: number = this.item.OrderTrackcingLogs[index - 1].OrderStatusPosition;
  //     if (position < previousPosition + 4) {
  //       position = previousPosition + 4
  //     }
  //     if (position > 96)
  //       position = 96
  //   }
  //   return position;
  // }
  // get isLTR() {
  //   return this._sharedService.isLTR()
  // }

}
