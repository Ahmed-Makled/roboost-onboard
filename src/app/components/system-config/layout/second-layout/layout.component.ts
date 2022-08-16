import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoggedUserService } from 'src/app/components/logged-user/logged-user.service';
import { ModuleEnum, UserFeatureViewModel, UserPagesViewModel } from 'src/app/components/logged-user/view-model/logged-user.model';
import { FeatureEnum } from 'src/app/enum/feature.enum';
import { PageEnum } from 'src/app/enum/page.enum';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
@Component({
  selector: 'app-index',
  templateUrl: './layout.component.html',
})
export class SystemSecondLayoutComponent implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  moduleID: ModuleEnum = ModuleEnum.AGENT
  tabTotalItems?: number;
  
  constructor(
    private _sharedService: SharedService,
    private _userService: LoggedUserService,
  ) { }
  ngOnInit(): void {
    this.subscribeToChildEvent()
  }
  
  onTabClick(item: UserPagesViewModel) {
    if (this.getCurrentTab() != item.ID) {
      this.page.isSearching = true
      this.tabTotalItems = null
    }
    this._sharedService.router.navigate([item.Url]);
  }
  getCurrentPage() {
    let routeList = this._sharedService.getCurrentRoute().split("/")
    return SharedService.pageList.find(i => i.Url == "/" + routeList[1] + "/" + routeList[2])
  }
  getTabList(): UserPagesViewModel[] {
    return SharedService.pageList.filter(i => i.ParentPageID == this.getCurrentPage().ID)
  }
  getCurrentTab() {

    return this.getTabList().find(i => i.Url == this._sharedService.getCurrentRoute())?.ID
  }

  showTabLinks() {
    return this.getTabList().some(i => i.ID == this.getCurrentTab())
  }
  canShowActionCreate() {
    return this.getCurrentTab() == PageEnum.System_Page_Home
  }
  //TODO REport Features
  canShowSaveButton() {
    return this.getCurrentTab() == PageEnum.System_Feature_Role || this.getCurrentTab() == PageEnum.System_Page_Role ||
     this.getCurrentTab() == PageEnum.System_Feature_Company || this.getCurrentTab() == PageEnum.System_Page_Company
  }
  subscribeToChildEvent() {
    this._sharedService.parentChildEvent.subscribe((res: any) => {
      if (!res.fromParent) {
        this.tabTotalItems = res.data
        this.page.isSaving = false
      }
    });
  }
  fireChildEvent() {
    this.page.isSaving = true;
    this._sharedService.fireEvent(true);
  }


}
