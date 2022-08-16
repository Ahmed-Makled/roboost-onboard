import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from 'src/app/components/logged-user/logged-user.service';
import { ModuleEnum, UserFeatureViewModel, UserPagesViewModel } from 'src/app/components/logged-user/view-model/logged-user.model';
import { PageEnum } from 'src/app/enum/page.enum';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-index',
  templateUrl: './frist-layout.component.html',
})
export class FristLayoutComponent implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  moduleID: ModuleEnum = ModuleEnum.AGENT
  pageID: PageEnum = PageEnum.System
  tabTotalItems?: number;
  selectedTabItem: UserPagesViewModel = this.getTabList()[0]

  constructor(
    private _sharedService: SharedService,
    private _userService: LoggedUserService,
  ) { }

  ngOnInit(): void {
    this.getUserModuleFeature()
  }

  getUserModuleFeature() {
    this._userService.getUserModuleFeature([this.moduleID]).subscribe((res) => {
      if (res.Success) {
        SharedService.featureList = (res.Data as UserFeatureViewModel[]).map(i => i.ID)
      }
      this.page.isPageLoaded = true
    })
  }

  onTabClick(item: UserPagesViewModel) {
    if (this.getCurrentTab().ID != item.ID)
      this.page.isSearching = true
    this.selectedTabItem

    this._sharedService.router.navigate([this.getPageRouteName(item.ID)]);
  }
  getPageRouteName(id: number): string {
    return SharedService.pageList.some(i => i.ParentPageID == id) ?
      this.getPageRouteName(SharedService.pageList.filter(i => i.ParentPageID == id)[0].ID) :
      SharedService.pageList.find(i => i.ID == id).Url
  }
  getCurrentPage() {
    return SharedService.pageList.find(i => i.ID == this.pageID)
  }
  getCurrentTab():UserPagesViewModel {
    let routeList = this._sharedService.getCurrentRoute().split("/")
    return this.getTabList().find(i => i.Url == "/" + routeList[1] + "/" + routeList[2] 
    && !routeList.includes("create"))
  }
  showTabs() {
    return this.getTabList().some(i => i.ID == this.getCurrentTab()?.ID) && this.getTabList().length>1 
  }
  getTabList(): UserPagesViewModel[] {
    return SharedService.pageList.filter(i => i.ParentPageID == this.pageID)
  }
  isMobileView(): boolean {
    return this._sharedService.isMobileView()
  }

}
