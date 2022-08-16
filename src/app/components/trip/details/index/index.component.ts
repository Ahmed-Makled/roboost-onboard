import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TripDetailsService } from '../trip-details.service';
import { TripDetailsViewModel } from '../view-models/trip-details.model';
import { forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TripStatus } from 'src/app/enum/trip-status';
import { TripValidationRequestStatus } from 'src/app/enum/trip-validation-request-status.enum';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { SharedService } from 'src/app/service/shared.service';
import { TripService } from '../../home/home.service';
import { TripRateEditViewModel } from '../../home/view-models/trip-create.model';
import { StatusUtilsService } from 'src/app/service/status.service';
import { TripLogViewModel } from '../view-models/trip-log.model';
import { TripActionEnum } from 'src/app/enum/trip-action.enum';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  lat;
  lng;
  zoom = 15;
  previous;
  interval: any

  clickedMarker(infowindow) {
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
  }
  onMapClick($event: MouseEvent) { }
  editRateModel: TripRateEditViewModel = new TripRateEditViewModel();
  tripRateEditReasons: SelectItem[] = [];
  modalRef: BsModalRef;
  @ViewChild('EditPerformanceTemplate', { static: false }) EditPerformanceTemplate: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private _tripDetailsServace: TripDetailsService,
    public _sharedService: SharedService,
    private _tripService: TripService,
    private _statusUtilsService: StatusUtilsService
  ) { }
  page: CRUDIndexPage = new CRUDIndexPage();
  item: TripDetailsViewModel = new TripDetailsViewModel();
  showTripTrack = false;
  ordersCount
  greenCo = "#1F9928"; greenBg = "#1F9928"
  redCo = "#cc324c"; redBg = "#F44336"
  yellowCo = "#ffc400"; yellowBg = "#ffc400"
  blueCo = "#03a8ff"; blueBg = "#03a8ff"
  grayCo = "#525252"; grayBg = "#525252"
  statusColor; statusBg
  showMap: boolean = true;
  orderstatusCo = []
  orderstatusBo = []
  ngOnInit(): void {
    if (!environment.production) {
      this.showMap = false
    }
    this.initializePage()
    window.scrollTo(0, 0)
    if (this.item.Status != TripStatus.COMPLETED) {
      setInterval(() => {
        // this.item.PlannedCompleteTimeInt = this.item.PlannedCompleteTimeInt - 1;
      }, 1000);
    }
  }
  initializePage() {
    this.page.isPageLoaded = false;
    this.activatedRoute.params.subscribe(params => {
      this.item.ID = params['code']
    })
      this._tripDetailsServace.get(this.item.ID).subscribe(res => {
      this.item = res.Data;
      if (this.item.Orders) {
        this.ordersCount = this.item.Orders.length;
        this.item.Orders.forEach(element => {
          if (element.Latitude == 0 && element.PlannedLatitude > 0) {
            element.Latitude = element.PlannedLatitude
          }
          if (element.Longitude == 0 && element.PlannedLongitude > 0) {
            element.Longitude = element.PlannedLongitude
          }
        });
        this.tripTrackInfo()
      }




      // this.item.TripTrackingLogs = this.getLogTrackingList()

      // this.item.TripTrackingLogs.forEach(element => {
      //   element.Position = this.calcPosition(this.item.TripTrackingLogs.indexOf(element))
      // });
      
      // if (!this.isTripComplete()) {
      //   clearInterval(this.interval)
      //   this.interval = setInterval(() => {
      //     this.item.TripTrackingLogs.forEach(e => {
      //       e.Position = this.getPosition(e.CreatedDate)
      //       e.Position = this.calcPosition(this.item.TripTrackingLogs.indexOf(e))
      //     })
      //   }, 2000);
      // }



      this.getColors()
      console.log(this.item);
      this.page.isPageLoaded = true;
    });
  } s
  getColors() {
    this.item.StatusColor = this._statusUtilsService.getTripRateColors(this.item.RateStatus)
    if (this.item.Orders) {
      this.item.Orders.forEach(element => {
        element.StatusColor = this._statusUtilsService.getTaskRateColors(element.Rate)
      });
    }
  }
  // getStatusName(status: TripValidationRequestStatus): string {
  //   switch (status) {
  //     case TripValidationRequestStatus.APPROVED:
  //       return "Approved"
  //     case TripValidationRequestStatus.UNAPPROVED:
  //       return "Not Approved"
  //   }
  // }
  // Remove(id: number) {
  //   this._tripDetailsServace.RemoveOrder(id)
  //     .subscribe(res => {
  //       this._sharedService.showToastr(res)
  //       this.initializePage();
  //     })
  // }
  // getPlannedCompleteTime(): string {
  //   let remainingTime = Math.abs(this.item.PlannedCompleteTimeInt);
  //   var minutes = Math.floor(remainingTime / 60);
  //   var seconds = remainingTime - minutes * 60;
  //   return `${minutes}:${seconds}`;
  // }
  // getSpentTime(): string {
  //   if (this.page.isPageLoaded) {
  //     var SpentTime: number = Math.floor(this.item.SpentTime)
  //     var minutes = Math.floor(SpentTime / 60);
  //     var seconds = SpentTime - minutes * 60;
  //     return `${minutes}:${seconds}`;
  //   }
  // }
  centerLine: number;
  tripTrackInfo() {
    let totalTime =
      this.ConvertToMinutes(this.item.CloseTime) - this.ConvertToMinutes(this.item.CreatedDate)
    let startPosition = totalTime - this.item.TotalDeliveredTime;
    this.item.Orders.forEach(element => {
      element.OrderPosition =
        ((this.ConvertToMinutes(element.DeliveryTime) - this.ConvertToMinutes(this.item.CreatedDate))
          * 100) / totalTime
    });
    this.item.CretedPosition = 0;
    this.item.CompletedPosition = 100;
    this.item.StartPosition = (startPosition * 100) / totalTime;
    this.centerLine = this.item.CompletedPosition - this.item.StartPosition;
  }
  ConvertToMinutes(date): number {
    let minutes = Math.floor(new Date(date).getTime() / 60000);
    return minutes;
  }
  // getTotalOrderDeliverdTime(TotalDeliveredTime: number): string {
  //   let remainingTime = Math.abs(TotalDeliveredTime);
  //   var minutes = Math.floor(remainingTime / 60);
  //   var seconds = remainingTime - minutes * 60;
  //   return `${minutes}:${seconds}`;
  // }
  // showEditPerformanceTemplate() {
  //   this.editRateModel.Rate = null
  //   this.editRateModel.Note = null
  //   this.modalRef = this._sharedService.modalService.show(this.EditPerformanceTemplate, { class: 'modal-sm modal-35' });
  // }
  // onReasonChange(reasonID: number) {
  //   this.editRateModel.ReasonID = reasonID;
  // }
  // editRate() {
  //   this.editRateModel.TripID = this.item.ID;
  //   if (this.editRateModel) {
  //     this._tripService.editTripRate(this.editRateModel).subscribe(response => {
  //       this._sharedService.showToastr(response);
  //       if (response.Success) {
  //         this.item.PerformanceColor =
  //           this._statusUtilsService.getTripRateColors(this.editRateModel.Rate)
  //         this.item.RateStatus = this.editRateModel.Rate
  //         if (this.editRateModel.Rate == 1) {
  //           this.item.RateStatusName = "EXCELLENT"
  //         }
  //         else if (this.editRateModel.Rate == 2) {
  //           this.item.RateStatusName = "GOOD"
  //         }
  //         else if (this.editRateModel.Rate == 3) {
  //           this.item.RateStatusName = "LATE"
  //         }
  //         else if (this.editRateModel.Rate == 4) {
  //           this.item.RateStatusName = "TOO LATE"
  //         }
  //       }
  //     },
  //     );
  //   }
  // }
  // snapToRoads() {
  //   let locations: string = ""
  //   this.item.AccurateTrackingLocations.forEach(location => {
  //     locations += location.Latitude + ',' + location.Longitude
  //     if (this.item.AccurateTrackingLocations.indexOf(location) != this.item.AccurateTrackingLocations.length - 1)
  //       locations += '|'
  //   });
  //   this.item.TrackingLocations = []
  //   this._tripDetailsServace.snapToRoads(locations).subscribe((res: any) => {
  //     res.snappedPoints.forEach((point: any) => {
  //       this.item.TrackingLocations.push({
  //         Latitude: point.location.latitude,
  //         Longitude: point.location.longitude,
  //         Date: new Date(),
  //         Accuracy: 0
  //       })
  //     });
  //   })
  // }
  isTripComplete(): boolean {
    return this.item.Status == TripStatus.COMPLETED;
  }

  // getPosition(date: Date): number {
  //   let duration = (this.getTime(this.getDeliverTime()) - this.getTime(this.item.CreatedDate));
  //   let dist = ((this.getTime(date) - this.getTime(this.item.CreatedDate)) * 100) / duration
  //   return dist
  // }
  // getStartLine(): number {
  //   let item = this.item.TripLogs.find(i => i.ID == 1)
  //   return item ? this.getPosition(item.CreatedDate) : 0
  // }
  // getDeliverTime(): any {
  //   return this.isTripComplete() ? this.item.TotalDeliveredTime : new Date()
  // }
  // getTime(date: Date): number {
  //   return new Date(date).getTime()
  // }
  // getLogTrackingList(): TripLogViewModel[] {
  //   let  x =  this.item.TripLogs.filter(i =>i.Action!==TripActionEnum.COMPLETED).map(m => {
  //       return {
  //         ...m, Icon: this.getTrackingIcon(m.Action).icon, Color: this.getTrackingIcon(m.Action).color,
  //         Position: this.getPosition(m.CreatedDate), RateColor: this.getTrackingIcon(m.Action).rateColor
  //       }
  //     })
  //     console.log('x', x);
  //     return x 
  // }
 
  // getTrackingIcon(value: number) {
  //   switch (value) {
  //     case TripActionEnum.READY:
  //       return { rateColor: "", color: "", icon: "/assets/icon/tracking/check_circle.svg" }
  //     case TripActionEnum.STARTED:
  //       return { rateColor: "#009D4B", color: "point-green", icon: "/assets/icon/tracking/store.svg" }
  //     case TripActionEnum.RECIEVED:
  //       return { rateColor: "#FFE000", color: "point-yellow", icon: "/assets/icon/tracking/parcel_check.svg" }
  //     case TripActionEnum.DELIVER_ORDER:
  //       return { rateColor: "", color: "", icon: "/assets/icon/tracking/checkbox_multiple.svg" }
  //     default:
  //       return { rateColor: "#FFE000", color: "point-yellow", icon: "/assets/icon/tracking/parcel_check.svg" }
  //   }
  // }
  // calcPosition(index: number): number {
  //   let position: number = this.item.TripTrackingLogs[index].Position;
  //   if (index > 0) {
  //     let previousPosition: number = this.item.TripTrackingLogs[index - 1].Position;
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