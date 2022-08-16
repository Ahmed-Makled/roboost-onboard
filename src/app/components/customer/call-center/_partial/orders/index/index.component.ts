import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { CustomerOrdersViewModel } from '../view-models/customer-orders.model';
import { CallCenterService } from '../../../call-center.service';
import { forkJoin } from 'rxjs';
import { OrderStatus } from 'src/app/enum/order-status.enum';
import { TripStatus } from 'src/app/enum/trip-status';
import { SharedService } from 'src/app/service/shared.service';
import { OrderHomeService } from 'src/app/components/order/home/home.service';
import { StatusUtilsService } from 'src/app/service/status.service';



@Component({
  selector: 'orders',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class OrdersComponent implements OnInit {
  
  
  modalRef: BsModalRef;
  model:CustomerOrdersViewModel[]=[]
  newOrders:CustomerOrdersViewModel[]=[]
  previousOrders:CustomerOrdersViewModel[]=[]
  @Input() phoneSearch:string;

  constructor(
    public _sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private _statusUtilsService: StatusUtilsService,
    private _customerProfileService:CallCenterService
  ) { }
  ngOnChanges(): void {
    var id
    this.activatedRoute.params.subscribe(params => {
      id = params['id']
    })
    forkJoin([
      this._customerProfileService.getCustomerOrders(id,this.phoneSearch)
    ]).subscribe(res => {
        if(res[0].Success && res[0].Data !=null){
          this.model = res[0].Data
          this.model.forEach(element => {
            element.RateColore = this._statusUtilsService.getTaskRateColors(element.Rate)
          });
          this.newOrders = this.model.filter(x=> 
            x.Status == OrderStatus.CREATED || 
            x.Status == OrderStatus.READY || 
            x.Status == OrderStatus.ADDED_TO_TRIP || 
            (x.Status == OrderStatus.DELIVERED && x.TripStatus != TripStatus.COMPLETED) )
          this.previousOrders = this.model.filter(x=>
            !(x.Status == OrderStatus.CREATED || 
              x.Status == OrderStatus.READY || 
              x.Status == OrderStatus.ADDED_TO_TRIP || 
            (x.Status == OrderStatus.DELIVERED && x.TripStatus != TripStatus.COMPLETED)))
  
        }
      }
       
    );
  }

  ngOnInit() {

  }

}

