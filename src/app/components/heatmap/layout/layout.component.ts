import { Component, OnInit } from '@angular/core';
import { FeatureEnum } from 'src/app/enum/feature.enum';
import { PageEnum } from 'src/app/enum/page.enum';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
import { LoggedUserService } from '../../logged-user/logged-user.service';
import { ModuleEnum, UserFeatureViewModel, UserPagesViewModel } from '../../logged-user/view-model/logged-user.model';

@Component({
  selector: 'app-index',
  templateUrl: './layout.component.html',
})
export class HeatmapLayoutComponent implements OnInit {

  page: CRUDIndexPage = new CRUDIndexPage();
  // moduleID: ModuleEnum = ModuleEnum.TRIP
  pageID: PageEnum = PageEnum.Heatmap
  tabTotalItems?: number;

  constructor(
    private _sharedService: SharedService,
    private _userService: LoggedUserService,
  ) { }

  ngOnInit(): void {
    this.getUserModuleFeature()
    this.subscribeToChildEvent()

  }

  getUserModuleFeature() {
    // this._userService.getUserModuleFeature([this.moduleID]).subscribe((res) => {
    //   if (res.Success) {
    //     SharedService.featureList = (res.Data as UserFeatureViewModel[]).map(i => i.ID)
    //   }
    //   this.page.isPageLoaded = true
    // })
    this.page.isPageLoaded = true
    

  }

  onTabClick(item: UserPagesViewModel) {
    if (this.getCurrentTab() != item.ID) {
      this.page.isSearching = true
      this.tabTotalItems = null
    }
    this._sharedService.router.navigate([item.Url]);
  }

  getCurrentPage() {
    return SharedService.pageList.find(i => i.ID == this.pageID)
  }
  getCurrentTab() {
    return this.getTabList().find(i => i.Url == this._sharedService.getCurrentRoute())?.ID
  }
  showTabHeader() {
    return this.getTabList().some(i => i.ID == this.getCurrentTab())
  }
  showTabLinks() :boolean {
    return this.getTabList().length>1
  }
 
  getTabList(): UserPagesViewModel[] {
    return SharedService.pageList.filter(i => i.ParentPageID == this.pageID)
  }

  subscribeToChildEvent() {
    this._sharedService.parentChildEvent.subscribe((res: any) => {
      if (!res.fromParent) {
        this.tabTotalItems = res.data
        this.page.isSearching = false
      }
    });
  }
  fireChildEvent() {
    this.page.isSearching = true;
    this._sharedService.fireEvent(true);
  }

}
