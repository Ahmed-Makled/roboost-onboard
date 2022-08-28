import { Injectable } from '@angular/core';
import { DeliveryTimeStatus } from 'src/app/enum/delivery-time-status';
import { FeatureEnum } from 'src/app/enum/feature.enum';
import { OrderStatus } from 'src/app/enum/order-status.enum';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { SharedService } from 'src/app/service/shared.service';
import { OnboardingDispatchService } from '../onboarding.service';
import { DispatchAgentViewModel, DispatchOrderViewModel, DispatchSelectItemViewModel, DispatchTripViewModel } from '../view-models/dispatch.model';
import { FilterByEnum, GroupingTypeEnum, RecentOldestEnum, SortingTypeEnum } from '../view-models/filter.model';
import { TaskUtilsService } from './task/task.utils';


@Injectable({
  providedIn: 'root',
})

export class DispatchUtilsService {

  constructor(
    private _dispatchService: OnboardingDispatchService,
    private _taskUtils: TaskUtilsService,
    private _sharedService: SharedService) { }
  /// --------------- Search ------------ ///
  getTrips() {
    if (this._dispatchService.filter.SearchValue == FilterByEnum.Agent_Name && this._dispatchService.pageUtils.filterSearchInput)
      return this._dispatchService.trips.filter(i => i.DeliverymanName?.toLowerCase().includes(this._dispatchService.pageUtils.filterSearchInput.toLowerCase()))
    else if (this._dispatchService.filter.SearchValue == FilterByEnum.Order_Number && this._dispatchService.pageUtils.filterSearchInput) {
      let tasks = this._dispatchService.tasks.filter(i => i.OrderNumber.toLowerCase().includes(this._dispatchService.pageUtils.filterSearchInput.toLowerCase()))
      return this._dispatchService.trips.filter(trip => tasks.some((order) => (order.TripID == trip.ID)));
    }
    else if (this._dispatchService.filter.SearchValue == FilterByEnum.Customer_Name && this._dispatchService.pageUtils.filterSearchInput) {
      let tasks = this._dispatchService.tasks.filter(i => i.Name.toLowerCase().includes(this._dispatchService.pageUtils.filterSearchInput.toLowerCase()))
      return this._dispatchService.trips.filter(trip => tasks.some((order) => (order.TripID == trip.ID)));
    }
    else if (this._dispatchService.filter.SearchValue == FilterByEnum.Customer_Mobile && this._dispatchService.pageUtils.filterSearchInput) {
      let tasks = this._dispatchService.tasks.filter(i => i.Mobile.includes(this._dispatchService.pageUtils.filterSearchInput))
      return this._dispatchService.trips.filter(trip => tasks.some((order) => (order.TripID == trip.ID)));
    }
    else if (this._dispatchService.filter.SearchValue == FilterByEnum.District && this._dispatchService.pageUtils.filterSearchInput) {
      let tasks = this._dispatchService.tasks.filter(i => i.District?.toLowerCase().includes(this._dispatchService.pageUtils.filterSearchInput.toLowerCase()))
      return this._dispatchService.trips.filter(trip => tasks.some((order) => (order.TripID == trip.ID)));
    }
    else return this._dispatchService.trips
  }
  getOrders(items: DispatchOrderViewModel[]) {
    if (this._dispatchService.filter.SearchValue == FilterByEnum.Order_Number && this._dispatchService.pageUtils.filterSearchInput)
      return items.filter(i => i.OrderNumber.toLowerCase().includes(this._dispatchService.pageUtils.filterSearchInput.toLowerCase()))
    else if (this._dispatchService.filter.SearchValue == FilterByEnum.Customer_Name && this._dispatchService.pageUtils.filterSearchInput)
      return items.filter(i => i.Name.toLowerCase().includes(this._dispatchService.pageUtils.filterSearchInput.toLowerCase()))
    else if (this._dispatchService.filter.SearchValue == FilterByEnum.Customer_Mobile && this._dispatchService.pageUtils.filterSearchInput)
      return items.filter(i => i.Mobile.includes(this._dispatchService.pageUtils.filterSearchInput))
    else if (this._dispatchService.filter.SearchValue == FilterByEnum.District && this._dispatchService.pageUtils.filterSearchInput)
      return items.filter(i => i.District?.toLowerCase().includes(this._dispatchService.pageUtils.filterSearchInput.toLowerCase()))
    else return items
  }
  getAgents(id: number): DispatchAgentViewModel[] {
    if (this._dispatchService.filter.SearchValue == FilterByEnum.Agent_Name && this._dispatchService.pageUtils.filterSearchInput)
      return this.getAgentsByStore(id).filter(i => i.Name.toLowerCase().includes(this._dispatchService.pageUtils.filterSearchInput.toLowerCase()))
    else return this.getAgentsByStore(id)
  }
  getAgentsByStore(id?: number): DispatchAgentViewModel[] {
    return this._dispatchService.agents.filter(i => (id ? i.BranchID == id : true))
  }
  getSearchByValue(): string {
    return this._dispatchService.filter.SearchByList.find(i => i.ID == this._dispatchService.filter.SearchValue).Name
  }

