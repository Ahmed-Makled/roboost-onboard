import { Component, OnInit } from '@angular/core';
import { UserPagesViewModel } from 'src/app/components/logged-user/view-model/logged-user.model';
import { FeatureEnum } from 'src/app/enum/feature.enum';
import { PageEnum } from 'src/app/enum/page.enum';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
@Component({
  selector: 'app-index',
  templateUrl: './layout.component.html',
})
export class AnalyticsSecondLayoutComponent implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  pageParentID: PageEnum = PageEnum.Analytics
  tabTotalItems?: number;
  constructor(
    private _sharedService: SharedService,
  ) { }
  ngOnInit(): void {
    this.subscribeToChildEvent()
  }
  getParentPage() {
    return this._sharedService.getPageByID(this.pageParentID)
  }
  getPage() {
    return this._sharedService.getFirstLayoutCurrentChild(this.pageParentID)
  }
  getChildList(id?: number): UserPagesViewModel[] {
    return this._sharedService.getChildList(id ?? this.getPage().ID)
  }
  getCurrentChild(): UserPagesViewModel {
    return this._sharedService.getThirdLayoutCurrentChild(this.getPage().ID)
  }
  getThirdCurrentChild() {
    return this.getChildList(this.getCurrentChild().ID).find(i => i.Url == this._sharedService.getCurrentRoute())
  }
  showTabLinks() {
    return this.getChildList(this.getCurrentChild().ID).length > 0
  }
  showLayout() {
    return this.getPage() != undefined
  }
  canShowActionCreate() {
    return this.getPage().ID == PageEnum.Agent_profiles
  }
  canShowReport() {
    return (this.getCurrentChild().ID == PageEnum.Analytics_Tasks_By_Date && SharedService.featureList.some(i => i == FeatureEnum.Task_GetReportByDate)) ||
      (this.getCurrentChild().ID == PageEnum.Analytics_Tasks_By_Branch && SharedService.featureList.some(i => i == FeatureEnum.Task_GetReportByBranch)) ||
      this.getCurrentChild().ID == PageEnum.Analytics_Trips_By_Date ||
      this.getCurrentChild().ID == PageEnum.Analytics_Trips_By_Stores ||
      this.getCurrentChild().ID == PageEnum.Analytics_Trips_By_Deliveryman ||
      (this.getCurrentChild().ID == PageEnum.Analytics_Performance_Store && SharedService.featureList.some(i => i == FeatureEnum.Store_Branch_GetPerformanceReport))
  }
  onTabClick(item: UserPagesViewModel) {
    if (this.getCurrentChild().ID != item.ID) {
      this.page.isSearching = true
      this.tabTotalItems = null
    }
    this._sharedService.router.navigate([item.Url]);
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
  featureEnum = FeatureEnum
  hasFeature(value: FeatureEnum) {
    return SharedService.featureList.some(i => i == value)
  }
}
