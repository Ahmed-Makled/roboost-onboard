import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
import { ListService } from 'src/app/service/list.service';
import { UsersService } from '../user-home.service';
import { forkJoin } from 'rxjs';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { UserHomeSearchViewModel } from '../view-models/user-home-search.model';
import { UserHomeViewModel } from '../view-models/user-home.model';
import { DeliverymanCreateViewModel, UserCreateViewModel, UserInfoCreateViewModel } from '../view-models/user-home-create.model';
import { CrudIndexBaseUtils } from 'src/app/components/shared/utils/crud-index.utils';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent extends CrudIndexBaseUtils implements OnInit {
  @ViewChild('deleteTemplate', { static: false }) deleteTemplate: any;
  modalRef: BsModalRef;
  page: CRUDIndexPage = new CRUDIndexPage();
  pageRoute = '/user/home'
  userPage: CRUDIndexPage = new CRUDIndexPage();
  searchViewModel: UserHomeSearchViewModel = new UserHomeSearchViewModel();
  selectedItem: UserHomeViewModel = new UserHomeViewModel();
  userModel: UserInfoCreateViewModel = new UserInfoCreateViewModel();
  deliverymanModel: DeliverymanCreateViewModel = new DeliverymanCreateViewModel();
  ownerModel: UserCreateViewModel = new UserCreateViewModel();
  items: UserHomeViewModel[] = [];
  branchList: SelectItem[] = []
  roleList: SelectItem[] = []
  roles: SelectItem[] = []
  advancedSearch: boolean = false;
  fillteredItems: UserHomeViewModel[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    public _sharedService: SharedService,
    private _userService: UsersService,
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
      { Name: 'ID', Title: 'shared.id', Selectable: true, Sortable: true },
      { Name: 'Name', Title: 'shared.name', Selectable: true, Sortable: false },
      { Name: 'Mobile', Title: 'shared.mobile', Selectable: true, Sortable: false },
      { Name: 'Email', Title: 'shared.email', Selectable: true, Sortable: false, },
      { Name: 'Role', Title: 'system.role', Selectable: true, Sortable: false, },
      { Name: 'multipleDevices', Title: 'user.allow-multiple-devices', Selectable: true, Sortable: false, IsHidden: !this.hasFeature(this.featureEnum.User_SwitchAllowMultipleDevices) },
      { Name: 'activation', Title: 'user.activation', Selectable: true, Sortable: false, IsHidden: !this.hasFeature(this.featureEnum.User_ChangeActivationStatus) },
      { Name: 'logOut', Title: 'shared.log-out', Selectable: true, Sortable: false, IsHidden: !this.hasFeature(this.featureEnum.User_ForceLogout) }
    ];
    this.createSearchForm();
    forkJoin([
      this._listService.getBranchList(),
      this._listService.getUserRolesList()
    ]).subscribe(res => {
      this.branchList = res[0].Data;
      this.roleList = res[1].Data;
    })
    this.activatedRoute.queryParams.subscribe((params) => this.subscribeFilteration(params));
  }
  createSearchForm() {
    this.page.searchForm = this._sharedService.formBuilder.group({
      branchID: [this.searchViewModel.branchID],
      roleID: [this.searchViewModel.roleID],
    });
    this.page.isPageLoaded = true;
  }
  search() {
    this.items = [];
    if (this.searchViewModel.Name == null) this.searchViewModel.Name = ""
    if (this.searchViewModel.Mobile == null) this.searchViewModel.Mobile = ""
    Object.assign(this.searchViewModel, this.page.searchForm.value);
    this._userService.get(this.searchViewModel, this.page.orderBy, this.page.isAscending, this.page.options.currentPage, this.page.options.itemsPerPage).subscribe((response) => {
      this.page.isSearching = false;
      if (response.Success) {
        this.page.isAllSelected = false;
        this.items = response.Data as UserHomeViewModel[];
      }
      this.fireEventToParent()
    }, () => { this.page.isSearching = false });
  }
  fillterList(type: string) {
    if (type == 'name') this.searchViewModel.Mobile = ""
    else if (type == 'mobile') this.searchViewModel.Name = ""
    Object.assign(this.searchViewModel, this.page.searchForm.value);
  }
  getItems(): UserHomeViewModel[] {
    return this.items.filter(i => i.Name.toLocaleLowerCase().includes(this.searchViewModel.Name.toLocaleLowerCase()) &&
      i.Mobile.toLocaleLowerCase().includes(this.searchViewModel.Mobile.toLocaleLowerCase()))
  }
  @ViewChild('confirmDeactivateUserTemplate', { static: false }) confirmDeactivateUserTemplate: any;
  showConfirmDeactivateUserTemplate(user: UserHomeViewModel) {
    this.selectedItem = user;
    this.modalRef = this._sharedService.modalService.show(this.confirmDeactivateUserTemplate, { class: 'modal-dialog modal-dialog-centered modal-25' });
  }
  activate() {
    this._userService.activate(this.selectedItem.ID).subscribe(res => {
      this._sharedService.showToastr(res)
      if (res.Success) {
        this.items.find(x => x.ID == this.selectedItem.ID).IsActive = true
      }
    })
  }
  deactivate() {
    this._userService.deactivate(this.selectedItem.ID).subscribe(res => {
      this._sharedService.showToastr(res)
      if (res.Success) {
        this.items.find(x => x.ID == this.selectedItem.ID).IsActive = false
      }
    })
  }
  switchAllowMultipleDevices(item: UserHomeViewModel) {
    this.page.isSaving = true
    this._userService.switchAllowMultipleDevices(item.ID).subscribe((res) => {
      this._sharedService.showToastr(res)
      if (res.Success) {
        item.AllowMultipleDevices = !item.AllowMultipleDevices
        this.page.isSaving = false
      }
    });
  }
  @ViewChild('logOutTemplate', { static: false }) forceLogOutTemplate: any;
  showForceLogOutTemplate(user: UserHomeViewModel) {
    this.selectedItem = user;
    this.modalRef = this._sharedService.modalService.show(this.forceLogOutTemplate, { class: 'modal-sm' });
  }
  forceLogout() {
    this.modalRef.hide();
    this._userService.forceLogout(this.selectedItem.ID).subscribe(res => this._sharedService.showToastr(res));
  }

  resetForm() {
    this.page.searchForm.reset()
    if (this.page.searchForm.controls['FromDate']) this.page.searchForm.controls['FromDate'].setValue(this._sharedService.dateService.getFirstDayCurrentMonth())
    if (this.page.searchForm.controls['ToDate']) this.page.searchForm.controls['ToDate'].setValue(new Date())
    this.searchViewModel.Name='';
    this.searchViewModel.Mobile = ""
    this.onSearchClicked()
  }
  
}
