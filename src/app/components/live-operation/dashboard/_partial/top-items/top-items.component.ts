import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { DashBoardService } from '../../dashboard.service';
import { DashboardSearchViewModel } from '../../view-models/dashboard-search.model';
import { TopItemsViewModel } from './View-models/top-items.model';


@Component({
    selector: 'top-items',
    templateUrl: './top-items.component.html',
    styles: []
})
export class TopItemsComponent implements OnInit ,OnChanges {
    items: TopItemsViewModel[] = [];
    page: CRUDIndexPage = new CRUDIndexPage();
    @Input() searchViewModel: DashboardSearchViewModel;

    constructor(private dashBoardService: DashBoardService) { }
    ngOnChanges(changes: SimpleChanges): void {
        this.GetData()
    }

    ngOnInit(): void {
        //this.GetData()
 
        this.page.columns = [
            { Name: "ItemID", Title: "top-items.item-id", Selectable: false, Sortable: false },
            { Name: "Name", Title: "shared.name", Selectable: false, Sortable: false },
            { Name: "QTY", Title: "order-details.qty", Selectable: false, Sortable: false },
            { Name: "OrderCount", Title: "top-items.order-count", Selectable: false, Sortable: false },
        ];
    }
    GetData() {
        this.dashBoardService.getTopItems(this.searchViewModel).subscribe(response => {
            this.items = response.Data as TopItemsViewModel[];
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
