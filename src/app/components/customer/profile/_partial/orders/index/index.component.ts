import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { CustomerOrdersViewModel } from '../view-models/customer-orders.model';
import { forkJoin } from 'rxjs';
import { SharedService } from 'src/app/service/shared.service';
import { OrderStatus } from 'src/app/enum/order-status.enum';
import { CRUDCreatePage } from 'src/app/model/shared/crud-create.model';
import { CustomerProfileService } from '../../../profile.service';
import { StatusUtilsService } from 'src/app/service/status.service';



@Component({
  selector: 'orders',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class OrdersComponent implements OnInit {
  
  page: CRUDCreatePage = new CRUDCreatePage();
  orders:CustomerOrdersViewModel[]=[]
  amount:number =0
  longitude:number;
  latitude:number;
  branchLatitude:number;
  branchLongitude:number
  zoom:number=15;
  constructor(
    public _sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private _customerProfileService:CustomerProfileService,
    private _statusUtilsService  : StatusUtilsService
  ) { }
  ngOnInit() {
    var id
    this.activatedRoute.params.subscribe(params => {
      id = params['id']
    })
    forkJoin([
      this._customerProfileService.getCustomerOrders(id)
    ]).subscribe(res => {
        if(res[0].Success && res[0].Data !=null){
          this.orders = res[0].Data
          this.orders[0].IsShownOnMap = true
          this.longitude = this.orders[0].Longitude
          this.latitude = this.orders[0].Latitude
          this.branchLatitude = this.orders[0].BranchLatitude
          this.branchLongitude = this.orders[0].BranchLongitude
          this.page.isPageLoaded=true
          this.orders.forEach(element => {
          element.RateColore = this._statusUtilsService.getTaskRateColors(element.Rate)
           
          });
          this.orders.filter(x=>x.Status == OrderStatus.DELIVERED).forEach(element => {
            this.amount += element.Amount
          });
        }
      }
       
    );
  }
  onAddressClick(index:number){
    this.orders.forEach(element => {
      element.IsShownOnMap = false
    });
    this.orders[index].IsShownOnMap = true
    this.longitude = this.orders[index].Longitude
    this.latitude = this.orders[index].Latitude
    this.branchLatitude = this.orders[index].BranchLatitude
    this.branchLongitude = this.orders[index].BranchLongitude
  }
}

