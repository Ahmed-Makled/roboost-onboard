import { Component, OnInit } from '@angular/core';
import { FeatureEnum } from 'src/app/enum/feature.enum';
import { PageEnum } from 'src/app/enum/page.enum';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SharedService } from 'src/app/service/shared.service';
import { LoggedUserService } from '../../logged-user/logged-user.service';
import { ModuleEnum, UserFeatureViewModel, UserPagesViewModel } from '../../logged-user/view-model/logged-user.model';
import { AbstractSecondLayout } from '../../shared/utils/layout.utils';

@Component({
  selector: 'app-index',
  templateUrl: './layout.component.html',
})
export class UserLayoutComponent extends AbstractSecondLayout implements OnInit {

  page: CRUDIndexPage = new CRUDIndexPage();
  moduleID: ModuleEnum []= [ModuleEnum.USER]
  pageID: PageEnum = PageEnum.Users
  tabTotalItems?: number;

  constructor(
    public _sharedService: SharedService,
    public _userService: LoggedUserService,
  ) {
     super(_sharedService , _userService);
  }

  ngOnInit(): void {
    this.page.isPageLoaded =false;
    this.getUserModuleFeature()
    this.subscribeToChildEvent()
  }

  // getUserModuleFeature() {
  //   this._userService.getUserModuleFeature([this.moduleID]).subscribe((res) => {
  //     if (res.Success) {
  //       console.log(res.Data)
  //       SharedService.featureList = (res.Data as UserFeatureViewModel[]).map(i => i.ID)
  //     }
  //     this.page.isPageLoaded = true
  //   })
  // }

  canShowActionCreate() {
    return this.getCurrentChild().ID == PageEnum.Users_Home 
  }
 
 

}