  /// --------------- Filter ------------ ///
  getAgentList(id: number): DispatchAgentViewModel[] {
    if (this._dispatchService.areaList.filter(i => i.Selected).length > 0) {
      let areaSelected = this._dispatchService.areaList.filter(i => i.Selected)
      return this.getAgents(id).filter(trip => areaSelected.some(filter => ((filter.ID === trip.AreaID))));
    }
    else if (this._dispatchService.storeList.filter(i => i.Selected).length > 0) {
      let selectedStores = this._dispatchService.storeList.filter(i => i.Selected)
      return this.getAgents(id).filter(trip => selectedStores.some((i) => ((i.ID == trip.BranchID))));
    }
    else return this.getAgents(id)
  }
  getTripList(): DispatchTripViewModel[] {
    if (this._dispatchService.areaList.filter(i => i.Selected).length > 0) {
      let areaSelected = this._dispatchService.areaList.filter(i => i.Selected)
      return this.getTrips().filter(trip => areaSelected.some(filter => ((filter.ID === trip.AreaID))));
    }
    else if (this._dispatchService.storeList.filter(i => i.Selected).length > 0) {
      let selectedStores = this._dispatchService.storeList.filter(i => i.Selected)
      return this.getTrips().filter(trip => selectedStores.some((i) => ((i.ID == trip.BranchID))));
    }
    else return this.getTrips()
  }
  getOrderList(items: DispatchOrderViewModel[]): DispatchOrderViewModel[] {
    if (this._dispatchService.areaList.filter(i => i.Selected).length > 0) {
      let areaSelected = this._dispatchService.areaList.filter(i => i.Selected)
      return this.getOrders(items).filter(trip => areaSelected.some(filter => ((filter.ID === trip.AreaID))));
    }
    else if (this._dispatchService.storeList.filter(i => i.Selected).length > 0) {
      let selectedStores = this._dispatchService.storeList.filter(i => i.Selected)
      return this.getOrders(items).filter(trip => selectedStores.some((i) => ((i.ID == trip.BranchID))));
    }
    else return this.getOrders(items)
  }
  getFiltterByList(): DispatchSelectItemViewModel[] {
    // console.log(this._dispatchService.storeList);
    if (this._dispatchService.filter.FiltterType == GroupingTypeEnum.AREA) { 
      console.log('object area');
      return this._dispatchService.areaList.filter(i => i.NumberOfTasks > 0) 
    }
    else {
      // console.log('object store',this._dispatchService.storeList.filter(i => i) );
      return this._dispatchService.storeList.filter(i => i.NumberOfTasks > 0) 
    }
  }
  onFilterClick(item: DispatchSelectItemViewModel, filterBy: number) {
    if (this._dispatchService.filter.FiltterType != filterBy) {
      if (filterBy == GroupingTypeEnum.AREA) {
        this._dispatchService.areaList.forEach(element => {
          element.Selected = false
        });
      }
      else if (filterBy == GroupingTypeEnum.STORE) {
        this._dispatchService.storeList.forEach(element => {
          element.Selected = false
        });
      }
    }
    item.Selected = !item.Selected
    this.saveFilterAndSorting()
  }
  getFilterByValue(): string {
    return this._dispatchService.filter.FiltterByList.find(i => i.ID == this._dispatchService.filter.FiltterType)?.Name
  }


