import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { OrderConfiguratioService } from '../order-configuration.service';
import { forkJoin } from 'rxjs';
import { DistanceOrderConfigurationViewModel } from '../view-models/distance-order-configuration.model';
import { TimeOrderConfigurationViewModel } from '../view-models/time-order-configuration.model';
import { OrderKPIsConfigurationViewModel } from '../view-models/order-kpi-configuration.model';
import { CreateTripConfigurationViewModel } from '../view-models/create-trip-configuration.model';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  orderDistanceConfigs : DistanceOrderConfigurationViewModel[] =[]
  updatedOrderDistanceConfigs : DistanceOrderConfigurationViewModel[] =[]
  isAllDistanceConfigSelected:boolean = false;
  orderTimeConfigs : TimeOrderConfigurationViewModel[] =[]
  updatedOrderTimeConfigs : TimeOrderConfigurationViewModel[] =[]
  isAllTimeConfigSelected:boolean = false;
  orderKPIConfigs : OrderKPIsConfigurationViewModel[] =[]
  updatedOrderKPIConfigs : OrderKPIsConfigurationViewModel[] =[]
  isAllKPIConfigSelected:boolean = false;
  createTripConfigs : CreateTripConfigurationViewModel[] =[]
  updatedcreateTripConfigs : CreateTripConfigurationViewModel[] =[]
  isAllCreateTripConfigSelected:boolean = false;
  page: CRUDIndexPage = new CRUDIndexPage();
  modalRef: BsModalRef;
  @ViewChild('distanceUpdateTemplate', { static: false }) distanceUpdateTemplate: any;
  @ViewChild('timeUpdateTemplate', { static: false }) timeUpdateTemplate: any;
  @ViewChild('kpiUpdateTemplate', { static: false }) kpiUpdateTemplate: any;
  @ViewChild('createTripConfigTemplate', { static: false }) createTripConfigTemplate: any;
  constructor(private _orderConfiguratioService: OrderConfiguratioService,
    public _sharedService: SharedService,
    ) { }
  ngOnInit(): void {
    forkJoin([
      this._orderConfiguratioService.getDistanceConfiguration(),
      this._orderConfiguratioService.getTimeConfiguration(),
      this._orderConfiguratioService.getKPIConfiguration(),
      this._orderConfiguratioService.getCreateTripConfigurations()
     ]).subscribe(res => {
       this.orderDistanceConfigs = res[0].Data
       this.orderTimeConfigs = res[1].Data
       this.orderKPIConfigs = res[2].Data
       this.createTripConfigs = res[3].Data
       this.page.isPageLoaded = true;
     }
     );
  }
  isColumnAscending(column: string): boolean {
    return (column != this.page.orderBy) ? null : (this.page.isAscending ? true : false);
  }
  //Order Distance Config
  selectAllOrderDistance() {
    this.isAllDistanceConfigSelected = !this.isAllDistanceConfigSelected;
    this.orderDistanceConfigs.forEach(item => {
      item.IsSelected = this.isAllDistanceConfigSelected
    });
  }
  updateOrderDistanceConfig() {
    this.page.isSaving =true;
    this.updatedOrderDistanceConfigs=[]
    this.orderDistanceConfigs.forEach(i=>{
      if(i.IsSelected)
      this.updatedOrderDistanceConfigs.push(i)
    })
    this._orderConfiguratioService.updateDistanceConfiguration(this.updatedOrderDistanceConfigs).subscribe(response => {
      this.page.isSaving = false;
      this._sharedService.showToastr(response);
      if (response.Success) {
        this.orderDistanceConfigs.forEach(i=>{
          i.IsSelected=false
        })
    this.page.isSaving =false;
    }})
  }
  showDistanceUpdateConfirmation(selectedItem: DistanceOrderConfigurationViewModel) {
    let item = this.orderDistanceConfigs.find( i=>i == selectedItem)
    item.IsSelected = true;
    this.modalRef = this._sharedService.modalService.show(this.distanceUpdateTemplate, { class: 'modal-sm' });
  }
  showDistanceUpdateAllConfirmation() {
    this.modalRef = this._sharedService.modalService.show(this.distanceUpdateTemplate, { class: 'modal-sm' });
  }
  showUpdateAllDistanceConfig():boolean{
    return this.orderDistanceConfigs.filter(i=>i.IsSelected == true).length > 0
  }
  // Order Time Config
  selectAllOrderTime() {
    this.isAllTimeConfigSelected = !this.isAllTimeConfigSelected;
    this.orderTimeConfigs.forEach(item => {
      item.IsSelected = this.isAllTimeConfigSelected
    });
  }
  updateOrderTimeConfig() {
    this.page.isSaving =true;
    this.updatedOrderTimeConfigs=[]
    this.orderTimeConfigs.forEach(i=>{
      if(i.IsSelected)
      this.updatedOrderTimeConfigs.push(i)
    })
    this._orderConfiguratioService.updateTimeConfiguration(this.updatedOrderTimeConfigs).subscribe(response => {
      this.page.isSaving = false;
      this._sharedService.showToastr(response);
      if (response.Success) {
        this.orderTimeConfigs.forEach(i=>{
          i.IsSelected=false
        })
    this.page.isSaving =false;
    }})
  }
  showTimeUpdateConfirmation(selectedItem: TimeOrderConfigurationViewModel) {
    let item = this.orderTimeConfigs.find( i=>i == selectedItem)
    item.IsSelected = true;
    this.modalRef = this._sharedService.modalService.show(this.timeUpdateTemplate, { class: 'modal-sm' });
  }
  showTimeUpdateAllConfirmation() {
    this.modalRef = this._sharedService.modalService.show(this.timeUpdateTemplate, { class: 'modal-sm' });
  }
  showUpdateAllTimeConfig():boolean{
    return this.orderTimeConfigs.filter(i=>i.IsSelected == true).length > 0
  }
    //Create Trip Config
  selectAllCreateTripConfigs() {
    this.isAllCreateTripConfigSelected = !this.isAllCreateTripConfigSelected;
    this.createTripConfigs.forEach(item => {
      item.IsSelected = this.isAllCreateTripConfigSelected
    });
  }
  updateOrderCreateTripConfigs() {
    this.page.isSaving =true;
    this.updatedcreateTripConfigs=[]
    this.createTripConfigs.forEach(i=>{
      if(i.IsSelected)
      this.updatedcreateTripConfigs.push(i)
    })
    this._orderConfiguratioService.updateCreateTripConfig(this.updatedcreateTripConfigs).subscribe(response => {
      this.page.isSaving = false;
      this._sharedService.showToastr(response);
      if (response.Success) {
        this.createTripConfigs.forEach(i=>{
          i.IsSelected=false
        })
    this.page.isSaving =false;
    }})
  }
  showCreateTripConfigsUpdateConfirmation(selectedItem: CreateTripConfigurationViewModel) {
    let item = this.createTripConfigs.find( i=>i == selectedItem)
    item.IsSelected = true;
    this.modalRef = this._sharedService.modalService.show(this.createTripConfigTemplate, { class: 'modal-sm' });
  }
  showCreateTripConfigsUpdateAllConfirmation() {
    this.modalRef = this._sharedService.modalService.show(this.createTripConfigTemplate, { class: 'modal-sm' });
  }
  showUpdateAllCreateTripConfigs():boolean{
    return this.createTripConfigs.filter(i=>i.IsSelected == true).length > 0
  }
  //KPI Config
  selectAllOrderKPI() {
    this.isAllKPIConfigSelected = !this.isAllKPIConfigSelected;
    this.orderKPIConfigs.forEach(item => {
      item.IsSelected = this.isAllKPIConfigSelected
    });
  }
  updateOrderKPIConfig() {
    this.page.isSaving =true;
    this.updatedOrderKPIConfigs=[]
    this.orderKPIConfigs.forEach(i=>{
      if(i.IsSelected)
      this.updatedOrderKPIConfigs.push(i)
    })
    this._orderConfiguratioService.updateKPIConfiguration(this.updatedOrderKPIConfigs).subscribe(response => {
      this.page.isSaving = false;
      this._sharedService.showToastr(response);
      if (response.Success) {
        this.orderKPIConfigs.forEach(i=>{
          i.IsSelected=false
        })
    this.page.isSaving =false;
    }})
  }
  showKPIUpdateConfirmation(selectedItem: OrderKPIsConfigurationViewModel) {
    let item = this.orderKPIConfigs.find( i=>i == selectedItem)
    item.IsSelected = true;
    this.modalRef = this._sharedService.modalService.show(this.kpiUpdateTemplate, { class: 'modal-sm' });
  }
  showKPIUpdateAllConfirmation() {
    this.modalRef = this._sharedService.modalService.show(this.kpiUpdateTemplate, { class: 'modal-sm' });
  }
  showUpdateAllKPIConfig():boolean{
    return this.orderKPIConfigs.filter(i=>i.IsSelected == true).length > 0
  }
}
