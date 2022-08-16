import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FeatureEnum } from 'src/app/enum/feature.enum';
import { PageEnum } from 'src/app/enum/page.enum';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { SharedService } from 'src/app/service/shared.service';
import { environment } from 'src/environments/environment';
import { LoggedUserService } from '../../logged-user/logged-user.service';
import { ModuleEnum, UserFeatureViewModel, UserPagesViewModel } from '../../logged-user/view-model/logged-user.model';
import { AbstractSecondLayout } from '../../shared/utils/layout.utils';
import { OrderHomeService } from '../home/home.service';

@Component({
  selector: 'app-index',
  templateUrl: './layout.component.html',
})
export class TaskLayoutComponent extends AbstractSecondLayout implements OnInit {
  page: CRUDIndexPage = new CRUDIndexPage();
  moduleID: ModuleEnum []= [ModuleEnum.TASK]
  pageID: PageEnum = PageEnum.Tasks
  tabTotalItems?: number;
  constructor(
    public _sharedService: SharedService,
    public _userService: LoggedUserService,
    private _orderService: OrderHomeService,
  ) {
    super(_sharedService , _userService);
  }

  showRandomOrder: boolean = false
  ngOnInit(): void {
    if (!environment.production) {
      this.showRandomOrder = true
    }
    this.getUserModuleFeature()
    this.subscribeToChildEvent()
  }
  canShowReport() {
    return (this.getCurrentChild().ID == PageEnum.Tasks_Recent && SharedService.featureList.some(i => i == FeatureEnum.Task_GetReportByDate)) ||
      (this.getCurrentChild().ID == PageEnum.Tasks_History && SharedService.featureList.some(i => i == FeatureEnum.Task_GetReportByDate)) ||
      (this.getCurrentChild().ID == PageEnum.Tasks_Uncompleted_Cancelled && SharedService.featureList.some(i => i == FeatureEnum.Task_GetReportByDate)) ||
      (this.getCurrentChild().ID == PageEnum.Tasks_Transfers && SharedService.featureList.some(i => i == FeatureEnum.Task_GetReportByBranch))

  }
  createRandomOrder() {
    this._orderService.creatRandomOrder().subscribe(res => {
      this._sharedService.showToastr(res)
    })
  }




}