  /// --------------- Grouping ------------ ///
  defaultGroupList: SelectItem[] = [{ Name: "", Selected: false, Code: "" }]
  isGroupingNone() {
    return this._dispatchService.filter.GroupingBy.find(i => i.Selected == true)?.ID == GroupingTypeEnum.NONE
  }
  getGroupingList() {
    let group = this._dispatchService.filter.GroupingBy.find(i => i.Selected)?.ID;
    if (group == GroupingTypeEnum.AREA)
      return this._dispatchService.areaList
    else if (group == GroupingTypeEnum.STORE)
      return this._dispatchService.storeList
    else return this.defaultGroupList
  }
  getTripListByGrouping(item: any): DispatchTripViewModel[] {
    let group = this._dispatchService.filter.GroupingBy.find(i => i.Selected)?.ID
    if (group == GroupingTypeEnum.AREA)
      return this.getTripList().filter(i => i.AreaID == item.ID)
    else if (group == GroupingTypeEnum.STORE)
      return this.getTripList().filter(i => i.BranchID == item.ID)
    else return this.getTripList()
  }
  getOrderListByGrouping(item: any, orders: DispatchOrderViewModel[], withUrgent: boolean = false): DispatchOrderViewModel[] {
    let group = this._dispatchService.filter.GroupingBy.find(i => i.Selected)?.ID
    if (group == GroupingTypeEnum.AREA)
      return this.getOrderList(orders).filter(i => i.AreaID == item.ID && (withUrgent ? i.DeliveryTimeStatus == DeliveryTimeStatus.TOP_URGENT : true))
    else if (group == GroupingTypeEnum.STORE)
      return this.getOrderList(orders).filter(i => i.BranchID == item.ID && (withUrgent ? i.DeliveryTimeStatus == DeliveryTimeStatus.TOP_URGENT : true))
    else return this.getOrderList(orders)//.filter(i => (withUrgent ? i.DeliveryTimeStatus == DeliveryTimeStatus.TOP_URGENT : true))
  }
  onSelectGroupBy(item: SelectItem) {
    this._dispatchService.filter.GroupByValue = item.ID
    if (item.ID == GroupingTypeEnum.NONE) this._dispatchService.filter.SortingValue = null
    else this._dispatchService.filter.SortingValue = SortingTypeEnum.AZ
  }



