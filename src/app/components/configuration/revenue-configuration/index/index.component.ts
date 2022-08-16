
import { Component, OnInit, ViewChild, } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { KeyValue } from '@angular/common';
import { forkJoin } from 'rxjs';
import { TripRevenueConfigurationViewModel } from '../view-models/trip-revenue-configuration.model';
import { OrderRevenueConfigurationViewModel } from '../view-models/order-revenue-configuration.model';
import { RevenueConfigurationService } from '../revenue-configuration.service';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  tripRevenueConfigs: TripRevenueConfigurationViewModel[] = []
  updatedtripRevenueConfigs: TripRevenueConfigurationViewModel[] = []
  isAlltripRevenueConfigSelected: boolean = false;

  orderRevenueConfigs: OrderRevenueConfigurationViewModel[] = []
  updatedOrderRevenueConfigs: OrderRevenueConfigurationViewModel[] = []
  isAllOrderRevenueConfigSelected: boolean = false;

  page: CRUDIndexPage = new CRUDIndexPage();
  modalRef: BsModalRef;
  @ViewChild('orderRevenueTemplate', { static: false }) orderRevenueTemplate: any;
  @ViewChild('tripRevenueTemplate', { static: false }) tripRevenueTemplate: any;

  constructor(
    private _revenueConfigService: RevenueConfigurationService,
    public _sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    forkJoin([
      this._revenueConfigService.getOrderRevenueConfigurations(),
      this._revenueConfigService.getTripRevenueConfigurations(),
    ]).subscribe(res => {
      this.orderRevenueConfigs = res[0].Data
      this.tripRevenueConfigs = res[1].Data
      this.page.isPageLoaded = true;
    }
    );
  }
  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

  isColumnAscending(column: string): boolean {
    return (column != this.page.orderBy) ? null : (this.page.isAscending ? true : false);
  }
  //Order Revenue Config
  selectAllOrderRevenue() {
    this.isAllOrderRevenueConfigSelected = !this.isAllOrderRevenueConfigSelected;
    this.orderRevenueConfigs.forEach(item => {
      item.IsSelected = this.isAllOrderRevenueConfigSelected
    });
  }

  updateOrderRevenueConfig() {
    this.page.isSaving = true;

    this.updatedOrderRevenueConfigs = []
    this.orderRevenueConfigs.forEach(i => {
      if (i.IsSelected)
        this.updatedOrderRevenueConfigs.push(i)
    })
    this._revenueConfigService.updateOrderRevenueConfig(this.updatedOrderRevenueConfigs).subscribe(response => {
      this.page.isSaving = false;
      this._sharedService.showToastr(response);
      if (response.Success) {
        this.orderRevenueConfigs.forEach(i => {
          i.IsSelected = false
        })
        this.page.isSaving = false;


      }
    })
  }

  showOrderRevenueUpdateConfirmation(selectedItem: OrderRevenueConfigurationViewModel) {
    let item = this.orderRevenueConfigs.find(i => i == selectedItem)
    item.IsSelected = true;
    this.modalRef = this._sharedService.modalService.show(this.orderRevenueTemplate, { class: 'modal-sm' });
  }

  showOrderRevenueUpdateAllConfirmation() {

    this.modalRef = this._sharedService.modalService.show(this.orderRevenueTemplate, { class: 'modal-sm' });
  }

  showUpdateAllOrderRevenueConfig(): boolean {
    return this.orderRevenueConfigs.filter(i => i.IsSelected == true).length > 0
  }
  // Trip Revenue Config
  selectAllTripRevenue() {
    this.isAlltripRevenueConfigSelected = !this.isAlltripRevenueConfigSelected;
    this.tripRevenueConfigs.forEach(item => {
      item.IsSelected = this.isAlltripRevenueConfigSelected
    });
  }

  updateTripRevenueConfig() {
    this.page.isSaving = true;

    this.updatedtripRevenueConfigs = []
    this.tripRevenueConfigs.forEach(i => {
      if (i.IsSelected)
        this.updatedtripRevenueConfigs.push(i)
    })
    this._revenueConfigService.updateTripRevenueConfig(this.updatedtripRevenueConfigs).subscribe(response => {
      this.page.isSaving = false;
      this._sharedService.showToastr(response);
      if (response.Success) {
        this.tripRevenueConfigs.forEach(i => {
          i.IsSelected = false
        })
        this.page.isSaving = false;


      }
    })
  }

  showTripRevenueUpdateConfirmation(selectedItem: TripRevenueConfigurationViewModel) {
    let item = this.tripRevenueConfigs.find(i => i == selectedItem)
    item.IsSelected = true;
    this.modalRef = this._sharedService.modalService.show(this.tripRevenueTemplate, { class: 'modal-sm' });
  }

  showTripRevenueUpdateAllConfirmation() {

    this.modalRef = this._sharedService.modalService.show(this.tripRevenueTemplate, { class: 'modal-sm' });
  }

  showAllTripRevenueConfig(): boolean {
    return this.tripRevenueConfigs.filter(i => i.IsSelected == true).length > 0
  }

}

