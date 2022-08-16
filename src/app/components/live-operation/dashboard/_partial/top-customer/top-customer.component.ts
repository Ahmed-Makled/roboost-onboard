import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { DashBoardService } from '../../dashboard.service';
import { DashboardSearchViewModel } from '../../view-models/dashboard-search.model';
import { TopCustomerViewModel } from './view-models/top-customer.model';


@Component({
    selector: 'top-customer',
    templateUrl: './top-customer.component.html',
    styles: [
    ]
})
export class TopCustomerComponent implements OnInit , OnChanges {
    items: TopCustomerViewModel[] = [];

    page: CRUDIndexPage = new CRUDIndexPage();
    @Input() searchViewModel: DashboardSearchViewModel;


    constructor(private dashBoardService: DashBoardService) { }
    ngOnChanges(changes: SimpleChanges): void {
        this.GetData()
    }
    ngOnInit(): void {
        //this.GetData()
   
            this.page.columns = [
            { Name: "Name", Title: "top-customer.name", Selectable: false, Sortable: false },
            { Name: "Mobile", Title: "top-customer.mobile", Selectable: false, Sortable: false },
            { Name: "Amount", Title: "top-customer.amount", Selectable: false, Sortable: false }

        ];
    }
    GetData() {
        this.dashBoardService.getTopCustomer(this.searchViewModel).subscribe(response => {
            if (response.Success) {

                this.items = response.Data as TopCustomerViewModel[];
            }


        });
    }
    onSortClicked(name) {
        if (name === this.page.orderBy) {
            this.page.isAscending = !this.page.isAscending;
        }
        else {
            this.page.isAscending = false;
        }
        this.page.orderBy = name;

        this.page.options.currentPage = 1;
        this.GetData();
    }
    isColumnAscending(column: string): boolean {
        return (column != this.page.orderBy) ? null : (this.page.isAscending ? true : false);
    }
}
  