  /// --------------- Sorting ------------ ///
  // setNumberOfAgents() {
  //   this._dispatchService.areaList.forEach((element) => { element.NumberOfAgents = this._dispatchService.agents.filter((i) => i.AreaID == element.ID).length })
  //   this._dispatchService.storeList.forEach((element) => { element.NumberOfAgents = this._dispatchService.agents.filter((i) => i.BranchID == element.ID).length })
  //   this._sharedService.sortBy(this._dispatchService.areaList, { prop: "NumberOfAgents", desc: true })
  //   this._sharedService.sortBy(this._dispatchService.storeList, { prop: "NumberOfAgents", desc: true })
  // }
  // setNumberOfTrips() {
  //   this._dispatchService.areaList.forEach((i) => i.NumberOfTrips = this._dispatchService.trips.filter((x) => x.AreaID == i.ID).length)
  //   this._dispatchService.storeList.forEach((element) => { element.NumberOfTrips = this._dispatchService.trips.filter((i) => i.BranchID == element.ID).length })
  //   this._sharedService.sortBy(this._dispatchService.areaList, { prop: "NumberOfTrips", desc: true })
  //   this._sharedService.sortBy(this._dispatchService.storeList, { prop: "NumberOfTrips", desc: true })
  // }
  // setNumberOfOrders() {
  //   this._dispatchService.areaList.forEach((i) => i.NumberOfTasks = this._dispatchService.tasks.filter((x) => x.AreaID == i.ID).length)
  //   this._dispatchService.storeList.forEach((element) => { element.NumberOfTasks = this._dispatchService.tasks.filter((i) => i.BranchID == element.ID).length })
  //   this._sharedService.sortBy(this._dispatchService.areaList, { prop: "NumberOfTasks", desc: true })
  //   this._sharedService.sortBy(this._dispatchService.storeList, { prop: "NumberOfTasks", desc: true })
  // }
  // ---------------------------- //


  resetSorting() {
    this._dispatchService.filter.GroupByValue = GroupingTypeEnum.NONE
    this._dispatchService.filter.SortingValue = SortingTypeEnum.AZ
    this._dispatchService.filter.RecentValue = RecentOldestEnum.RECENT
  }
  sortDispatch() {
    let prop: string;
    let group = this._dispatchService.filter.GroupingBy.find(i => i.Selected)?.ID
    let sortingBy = this._dispatchService.filter.SortingGroupsBy.find(i => i.Selected)?.ID
    let isAscending = sortingBy == SortingTypeEnum.AZ || sortingBy == SortingTypeEnum.LOWEST_ORDERS
    let isRecent = this._dispatchService.filter.RecentOrOldest.find(i => i.Selected).ID == RecentOldestEnum.RECENT
    if (group == GroupingTypeEnum.AREA && (sortingBy == SortingTypeEnum.ZA || sortingBy == SortingTypeEnum.AZ))
      prop = "Name"
    else if (group == GroupingTypeEnum.STORE && (sortingBy == SortingTypeEnum.ZA || sortingBy == SortingTypeEnum.AZ))
      prop = "Name"
    else if (sortingBy == SortingTypeEnum.HIGHEST_ORDERS || sortingBy == SortingTypeEnum.LOWEST_ORDERS)
      prop = "NumberOfTasks"
    else prop = null
    if (prop) {
      this._sharedService.sortBy(this.getGroupingList(), { prop: prop, desc: !isAscending })
    }
    this._sharedService.sortBy(this.getTripList(), { prop: "SpentTime", desc: !isRecent })
    this._sharedService.sortBy(this.getOrderList(this._dispatchService.tasks), { prop: "SpentTime", desc: !isRecent })
  }

