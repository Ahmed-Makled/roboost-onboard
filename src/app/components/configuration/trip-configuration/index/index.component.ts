import { Component, OnInit, } from '@angular/core';
import { TripBranchConfigurationViewModel } from '../view-models/trip-branch-configuration.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
import { TripBranchConfiguratioService } from '../trip-configuration.service';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
import { ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.css']
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit {
    modalRef: BsModalRef;
    orderBy: string = 'ID'
    pageRoute = '/configuration/trip'
    constructor(
        private _TripBranchConfiguratioService: TripBranchConfiguratioService,
        public _sharedService: SharedService,
        private _activatedRoute: ActivatedRoute,
    ) { super(_sharedService) }
    page: CRUDIndexPage = new CRUDIndexPage();
    items: TripBranchConfigurationViewModel[] = [];
    model: TripBranchConfigurationViewModel = new TripBranchConfigurationViewModel();
    ngOnInit() {
        this.initializePage();
    }
    initializePage() {
        this.page.columns = [
            { Name: "BranchName", Title: "system.store", Selectable: false, Sortable: false },
            { Name: "MaxOrders", Title: "config.trip.max-order", Selectable: true, Sortable: true },
            { Name: "AutoStartTrip", Title: "config.trip.auto-start-trip", Selectable: true, Sortable: true },
            { Name: "ExcelantTimePercentage", Title: "config.trip.excelant-time-percentage", Selectable: true, Sortable: true },
            { Name: "GoodTimePercentage", Title: "config.trip.good-time-percentage", Selectable: true, Sortable: true },
            { Name: "LateTimePercentage", Title: "config.trip.late-time-percentage", Selectable: true, Sortable: true },
            { Name: "ExcelantTripRevenue", Title: "config.trip.excelent-trip-revenue", Selectable: true, Sortable: true },
            { Name: "GoodTripRevenue", Title: "config.trip.good-trip-revenue", Selectable: true, Sortable: true },
            { Name: "LateTripRevenue", Title: "config.trip.late-trip-revenue", Selectable: true, Sortable: true },
            { Name: "TooLateTripRevenue", Title: "config.trip.too-late-trip-revenue", Selectable: true, Sortable: true },
            { Name: "OrderRevenueInExcelantTrip", Title: "config.trip.oreder-revenue-excelent-trip", Selectable: true, Sortable: true },
            { Name: "OrderRevenueInGoodTrip", Title: "config.trip.oreder-revenue-good-trip", Selectable: true, Sortable: true },
            { Name: "OrderRevenueInLateTrip", Title: "config.trip.oreder-revenue-late-trip", Selectable: true, Sortable: true },
            { Name: "OrderRevenueInTooLateTrip", Title: "config.trip.oreder-revenue-too-late-trip", Selectable: true, Sortable: true },
        ];
        this.createSearchForm();
        this._activatedRoute.queryParams.subscribe((params) => {
            this.subscribeFilteration(params)
        });
    }
    search() {
        this.page.isSearching = true;
        this.items = [];
        this._TripBranchConfiguratioService.get(this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
            this.page.isSearching = false;
            if (response.Success) {
                this.page.isAllSelected = false;
                this.page.options.totalItems = response.Data.Records;
                this.page.options.totalPages = response.Data.Pages;
                this.page.options.itemsPerPage = response.Data.PageSize;
                this.items = response.Data.Items as TripBranchConfigurationViewModel[];
                this.items.forEach(x => x.IsSelected = false);
                this.page.isPageLoaded = true
            }
        });
    }
    save(model: TripBranchConfigurationViewModel) {
        this.page.isSaving = true;
        for (let [key, value] of Object.entries(model)) {
            if (model[key] == null)
                model[key] = 0
        }
        this._TripBranchConfiguratioService.updateTripConfiguration(model).subscribe(response => {
            this.page.isSaving = false;
            this._sharedService.showToastr(response);
        })
    }
    createSearchForm() {
        this.page.searchForm = this._sharedService.formBuilder.group({});
    }
}
