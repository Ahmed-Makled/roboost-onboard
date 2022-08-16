import { Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { DashBoardService } from '../../dashboard.service';
import { DashboardSearchViewModel } from '../../view-models/dashboard-search.model';
import { ReadyOrderViewModel } from './view-models/ready-order.model';

@Component({
    selector: 'ready-orders',
    templateUrl: './ready-orders.component.html'
})
export class ReadyOrdersComponent implements OnInit ,OnChanges {
    items: ReadyOrderViewModel[] = [];

    page: CRUDIndexPage = new CRUDIndexPage();

    constructor(private dashBoardService: DashBoardService) { }
    @Input() searchViewModel: DashboardSearchViewModel;

    ngOnChanges(changes: SimpleChanges): void {
        this.GetData()
    }
ngOnInit(): void {
    //this.GetData();

            this.page.columns = [
            // { Name: "ID", Title:"order.id", Selectable: true, Sortable: true },
            { Name: "OrderNumber", Title: "recent-order.number", Selectable: false, Sortable: false },
            { Name: "Date", Title: "recent-order.date", Selectable: false, Sortable: false },
            { Name: "CustomerName", Title: "recent-order.customer-name", Selectable: false, Sortable: false },
            { Name: "BranchName", Title: "recent-order.branch-name", Selectable: false, Sortable: false }



        ];
    }
    GetData() {
        this.dashBoardService.getReadyOrders(this.searchViewModel).subscribe(response => {
            if (response.Success) {

                this.items = response.Data as ReadyOrderViewModel[];
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
  