  saveFilterAndSorting() {
    this._sharedService.router.navigate(["/dispatch"], { queryParams: this.setFilterAndSorting() });
  }
  setFilterAndSorting() {
    var params = {};
    params['groupBy'] = this._dispatchService.filter.GroupByValue;
    params['sortBy'] = this._dispatchService.filter.SortingValue;
    params['withRecent'] = this._dispatchService.filter.RecentValue == RecentOldestEnum.RECENT;
    params['filterType'] = +this._dispatchService.filter.FiltterType;
    this._dispatchService.filter.FiltterValue = ""
    if (this.getFiltterByList().some(i => i.Selected)) {
      this.getFiltterByList().filter(i => i.Selected).forEach(element => {
        if (this.getFiltterByList().filter(i => i.Selected).indexOf(element) != 0)
          this._dispatchService.filter.FiltterValue += "_"
        this._dispatchService.filter.FiltterValue += element.ID
      });
      params['filterBy'] = this._dispatchService.filter.FiltterValue;
    }
    // params['key'] = (Math.random() * 1000).toString();
    return params
  }
  getFilterAndSorting(params: any) {
    if (params) {
      if (params['groupBy']) this._dispatchService.filter.GroupByValue = +params['groupBy'];
      if (params['sortBy']) this._dispatchService.filter.SortingValue = +params['sortBy'];
      if (params['withRecent']) this._dispatchService.filter.RecentValue = (params['withRecent'] == "true") ? RecentOldestEnum.RECENT : RecentOldestEnum.OLDEST;
      if (params['filterType']) this._dispatchService.filter.FiltterType = +params['filterType'];
      if (params['filterBy']) {
        this._dispatchService.filter.FiltterValue = params['filterBy']
        this._dispatchService.filter.FiltterValue.split('_').forEach(element => {
          if (this._dispatchService.filter.FiltterType == GroupingTypeEnum.AREA)
            this._dispatchService.areaList.find(i => i.ID == +element).Selected = true
          else this._dispatchService.storeList.find(i => i.ID == +element).Selected = true
        });
      }
    }
    this.setGroupAndSortValues()
    this.sortDispatch()
  }
  getDispatchFilter(params: string) {
    if (params.includes("&") && params.includes("=")) {
      this._dispatchService.filter.GroupByValue = parseInt(params.split('&')[0].split('=')[1])
      this._dispatchService.filter.SortingValue = parseInt(params.split('&')[1].split('=')[1])
      this._dispatchService.filter.RecentValue = parseInt(params.split('&')[2].split('=')[1])
      this.setGroupAndSortValues()
      this.sortDispatch()
    }
  }
  updateDispatchFilter() {
    let param = `groupBy=${this._dispatchService.filter.GroupByValue}&sortBy=${this._dispatchService.filter.SortingValue}&withRecent=${this._dispatchService.filter.RecentValue}`
    this._dispatchService.updateDispatchFilter(param).subscribe((res) => {
      this._sharedService.showToastr(res)
    })
  }
  setGroupAndSortValues() {
    this._dispatchService.filter.GroupingBy.forEach(element => { element.Selected = false });
    this._dispatchService.filter.GroupingBy.find(i => i.ID == (this._dispatchService.filter.GroupByValue ? this._dispatchService.filter.GroupByValue : GroupingTypeEnum.NONE)).Selected = true
    this._dispatchService.filter.SortingGroupsBy.forEach(element => { element.Selected = false });
    if (!this.isGroupingNone()) {
      this._dispatchService.filter.SortingGroupsBy.find(i => i.ID == this._dispatchService.filter.SortingValue).Selected = true
    }
    this._dispatchService.filter.RecentOrOldest.forEach(element => { element.Selected = false });
    this._dispatchService.filter.RecentOrOldest.find(i => i.ID == this._dispatchService.filter.RecentValue).Selected = true
  }



