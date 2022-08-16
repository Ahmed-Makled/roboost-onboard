import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { ItemViewModel } from '../view-models/item.model';
import { ItemSearchViewModel } from '../view-models/item-search.model';
import { ServiceIconViewModel } from '../view-models/service-icon.model';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { SharedService } from 'src/app/service/shared.service';
import { ItemHomeService } from '../item-home.service';
import { ListService } from 'src/app/service/list.service';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styles: [
  ]
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  pageRoute = '/configuration/item'
  items: ItemViewModel[] = [];
  statusList: SelectItem[] = [];
  rateOptionList: SelectItem[] = [];
  deliveryMenList: SelectItem[] = [];
  branchList: SelectItem[] = [];
  isServiceList: SelectItem[] = [
    { ID: 1, Name: "Select All", Selected: false, Url: "" },
    { ID: 1, Name: "yes", Selected: true, Url: "" },
    { ID: 1, Name: "No", Selected: false, Url: "" }
  ]
  serviceIconList: ServiceIconViewModel[] = [];
  selectedItem: ItemViewModel = new ItemViewModel();
  modalRef: BsModalRef;
  searchViewModel: ItemSearchViewModel = new ItemSearchViewModel();
  @ViewChild('deleteTemplate', { static: false }) deleteTemplate: any;
  @ViewChild('serviceIconTemplate', { static: false }) serviceIconTemplate: any;
  selectedIcon: ServiceIconViewModel = new ServiceIconViewModel();
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _itemService: ItemHomeService,
    public _sharedService: SharedService,
    private _listService: ListService
  ) {
    super(_sharedService);
  }
  ngOnInit() {
    this.initializePage();
  }
  initializePage() {
    this.page.isPageLoaded = false;
    this.page.columns = [
      { Name: "ID", Title: "shared.id", Selectable: true, Sortable: true },
      { Name: "Name", Title: "shared.name", Selectable: true, Sortable: true },
      { Name: "Price", Title: "shared.price", Selectable: true, Sortable: true },
      { Name: "ServingTime", Title: "item.serving-time", Selectable: true, Sortable: true },
      { Name: "PreparationTime", Title: "item.preparation-time", Selectable: true, Sortable: true },
      { Name: "IsService", Title: "item.is-service", Selectable: true, Sortable: true, IsHidden: !this.hasFeature(this.featureEnum.Item_SetAsServiceItem) },
      { Name: "IsTopPriority", Title: "item.is-top-priority", Selectable: true, Sortable: true, IsHidden: !this.hasFeature(this.featureEnum.Item_UpdatePriority) },
      { Name: "OrdersItemCount", Title: "item.number-of-ordering-item", Selectable: true, Sortable: false },
      { Name: "TotalAmount", Title: "deliveryman.total-amount", Selectable: true, Sortable: false },
      { Name: "", Title: "", Selectable: false, Sortable: false, IsHidden: !this.hasFeature(this.featureEnum.Item_Put) },
    ];
    this.createSearchForm();
    this._listService.getBranchList().subscribe(res => { this.branchList = res.Data });
    this._activatedRoute.queryParams.subscribe((params) => {
      this.subscribeFilteration(params)
    });
  }
  search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this._itemService.get(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe(response => {
      this.page.isSearching = false;
      if (response.Success) {
        this.page.isAllSelected = false;
        this.confingPagination(response)
        this.items = response.Data.Items as ItemViewModel[];
        this.items.forEach(x => x.IsSelected = false);
      }
    });
  }
  createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({
      IsService: [this.searchViewModel.IsService],
      ID: [this.searchViewModel.ID],
      Name: [this.searchViewModel.Name],
      BranchID: [this.searchViewModel.BranchID]
    });
    this.page.isPageLoaded = true;
  }
  changeIsService(item:ItemViewModel): void {
    if (!item.IsService) {
      this.showServiceIconTemplate(item);
    }
    else {
      this._itemService.setAsNotServiceItem(item.ID).subscribe(res => {
        this._sharedService.showToastr(res);
        if (res.Success) {
          item.IsService = false;
        }
      });
    }
  }
  showServiceIconTemplate(item: ItemViewModel) {
    this._itemService.GetServicesIcon().subscribe(res => {
      if (res.Success) {
        this.serviceIconList = res.Data;
      }
    })
    this.selectedItem = item;
    this.modalRef = this._sharedService.modalService.show(this.serviceIconTemplate, { class: 'modal-sm modal-lg' });
  }
  setAsServiceItem(id: number) {
    this._itemService.setAsServiceItem(id, this.selectedIcon.ID).subscribe(res => {
      this._sharedService.showToastr(res);
      if (res.Success) {
        this.items.filter(i => i.ID == id)[0].IsService = true;
      }
    });
  }
  selectService(item: ServiceIconViewModel) {
    if (this.selectedIcon == item)
      this.selectedIcon = null
    else
      this.selectedIcon = item
  }
  Update(item: ItemViewModel) {
    if (item.ServingTime == null)
      item.ServingTime = 0
    if (item.PreparationTime == null)
      item.PreparationTime = 0
    this._itemService.update(item).subscribe(res => {
      this._sharedService.showToastr(res)
    })
  }
  changeIsTopPriority(item: ItemViewModel) {
    this._itemService.changeIsTopPriority({ ID: item.ID, IsTopPriority: !item.IsTopPriority }).subscribe(res => {
      this._sharedService.showToastr(res)
      if (res.Success) {
        item.IsTopPriority = !item.IsTopPriority
      }
    })
  }
}
