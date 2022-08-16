import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CrudIndexBaseUtils } from "src/app/components/shared/utils/crud-index.utils";
import { CRUDIndexPage } from "src/app/model/shared/crud-index.model";
import { SharedService } from "src/app/service/shared.service";
import { AddressConfiguratioService } from "../address-configuration.service";
import { AddressConfigurationViewModel } from "../view-models/address-branch-configuration.model";
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  items: AddressConfigurationViewModel[] = [];
  pageRoute = '/configuration/address'
  constructor(
    private _addressConfiguratioService: AddressConfiguratioService,
    public _sharedService: SharedService,
    private _activatedRoute: ActivatedRoute,

  ) { super(_sharedService); }
  ngOnInit() {
    this.initializePage();
  }
  initializePage() {
    this.page.isPageLoaded = false;
    this.page.columns = [
      { Name: "BranchName", Title: "system.store", Selectable: false, Sortable: false },
      { Name: "Longitude", Title: "system.longitude", Selectable: false, Sortable: true },
      { Name: "Latitude", Title: "system.latitude", Selectable: false, Sortable: true },
      { Name: "AddressPrefix", Title: "config.address.address-pre", Selectable: false, Sortable: true },
      { Name: "Address", Title: "config.address.address", Selectable: false, Sortable: true },
    ];
    this.createSearchForm()
    this._activatedRoute.queryParams.subscribe((params) => {
      this.subscribeFilteration(params)
  });
  }
  search() {
    this.page.isSearching = true;
    this.items = [];
    this._addressConfiguratioService.get(this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      if (response.Success) {
        this.page.isAllSelected = false;
        this.confingPagination(response)
        this.items = response.Data.Items as AddressConfigurationViewModel[];
        this.page.isPageLoaded = true;
        this.items.forEach(x => x.IsSelected = false);
      }
    });
  }
  save(model: AddressConfigurationViewModel) {
    for (let [key, value] of Object.entries(model)) {
      if (model.Latitude == null) model.Latitude = 0
      if (model.Latitude == null) model.Latitude = 0
    }
    this.page.isSaving = true;
    this._addressConfiguratioService.updateAddressConfiguration(model).subscribe(response => {
      this.page.isSaving = false;
      this._sharedService.showToastr(response);
    })
  }

}
