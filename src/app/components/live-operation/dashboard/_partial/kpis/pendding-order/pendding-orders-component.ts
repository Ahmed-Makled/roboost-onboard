import { Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { DashBoardService } from '../../../dashboard.service';
import { DashboardSearchViewModel } from '../../../view-models/dashboard-search.model';
import { PenddingOrdersViewModel } from './pendding-orders-kpi.model';

@Component({
  selector: 'pendding-orders',
  templateUrl: './pendding-orders.component.html',
  styles: [
  ]
})
export class penddingOrdersComponent implements OnInit ,OnChanges {
  page: CRUDIndexPage = new CRUDIndexPage();
  loaded:boolean =false;
  @Input() searchViewModel: DashboardSearchViewModel;
  constructor(
    private _dashBoardService:DashBoardService
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.getData()
  }
  result:PenddingOrdersViewModel=new PenddingOrdersViewModel();
  ngOnInit(): void {
    this.page.isLoading=false
    //this.getData()
   
    
  }
getData(){
  this._dashBoardService.getPenddingOrders(this.searchViewModel).subscribe(res=>
    {
      if(res.Data){
      this.page.isLoading=true
      this.result = res.Data
      }
    })
}
  isPositive(){
    return this.result.PenddingOrdersCountPercentage > 0;
  }
}