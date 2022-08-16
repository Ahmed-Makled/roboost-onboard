import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TopDeliverymenViewModel } from './View-models/top-deliverymen.model';
import { DashBoardService } from '../../dashboard.service';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { DashboardSearchViewModel } from '../../view-models/dashboard-search.model';

@Component({
    selector: 'top-deliverymen',
    templateUrl: './top-deliverymen.component.html',
    styles: []
})
export class TopDeliverymenComponent implements OnInit, OnChanges {
    items: TopDeliverymenViewModel[] = [];

    page: CRUDIndexPage = new CRUDIndexPage();

    constructor(private dashBoardService: DashBoardService) { }
    
    @Input() searchViewModel: DashboardSearchViewModel;

    ngOnChanges(changes: SimpleChanges): void {
        this.GetData()
    }
    ngOnInit(): void {
        this.page.columns = [
            { Name: "BranchName", Title: "system.store", Selectable: false, Sortable: false },
            { Name: "Image", Title: "system.image", Selectable: false, Sortable: false },
            { Name: "Name", Title: "system.deliveryman-name", Selectable: false, Sortable: false },
            { Name: "Mobile", Title: "shared.mobile", Selectable: false, Sortable: false },
            { Name: "ExcellentTripNumber", Title: "dashboard.points", Selectable: false, Sortable: false },
            { Name: "Bonus", Title: "system.bonus", Selectable: false, Sortable: false },
            { Name: "Deduction", Title: "dashboard.deduction", Selectable: false, Sortable: false },
            { Name: "Percentage", Title: "dashboard.percentage", Selectable: false, Sortable: false },
            { Name: "Stars", Title: "deliveryman.stars", Selectable: false, Sortable: false },
        ];
    }
    GetData() {
        this.dashBoardService.getTOPDMByPoint(this.searchViewModel).subscribe(response => {
            if (response.Success) {
                this.items = response.Data as TopDeliverymenViewModel[];
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