  /// --------------- Tabs ------------ ///
  setTaskTabs() {
    this._dispatchService.pageUtils.TasksTabList.push({ ID: OrderStatus.CREATED, Name: "system.all-tasks", Selected: true, Code: "bg-b500", Icon: "/assets/img/side-menu/orders-active.svg" })
    this._dispatchService.pageUtils.TasksTabList.push({ ID: OrderStatus.READY, Name: this._sharedService.isMobileView() ? "dispatch.ready" : "system.ready-tasks", Selected: false, Code: "bg-b500", Icon: "/assets/rb-icon/package_ready_solid.svg" })
    this._dispatchService.pageUtils.TasksTabList.push({ ID: OrderStatus.New, Name: this._sharedService.isSingleStore() || this._sharedService.isMobileView() ? "system.new" : "order.new-tasks", Selected: false, Code: "bg-r-500", Icon: "/assets/rb-icon/bolt_solid.svg" })
    this._dispatchService.pageUtils.TasksTabList.push({
      ID: OrderStatus.TRANSFERRED, Name: this._sharedService.isSingleStore() || this._sharedService.isMobileView() ? "system.transfered" : "dispatch.transferred-tasks",
      Selected: false, Code: "bg-o500", Icon: "/assets/rb-icon/share_solid.svg"
    })
    this._dispatchService.pageUtils.TasksTabList.push({
      ID: OrderStatus.SCHEDULED, Name: this._sharedService.isSingleStore() || this._sharedService.isMobileView() ? "system.scheduled" : "dispatch.scheduld-tasks",
      Selected: false, Code: "bg-p500", Icon: "/assets/rb-icon/calender_alt_solid.svg"
    })
  }
  onTasksTabClick(index: number) {
    if (this._sharedService.isMobileView()) {
      if (this._dispatchService.pageUtils.CurrentTasksTab == this.getTabList()[index].ID || !this._dispatchService.pageUtils.withShowTaskSection)
        this._dispatchService.pageUtils.withShowTaskSection = !this._dispatchService.pageUtils.withShowTaskSection
    }
    if (this._dispatchService.pageUtils.pageCreateTrip) return
    this._dispatchService.pageUtils.CurrentTasksTab = this.getTabList()[index].ID
  }
  getTabList() {
    return this._dispatchService.pageUtils.TasksTabList.filter(i => this.getFeatureByStatus(i.ID) ? this._sharedService.hasFeature(this.getFeatureByStatus(i.ID)) : true)
  }
  getFeatureByStatus(value: OrderStatus) {
    switch (value) {
      case OrderStatus.TRANSFERRED:
        return FeatureEnum.Task_TransferStatus
      case OrderStatus.New:
        return FeatureEnum.Task_NewStatus
      default:
        return null
    }
  }
  getOrderRowClass(groupItem) {
    return this._sharedService.isSingleStore() ? 'row-cols-2 ' : ((' row-cols-xxl-' + (this.getOrderCountForCol(groupItem) > 6 || !this.isGroupingNone() ? 6 : this.getOrderCountForCol(groupItem))) + ' ' +
      ('row-cols-xl-' + (this.getOrderCountForCol(groupItem) > 5 || !this.isGroupingNone() ? 5 : this.getOrderCountForCol(groupItem))) + ' ' +
      ('row-cols-lg-' + (this.getOrderCountForCol(groupItem) > 4 || !this.isGroupingNone() ? 4 : this.getOrderCountForCol(groupItem))) + ' ' +
      ('row-cols-md-' + (this.getOrderCountForCol(groupItem) > 3 || !this.isGroupingNone() ? 3 : this.getOrderCountForCol(groupItem))) + ' ' +
      ('row-cols-sm-' + (this.getOrderCountForCol(groupItem) > 2 || !this.isGroupingNone() ? 2 : this.getOrderCountForCol(groupItem))) + ' ' + 'row-cols-2')
  }
  getOrderGroupingColClass(groupItem) {
    return this._sharedService.isSingleStore() || !this.isGroupingNone() ? '' : (
      ('col-xxl-' + (this.getOrderCountForCol(groupItem) > 6 ? 12 : (this.getOrderCountForCol(groupItem) * 2))) + ' ' +
      ('col-lg-' + (this.getOrderCountForCol(groupItem) > 4 ? 12 : (this.getOrderCountForCol(groupItem) * 3))) + ' ' +
      ('col-md-' + (this.getOrderCountForCol(groupItem) > 4 ? 12 : (this.getOrderCountForCol(groupItem) * 4))) + ' ' +
      ('col-sm-' + (this.getOrderCountForCol(groupItem) > 2 ? 12 : (this.getOrderCountForCol(groupItem) * 6))))
  }
  getPausedOrdersCount(item: any, orders: DispatchOrderViewModel[]) {
    return this.getOrderListByGrouping(item, orders).filter(i => i.IsPaused).length
  }
  getOrderCountForCol(item) {
    return this.getOrderListByGrouping(item, this._taskUtils.getTasks(this._dispatchService.pageUtils.CurrentTasksTab), this._dispatchService.pageUtils.WithUrgentTasks).length
  }
}
