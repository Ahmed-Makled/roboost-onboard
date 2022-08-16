import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from 'src/app/components/logged-user/logged-user.service';
import { ModuleEnum, UserFeatureViewModel, UserPagesViewModel } from 'src/app/components/logged-user/view-model/logged-user.model';
import { PageEnum } from 'src/app/enum/page.enum';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
@Component({
  selector: 'app-index',
  templateUrl: './first-layout.component.html',
})
export class AnalyticsLayoutComponent implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  moduleID: ModuleEnum = ModuleEnum.AGENT
  pageID: PageEnum = PageEnum.Analytics

  constructor(
    private _sharedService: SharedService,
    private _userService: LoggedUserService,
  ) { }

  ngOnInit(): void {
    this.getUserModuleFeature()
  }
  getUserModuleFeature() {
    this._userService.getUserModuleFeature([this.moduleID,ModuleEnum.TASK,ModuleEnum.TRIP]).subscribe((res) => {
      if (res.Success)
        SharedService.featureList = (res.Data as UserFeatureViewModel[]).map(i => i.ID)
      this.page.isPageLoaded = true
    })
  }

  getPage() {
    return this._sharedService.getPageByID(this.pageID)
  }
  getChildList(id?:number): UserPagesViewModel[] {
    return this._sharedService.getChildList(id??this.pageID)
  }
  getCurrentChild():UserPagesViewModel {
    return this._sharedService.getFirstLayoutCurrentChild(this.pageID)
  }
  getLastLayoutCurrentChild():UserPagesViewModel {
    return this._sharedService.getThirdLayoutCurrentChild(this.getCurrentChild().ID)
  }

  showLayout():boolean {
    return  this.getChildList().length>1?true:false
  }

 

}
