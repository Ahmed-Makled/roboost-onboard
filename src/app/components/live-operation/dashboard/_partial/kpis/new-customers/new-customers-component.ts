import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { DashBoardService } from '../../../dashboard.service';
import { DashboardSearchViewModel } from '../../../view-models/dashboard-search.model';
import { NewCustomersViewModel } from './new-customers-kpi.model';

@Component({
  selector: 'new-customers',
  templateUrl: './new-customers.component.html',
  styles: [
  ]
})
export class NewCustomerComponent implements OnInit, OnChanges {
  page: CRUDIndexPage = new CRUDIndexPage();
  loaded: boolean = false;
  @Input() searchViewModel: DashboardSearchViewModel;

  constructor(
    private _dashBoardService: DashBoardService
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.getData()
  }
  result: NewCustomersViewModel = new NewCustomersViewModel();
  ngOnInit(): void {
    //this.getData()


  }
  getData() {
    this.page.isSearching = true
    this._dashBoardService.getNewCustomers(this.searchViewModel).subscribe(res => {
      this.page.isSearching = true
      this.result.NewCustomersCount = res.Data
    })
  }
  isPositive() {
    return this.result.NewCustomersPercentage > 0;
  }
}