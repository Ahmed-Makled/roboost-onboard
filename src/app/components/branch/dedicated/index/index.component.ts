import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
import { CRUDCreatePage } from 'src/app/model/shared/crud-create.model';
import { DedicatedBranchService } from '../dedicated-branch.service';
import { DedicatedBranchSearchViewModel } from '../view-models/deliveryman-branch-search.model';
import { DedicatedBranchViewModel } from '../view-models/deliveryman-branch.model';
import { forkJoin } from 'rxjs';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { ListService } from 'src/app/service/list.service';
import { DedicatedBranchEditViewModel } from '../view-models/deliveryman-branch-edit.model';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  pageRoute = '/agent/dedicated'
  pageCreate: CRUDCreatePage = new CRUDCreatePage();
  items: DedicatedBranchViewModel[] = [];
  storeList: SelectItem[] = [];
  agentList: SelectItem[] = [];
  areaList: SelectItem[] = [];
  data: DedicatedBranchEditViewModel[] = []
  searchViewModel: DedicatedBranchSearchViewModel = new DedicatedBranchSearchViewModel();
  constructor(
    private activatedRoute: ActivatedRoute,
    public _sharedService: SharedService,
    private _dedicatedService: DedicatedBranchService,
    private _listService: ListService
  ) {
    super(_sharedService);
  }
  ngOnDestroy(): void {
    this.canSendToParent = false
  }
  ngOnInit() {
    this.initializePage();
  }
  initializePage() {
    this._listService.getAreaList().subscribe(res => { this.areaList = res.Data })
    this.createSearchForm();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.subscribeFilteration(params)
    });
  }
  createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({
      areaID: [this.searchViewModel.areaID],
    });
    this.page.isPageLoaded = true;
  }
  search() {
    this.page.isSearching = true;
    this.items = [];
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    forkJoin([
      this._listService.getBranchList(this.searchViewModel.areaID),
      this._listService.getDeliverymanList(null, this.searchViewModel.areaID),
    ]).subscribe(res => {
      this.storeList = res[0].Data
      this.agentList = res[1].Data
      this.getDedecated();
      this.page.isSearching = false;
    });
  }
  getDedecated() {
    this.items = [];
    this._dedicatedService.get().subscribe(res => {
      if (res.Success) {
        this.data = res.Data
        this.items = this.agentList.map(i => {
          return {
            DeliverymanID: i.ID, DeliverymanName: i.Name,
            Branches: this.storeList.map(s => {
              return {
                ID: s.ID, Name: s.Name, Selected: this.data.some(x => x.DeliverymanID == i.ID && x.BranchID == s.ID)
              }
            })
          }
        })
      }
    })
  }
  update(branchID, selected, deliverymanID) {
    this._dedicatedService.update({ BranchID: branchID, DeliverymanID: deliverymanID, Selected: !this.isSelected(branchID, deliverymanID) }).subscribe(res => {
      this._sharedService.showToastr(res);
    })
  }
  isSelected(branchID, deliverymanID): boolean {
    return this.data.find(x => x.BranchID == branchID && x.DeliverymanID == deliverymanID) != undefined
  }
  branchesCountForDeliveryman(deliverymanID): number {
    return this.data.filter(x => x.DeliverymanID == deliverymanID).length;
  }
  deliverymenCountByBranch(branchID): number {
    return this.data.filter(x => x.BranchID == branchID && this.items.some(y => y.DeliverymanID == x.DeliverymanID)).length;
  }
}
