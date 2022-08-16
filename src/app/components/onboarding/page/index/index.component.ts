import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { CRUDIndexPage } from 'src/app/model/shared/crud-index.model';
import { bound, SharedService } from 'src/app/service/shared.service';
import { ListService } from 'src/app/service/list.service';
import { DispatchAgentViewModel, DispatchOrderViewModel, DispatchSelectItemViewModel, DispatchTripViewModel } from '../view-models/dispatch.model';
import { DispatchSearchViewModel } from '../view-models/dispatch-search.model';
import { DispatchService } from '../dispatch.service';
import { FilterViewModel, RecentOldestEnum } from '../view-models/filter.model';
import { forkJoin, merge, Subscription } from 'rxjs';
import { SelectItem } from 'src/app/model/shared/select-view-model';
import { TripStatus } from 'src/app/enum/trip-status';
import { OrderStatus } from 'src/app/enum/order-status.enum';
import { DeliveryStatus } from 'src/app/enum/delivery-status';
import { ServiceItemViewModel } from '../view-models/order-create.model';
import { FormGroup, Validators } from '@angular/forms';
import { DeliveryTimeStatus } from 'src/app/enum/delivery-time-status';
import { DispatchUtilsViewModel } from '../view-models/dispatch.utils';
import { CdkDrag, CdkDragMove } from '@angular/cdk/drag-drop';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { ScheduledOrderViewModel, SpecialTripViewModel, UpdateOrderInfoViewModel, } from '../view-models/dispatch-create.model';
import { OrderKpiViewModel, TripKpiViewModel } from '../partial/_kpai/view-models/kpi.model';
import { TaskLogViewModel } from '../view-models/log.model';
import { TripLogViewModel } from '../view-models/log.model';
import { OrderAction } from 'src/app/enum/order-action.enum';
import { FeatureEnum } from 'src/app/enum/feature.enum';
import { DispatchActionEnum } from '../view-models/dispatch-action.enum';
import { TaskActionService } from 'src/app/components/onboarding/page/service/task/task.action';
import { TripActionService } from 'src/app/components/onboarding/page/service/trip/trip.action';
import { DispatchUtilsService } from 'src/app/components/onboarding/page/service/dispatch.utils';
import { DragDropUtilsService } from 'src/app/components/onboarding/page/service/drag-drop.utils';
import { GuidedTour, Orientation, GuidedTourModule, GuidedTourService } from 'ngx-guided-tour';
import { DummyDataService } from 'src/app/service/dummy-data.service';

@Component({
  selector: 'dispatch-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})

export class IndexComponent implements OnInit, OnDestroy {
  // DummyTrips = []
  // DummyAgents = []
  // DummyStores = []
  // DummyOrders = []

  // TripDummyObject=  {
  //   "ID": 1941874, "Number": 2250, "Code": "OfKOPgqmFk", "DeliverymanID": 111, "DeliverymanName": "t-branch-10",
  //   "DeliverymanImage": "https://api.roboost.app/uploads/deliverymen/deliveryman_character.png", "BranchID": 20,
  //   "AreaID": 1097, "BranchName": "Test Branch", "Status": 10,
  //   "StatusName": "Started", "StartTime": "2022-07-31T11:30:38.2903258",
  //   "CloseTime": null, "CreatedDate": "2022-07-31T11:30:23.4584394", "RateStatus": 0, "RateStatusName": "NOT_RATED",
  //   "PlannedCompleteTime": "2022-07-31T12:40:23.3113493", "IsPaused": false, "PlannedDuration": 0,
  //   "ServingTime": 5, "SpentTime": 92770, "ExcelantMaxTime": 315, "GoodMaxTime": 375, "LateMaxTime": 450,
  //   "Performance": { "ID": 1941874, "Rate": 4, "StatusName": "TOO LATE", "RemainingTime": 0, "Color": "#b5062b" },
  //   "PlannedCompleteTimeInt": -97075, "IsSpecialTrip": false, "ArrivalTime": "2022-07-31T16:52:58.28",
  //   "PickupTime": "2022-07-31T16:53:04.557", "ArrivalTimeSecond": 6,
  //   "Orders": [ ]
  // }

  // OrderDummyObject= {
  //   "ID": 3691741, "TripID": 1941874, "CustomerID": 0, "BranchID": 20, "AreaID": 1097,
  //   "BranchName": "Test Branch", "OrderNumber": "AE5AA554-7", "Code": "7w1HQXoJ6P", "Name": null, "Mobile": null,
  //   "Address": " محطة شدس براج الزهور 2 16- - الدور شقة ", "ServicesCount": 0,
  //   "PlannedDistance": 184.09, "Distance": 0, "PlannedDeliveryTime": "2022-07-31T12:11:03.16",
  //   "Date": "2022-07-31T11:31:03", "SpentTime": 92728, "RemainingTime": -90328,
  //   "DeliveryTimeStatusName": null, "DeliveryTimeStatus": 0, "DistanceStatus": 0, "DistanceStatusName": null,
  //   "Duration": 0, "Priority": null, "Amount": 0, "Status": 2, "StatusName": null,
  //   "PlannedLongitude": 29.9697291, "PlannedLatitude": 31.2398227,
  //   "Longitude": 0, "Latitude": 0, "HasGoogleLocation": true,
  //   "IsTopPriority": false, "IsPaused": false, "Rate": 0,
  //   "RateName": null, "Note": null, "OrderDeliveryTime": 30, "IsTransite": false,
  //   "District": null, "ServicesData": null, "Services": null
  // }

  // AgentDummyObject = { 
  //   "ID": 111, "Name": "t-branch-10", "StatusName": "On Duty", "StatusID": 2,
  //  "StatusColor": "#03A8FF", "Image": "https://api.roboost.app/uploads/deliverymen/deliveryman_character.png",
  //   "BranchID": 20, "BranchName": "Test Branch", "AreaID": 1097, "Longitude": 31.390185, "Latitude": 30.0539764 
  // }
  // StoreDummyObject = { 
  //   "Name": "Test Branch", "Code": "p3sqRmBHLcN", "ID": 20, "Longitude": 31.340478,
  //  "Latitude": 30.0796471, "NumberOfAgents": 2, "NumberOfTrips": 1, "NumberOfTasks": 23
  //  } 

  
  


  featureEnum = FeatureEnum
  page: CRUDIndexPage = new CRUDIndexPage();
  pageUtils: DispatchUtilsViewModel = new DispatchUtilsViewModel();
  filter: FilterViewModel = new FilterViewModel()
  modalRef: BsModalRef;
  searchViewModel: DispatchSearchViewModel = new DispatchSearchViewModel();
  trips: DispatchTripViewModel[] = [];
  orders: DispatchOrderViewModel[] = [];
  agents: DispatchAgentViewModel[] = []
  selectedOrder: DispatchOrderViewModel = new DispatchOrderViewModel()
  storeList: DispatchSelectItemViewModel[] = []
  areaList: DispatchSelectItemViewModel[] = []
  serviceList: ServiceItemViewModel[] = []
  orderKpi: OrderKpiViewModel = new OrderKpiViewModel()
  tripKpi: TripKpiViewModel = new TripKpiViewModel()
  tripLog: TripLogViewModel = new TripLogViewModel()
  zoom = 11;
  previous: any;

  
  public dispatchTour: GuidedTour = {
    tourId: 'experiment-tour',
    useOrb: false,
    steps: [
        {
          title: 'Next-up: Task Number',
          selector: '#searchSteps ',
            content: 'From here, you can search for any details regarding the tasks, agents, and trips, while grouping and sorting the results as you may like.',
            orientation: Orientation.Bottom
        },
   
        {
            title: 'Positioning',
            selector: '#accordionAgentCard',
            content: 'Step position can be set so that steps are always in view. This step is on the left.',
            orientation: Orientation.Top
        },
        {
            title: 'Positioning',
            selector: '#orderStep',
            content: 'Step position can be set so that steps are always in view. This step is on the left.',
            orientation: Orientation.Bottom
        },
      
    ]
  };
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _pageService: DispatchService,
    private _sharedService: SharedService,
    private _listService: ListService,
    private _taskAction: TaskActionService,
    private _tripAction: TripActionService,
    private _dispatchUtils: DispatchUtilsService,
    private _dragDropUtils: DragDropUtilsService,
    private guidedTourService: GuidedTourService,
    public DummyDataService :DummyDataService
  ) {

   
 

    
  }
  public onTourStart(): void {
    this.guidedTourService.startTour(this.dispatchTour);
  }
  
  ngOnDestroy(): void {
    clearInterval(this.pageUtils.SecondInterval)
    this.subs.unsubscribe();
    this.modalRef?.hide();
  }

  ngOnInit() {
   

    this._pageService.page = this.page
    this._pageService.pageUtils = this.pageUtils
    this._pageService.filter = this.filter
    this.orders = this._pageService.tasks
    this.initializePage();
  }

  hasFeature(value: FeatureEnum) {
    return SharedService.featureList.some(i => i == value)
  }
  disabledSubmit(form: FormGroup) {
    return this.page.isSaving || !form.valid;
  }
  isMobileView(): boolean {
    return this._sharedService.isMobileView()
  }

  initializePage() {
    this.setTaskTabs()
    forkJoin([
      this._listService.getAreaList(),
      this._pageService.getDispatchFilter(),
    ]).subscribe(res => {
      this.areaList = res[0].Data;
      this._pageService.areaList = this.areaList
      if (res[1].Data) {
        this._dispatchUtils.getDispatchFilter(res[1].Data)
      }
      this.getStoreList()
      this.getRunningAgent()
      this.getRunningTrips()
      this.getRunningOrders()
      this._pageService.startInterval()
      this.getServiceList()
      this.getKpi()
      this.page.isPageLoaded = true
    });
    this.mapStoreList()

  }

  getRunningAgent() {
    this._pageService.getRunningAgents(this.searchViewModel).subscribe((res) => {
      if (res.Success) {
        this.agents = res.Data;
        this._pageService.agents = this.agents
        this._dispatchUtils.setNumberOfAgents()
        this.pageUtils.IsAgentSearching = false
      }
    })
  }
  getRunningTrips() {
    this._tripAction.getRunningTrips(() => {
      this.trips = this._pageService.trips
      this._dispatchUtils.setNumberOfTrips()
      let isRecent = this.filter.RecentOrOldest.find(i => i.Selected).ID == RecentOldestEnum.RECENT
      this._sharedService.sortBy(this.getTripList(), { prop: "SpentTime", desc: !isRecent })
    })
  }
  getRunningOrders() {
    this._taskAction.getRunningOrders(() => {
      this.orders = this._pageService.tasks
      this._dispatchUtils.setNumberOfOrders()
      this.sortDispatch()
    })
  }
  getKpi() {
    forkJoin([
      this._taskAction._taskService.getOrderKPi(),
      this._tripAction._tripService.getTripKPi()
    ]).subscribe(res => {
      this.orderKpi = res[0].Data
      this.orderKpi.AvgDeliveryTime = res[0].Data.AvgDeliveryTime ?? 0
      this.tripKpi = res[1].Data
      this.pageUtils.IsKpisSearching = false
    });
  }

  getStoreList() {
    this._listService.getBranchListWithLocation().subscribe((res) => {
      this.storeList = res.Data
      this._pageService.storeList = this.storeList
      if (!this.isSingleStore())
        this._activatedRoute.queryParams.subscribe((params) => {
          if (Object.keys(params).length > 0) {
            this._dispatchUtils.getFilterAndSorting(params)
          }
        })
    })
  }
  getServiceList() {
    this._listService.getServicesItems().subscribe((res) => {
      this.serviceList = res.Data
    })
  }


  ////////// Store /////////
  getStoreName(id: number): string {
    return this.storeList.find(i => i.ID == id)?.Name
  }
  isSingleStore() {
    return this._sharedService._storageService.getISSingleStore()
  }
  //////////////////////////////////

  ////////// Agent /////////
  getAgentListForActions(branchID?: number): DispatchAgentViewModel[] {
    let agents: DispatchAgentViewModel[];
    agents = this.agents.filter((i) => (branchID == 0 ? true : i.BranchID == branchID) && i.ID != this.oldAgentID && i.StatusID == DeliveryStatus.AVAILABLE)
    if (this.agentTripSearchValue)
      return agents.filter(i => i.Name.toLowerCase().includes(this.agentTripSearchValue.toLowerCase()))
    else return agents
  }
  getTripAgent(item: DispatchTripViewModel) {
    return this.agents.find(i => i.ID == item.DeliverymanID)
  }
  isDmHasLocation(): boolean {
    return this.getTripAgent(this.selectedTrip)?.Latitude > 0 && this.getTripAgent(this.selectedTrip)?.Longitude > 0;;
  }
  //////////////////////  

  ///////// Task /////////
  @ViewChild('actionTamplate', { static: false }) actionTamplate: any;
  @ViewChild('scheduleOrderTemplate', { static: false }) scheduleOrderTemplate: any;
  @ViewChild('cancelOrderTemplate', { static: false }) cancelOrderTemplate: any;
  @ViewChild('removeOrderFromTripTemplate', { static: false }) removeOrderFromTripTemplate: any;
  @ViewChild('addToTripTemplate', { static: false }) addToTripTemplate: any;
  @ViewChild('updateOrderInfoTemplate', { static: false }) updateOrderInfoTemplate: any;

  selectedTripID: number;
  scheduledOrderModel: ScheduledOrderViewModel = new ScheduledOrderViewModel()
  orderEditModel: UpdateOrderInfoViewModel = new UpdateOrderInfoViewModel()
  updateOrderInfoForm: FormGroup
  showNote: boolean
  taskLog: TaskLogViewModel = new TaskLogViewModel()

  onOrderClick(value: any) {
    this.selectedOrder = value.item
    this._pageService.selectedOrder = this.selectedOrder
    if (!value.action) this.showTaskAction()
    else this.excuteActionOnTask(value.action, value.item)
  }
  showTaskAction() {
    this.selectedOrder.ShowOrderLocation = false
    this.selectedOrder.ShowTaskLog = false
    this.selectedOrder.ShowTaskDetails = false
    this.modalRef = this._sharedService.modalService.show(this.actionTamplate, { class: 'modal-order modal-transparent' });
  }
  excuteActionOnTask(action: DispatchActionEnum, item: DispatchOrderViewModel) {
    switch (action) {
      case DispatchActionEnum.PAUSE_ORDER: this.pauseOrder(item); break;
      case DispatchActionEnum.UNPAUSE_ORDER: this.unPauseOrder(item); break;
      case DispatchActionEnum.ADDED_TO_TRIP: this.showAddToTripTemplate(); break;
      case DispatchActionEnum.REMOVE_FROM_TRIP: this.removeOrderFromTrip(item); break;
      case DispatchActionEnum.CHANGE_TRIP: this.showChangeTripTemplate(); break;
    }
  }
  createUpdateTaskForm() {
    this.updateOrderInfoForm = this._sharedService.formBuilder.group({
      Address: [this.selectedOrder.Address, [Validators.required]],
      Note: [this.selectedOrder.Note],
    });
  }

  showRemoveOrderFromTripConfirmation() {
    this.modalRef = this._sharedService.modalService.show(this.removeOrderFromTripTemplate, { class: 'modal-330' });
  }
  showScheduledOrderTemplate(item: DispatchOrderViewModel) {
    this.scheduledOrderModel = new ScheduledOrderViewModel()
    this.scheduledOrderModel.OrderID = item.ID
    this.modalRef = this._sharedService.modalService.show(this.scheduleOrderTemplate, { class: 'modal-330' });
  }
  showCancelOrderConfirmation() {
    this.modalRef = this._sharedService.modalService.show(this.cancelOrderTemplate, { class: 'modal-330' });
  }
  showAddToTripTemplate() {
    this.selectedTripID = null
    this.pageUtils.oldTripID = -1
    this.modalRef = this._sharedService.modalService.show(this.addToTripTemplate, { class: 'modal-dialog modal-640' });
  }
  showChangeTripTemplate() {
    this.selectedTripID = null
    this.pageUtils.oldTripID = this.selectedOrder.TripID
    this.modalRef = this._sharedService.modalService.show(this.addToTripTemplate, { class: 'modal-dialog modal-640' });
  }
  showUpdateTaskTemplate() {
    this.orderEditModel = new UpdateOrderInfoViewModel()
    this.showNote = false
    this.createUpdateTaskForm()
    this.serviceList.forEach(element => { element.Selected = false; })
    if (this.selectedOrder.Services) {
      this._taskAction._taskService.getOrderServices(this.selectedOrder.ID).subscribe(res => {
        if (res.Success) {
          let services = res.Data
          this.serviceList.filter(i => services.some(x => x == i.ID)).forEach(element => { element.Selected = true })
        }
      })
    }
    this.modalRef = this._sharedService.modalService.show(this.updateOrderInfoTemplate, { class: 'modal-640' });
  }


  getTaskLog() {
    this._taskAction.getTaskLog(this.selectedOrder, this.taskLog)
  }
  removeOrderFromTrip(item: DispatchOrderViewModel, callback?) {
    return this._taskAction.removeOrderFromTrip(item, callback)
  }
  scheduledOrder() {
    this._taskAction.scheduledOrder(this.scheduledOrderModel)
  }
  cancelOrder(item: DispatchOrderViewModel) {
    this._taskAction.cancelOrder(item, (isSuccess) => { if (isSuccess) this.orderKpi.CanceledOrders += 1 })
  }
  pauseOrder(item: DispatchOrderViewModel, callback?) {
    this._taskAction.pauseOrder(item, callback)
  }
  unPauseOrder(item: DispatchOrderViewModel, callback?) {
    this._taskAction.unPauseOrder(item, callback)
  }
  changeOrderPriority(item: DispatchOrderViewModel, callback?) {
    this._taskAction.changeOrderPriority(item, callback)
  }
  setOrderAsDelivered(item: DispatchOrderViewModel) {
    this._taskAction.setOrderAsDelivered(item, (isSuccess) => { if (isSuccess) this.orderKpi.DeliveredOrders += 1 })
  }
  setOrderAsReady(item: DispatchOrderViewModel, callback?) {
    this._taskAction.setOrderAsReady(item, callback)
  }
  setOrderAsInProgress(item: DispatchOrderViewModel, callback?) {
    this._taskAction.setOrderAsInProgress(item, callback)
  }
  setOrderAsNew(item: DispatchOrderViewModel, callback?) {
    this._taskAction.setOrderAsNew(item, callback)
  }
  cancelOTP() {
    this._taskAction.cancelOTP(this.selectedOrder)
  }
  addToTrip(item: DispatchOrderViewModel, tripID: number, callback?) {
    this._taskAction.addToTrip(item, tripID, false, callback)
  }
  changeTrip(item: DispatchOrderViewModel, tripID: number, callback?) {
    this._taskAction.addToTrip(item, tripID, true, callback)
  }
  updateInfo() {
    Object.assign(this.orderEditModel, this.updateOrderInfoForm.value);
    this._taskAction.updateInfo(this.orderEditModel, this.selectedOrder, this.serviceList)
  }
  onCreateTask() {
    this.orderKpi.TotalOrders += 1
  }

  getTripOrderList(id: number, withUrgent: boolean): DispatchOrderViewModel[] {
    return this._taskAction._taskUtils.getTripOrderList(id, withUrgent)
  }
  getOnTripOrderList(): DispatchOrderViewModel[] {
    return this._taskAction._taskUtils.getOnTripOrderList()
  }
  getDeliveredOrderList(): DispatchOrderViewModel[] {
    return this.orders.filter(i => i.Status == OrderStatus.DELIVERED || i.Status == OrderStatus.DELIVERED_MANUALLY)
  }
  getTripDeliveredOrderList(id: number): DispatchOrderViewModel[] {
    return this.orders.filter(i => i.TripID == id && i.Status == OrderStatus.DELIVERED)
  }
  getTasks(status: OrderStatus): DispatchOrderViewModel[] {
    return this._taskAction._taskUtils.getTasks(status)
  }
  getTasksWithNoFilterStatus(status: OrderStatus): DispatchOrderViewModel[] {
    return this._taskAction._taskUtils.getTasksWithNoFilterStatus(status)
  }
  getTasksByStatus(status: OrderStatus): DispatchOrderViewModel[] {
    return this._taskAction._taskUtils.getTasksByStatus(status)
  }
  getUrgentTasksCount(items: DispatchOrderViewModel[], groupValue?: number): number {
    return this._taskAction._taskUtils.getUrgentTasksCount(items, groupValue)
  }
  getUrgentTripsTasksCount(): number {
    return this.getOrderList(this.orders).filter(i => i.TripID > 0 && i.DeliveryTimeStatus == DeliveryTimeStatus.TOP_URGENT).length
  }
  getOrdersStoresCount(items: DispatchOrderViewModel[]) {
    return [...new Set(items.map(i => i.BranchName))].length
  }
  getOrderUrlONMaps(item: DispatchOrderViewModel): string {
    return this._taskAction._taskUtils.getOrderUrlONMaps(item)
  }
  getTaskLogDeliverd(item): boolean {
    return item.Action == OrderAction.DELIVERED || item.Action == OrderAction.DELIVERED_MANUALLY || item.Action == OrderAction.DELIVERED_BY_BRANCH_MANAGER
  }
  getTaskLogCreated(item): boolean {
    return item.Action == OrderAction.CREATED_BY_BRANCH_MANAGER || item.Action == OrderAction.CREATED_FROM_POS
  }
  getOrderLatitude(order: DispatchOrderViewModel) {
    return this._taskAction._taskUtils.getOrderLatitude(order)
  }
  getOrderLongtude(order: DispatchOrderViewModel) {
    return this._taskAction._taskUtils.getOrderLongtude(order)
  }
  getOrderMarker(order: DispatchOrderViewModel) {
    return this._taskAction._taskUtils.getOrderMarker(order)
  }
  getTotalItem() {
    return this._sharedService.getSumValues(this.taskLog.Items.map(i => i.Price))
  }

  isTripHasCantDeliver(id: number): boolean {
    return this._taskAction._taskUtils.isTripHasCantDeliverTask(id)
  }
  isCantDelivered(item: DispatchOrderViewModel) {
    return this._taskAction._taskUtils.isCantDelivered(item)
  }
  isOrderDelivered(item: DispatchOrderViewModel) {
    return this._taskAction._taskUtils.isOrderDelivered(item)
  }
  isOrderCanceled(item: DispatchOrderViewModel) {
    return this._taskAction._taskUtils.isOrderCanceled(item)
  }
  isOnTrip(item: DispatchOrderViewModel): boolean {
    return this._taskAction._taskUtils.isOnTrip(item)
  }
  isReady(item: DispatchOrderViewModel): boolean {
    return this._taskAction._taskUtils.isReady(item)
  }
  isCreated(item: DispatchOrderViewModel): boolean {
    return this._taskAction._taskUtils.isCreated(item)
  }
  isNew(item: DispatchOrderViewModel): boolean {
    return this._taskAction._taskUtils.isNew(item)
  }
  isSchedualed(item: DispatchOrderViewModel): boolean {
    return this._taskAction._taskUtils.isSchedualed(item)
  }

  /////////////////////////////////////////////

  //////////// Trip ////////////

  @ViewChild('cancelTripTemplate', { static: false }) cancelTripTemplate: any;
  @ViewChild('addAgentToTripTemplate', { static: false }) addAgentToTripTemplate: any;
  @ViewChild('tripActionsTemplate', { static: false }) tripActionsTemplate: any;

  selectedTrip: DispatchTripViewModel = new DispatchTripViewModel()
  agentTripSearchValue: any
  selectedAgentID: number;
  oldAgentID: number;

  showTripActionsTemplate(item: DispatchTripViewModel, event, sent: boolean) {
    if (sent) {
      this.selectedTrip = item;
      this.selectedTrip.showTripLog = false
      this.selectedTrip.showTracking = false;
      this.modalRef = this._sharedService.modalService.show(this.tripActionsTemplate, { class: 'modal-order modal-transparent' });
    }
    else event.stopPropagation();
  }
  showCancelTripConfirmation(item?: DispatchTripViewModel) {
    if (item) this.selectedTrip = item
    this.modalRef = this._sharedService.modalService.show(this.cancelTripTemplate, { class: 'modal-330' });
  }
  showAddAgentToTripTemplate(item: DispatchTripViewModel) {
    this.selectedTrip = item
    this.agentTripSearchValue = null
    this.oldAgentID = -1
    this.selectedAgentID = null
    this.modalRef = this._sharedService.modalService.show(this.addAgentToTripTemplate, { class: 'modal-dialog modal-640' });
  }
  showChangeTripAgentTemplate(item: DispatchTripViewModel) {
    this.selectedTrip = item
    this.agentTripSearchValue = null
    this.oldAgentID = this.selectedTrip.DeliverymanID
    this.modalRef = this._sharedService.modalService.show(this.addAgentToTripTemplate, { class: 'modal-dialog modal-640' });
  }
  showTripLog() {
    this.tripLog = new TripLogViewModel()
    this.selectedTrip.showTracking = false;
    this.selectedTrip.showTripLog = true
    this._tripAction.getTripLog(this.selectedTrip, () => { this.tripLog = this._pageService.tripLog })
  }
  showLiveTracking() {
    this.selectedTrip.showTracking = true;
    this.selectedTrip.showTripLog = false
    this.previous = null;
  }

  addAgentToTrip(item: DispatchTripViewModel, agentID: number, callback?) {
    this._tripAction.addAgentToTrip(item, agentID, this.agents, callback)
  }
  changeTripAgent(item: DispatchTripViewModel, agentID: number, callback?) {
    this._tripAction.changeTripAgent(item, agentID, this.agents, callback)
  }
  cancelTrip(item: DispatchTripViewModel, callback?) {
    this._tripAction.cancelTrip(item, this.orders, this.agents, callback)
  }
  closeTrip(item: DispatchTripViewModel, callback?) {
    this._tripAction.closeTrip(item, callback)
  }

  getTripById(id: number): DispatchTripViewModel {
    return this.trips.find(i => i.ID == id)
  }
  getTripListForActions(): DispatchTripViewModel[] {
    return this._tripAction._tripUtils.getTripListForActions()
  }

  isTripLogDeliveredOrCompleted(item): boolean {
    return item.Status == TripStatus.DELIVERED || item.Status == TripStatus.COMPLETED
  }
  isTripLogCreated(item): boolean {
    return item.Status == TripStatus.CREATED
  }
  isTripDelivered(id: number) {
    return this._tripAction._tripUtils.isTripDelivered(id)
  }

  //createSpecialTrip



  @ViewChild('createTripTemplate', { static: false }) createTripTemplate: any;
  tripForm: FormGroup
  tripModel: SpecialTripViewModel = new SpecialTripViewModel()
  tripReasonList: SelectItem[] = []

  createSpecialTrip() {
    Object.assign(this.tripModel, this.tripForm.value);
    this._tripAction.createSpecialTrip(this.tripModel)
  }
  createTripForm() {
    this.tripForm = this._sharedService.formBuilder.group({
      BranchID: [this.tripModel.BranchID, (this.isSingleStore() ? [] : [Validators.required])],
      SpecialTripReasonID: [this.tripModel.SpecialTripReasonID, [Validators.required]],
      SpecialTripReasonNote: [this.tripModel.SpecialTripReasonNote],
    });
  }
  showCreateTripTemplate(): void {
    this.onStartCreateTrip(!this.isSingleStore() && !this.isMobileView())
    this.modalRef = this._sharedService.modalService.show(this.createTripTemplate, { class: `modal-special-trip ${this.isSingleStore() ? 'modal-500' : ''}` });
    this._pageService.modalRef = this.modalRef
  }
  showCreateTrip() {
    this.onStartCreateTrip()
    this.pageUtils.pageCreateTrip = true
  }
  onStartCreateTrip(withRest: boolean = true) {
    if (withRest) {
      this.tripModel.BranchID = this.isSingleStore() ? 0 : this.storeList[0].ID
      this.createTripForm();
      this.pageUtils.oldTripID = -1
      this._taskAction._taskUtils.resetTaskList()
      this.agents.filter(i => i.Selected == true).forEach(order => { order.Selected = false; });
      this._tripAction.getReasonList(res => { this.tripReasonList = res.Data })
    }
    this.tripModel.DeliverymanID = null
    this.agentTripSearchValue = null
  }
  getCreateTripOrderList(withSelected: boolean = false): DispatchOrderViewModel[] {
    return this._taskAction._taskUtils.getCreateTripOrderList(this.tripModel.BranchID, withSelected)
  }
  isOtherReasonForTrip(): boolean {
    return this.specialTripReasonID.value == 3
  }
  onTripReasonChange() {
    if (this.isOtherReasonForTrip()) {
      this.specialTripReasonNote.setValidators(Validators.compose([Validators.required]))
    }
    else {
      this.specialTripReasonNote.clearValidators();
    }
    this.specialTripReasonNote.updateValueAndValidity();
  }
  disableCreateTrip(): boolean {
    return this.tripForm.invalid || !this.orders.some(i => i.isSelected) || this.tripModel.DeliverymanID == null
  }
  anyTaskSelected(): boolean {
    return this.orders.some(i => i.isSelected)
  }
  canShowPageCreateTrip(): boolean {
    return (this.isSingleStore() || this.isMobileView()) && this.pageUtils.pageCreateTrip
  }
  get specialTripReasonID() {
    return this.tripForm.get("SpecialTripReasonID")
  }
  get specialTripReasonNote() {
    return this.tripForm.get("SpecialTripReasonNote")
  }
  get specialTripBranch() {
    return this.tripForm.get("BranchID")
  }
  ///////////////////////////////////






  clickedMarker(infowindow: any) {
    if (this.previous) {
      this.previous?.close();
    }
    this.previous = infowindow;
  }
  onMapClick($event: MouseEvent) {
    this.previous?.close();
  }
  stopPropgation(event) {
    if (this.pageUtils.pageCreateTrip) {
      return false
    }
  }

  ///////////// Utils /////////////
  updateDispatchFilter() {
    this._dispatchUtils.updateDispatchFilter()
  }

  // ------------- Search ------------ 
  getTrips() {
    return this._dispatchUtils.getTrips()
  }
  getOrders(items: DispatchOrderViewModel[]) {
    return this._dispatchUtils.getOrders(items)
  }
  getSearchByValue(): string {
    return this._dispatchUtils.getSearchByValue()
  }

  // ------------ Grouping ------------ 
  isGroupingNone() {
    return this._dispatchUtils.isGroupingNone()
  }
  getGroupingList() {
    return this._dispatchUtils.getGroupingList()
  }
  getTripListByGrouping(item: any): DispatchTripViewModel[] {
    return this._dispatchUtils.getTripListByGrouping(item)
  }
  getOrderListByGrouping(item: any, orders: DispatchOrderViewModel[], withUrgent: boolean = false): DispatchOrderViewModel[] {
    return this._dispatchUtils.getOrderListByGrouping(item, orders, withUrgent)
  }
  onSelectGroupBy(item: SelectItem) {
    return this._dispatchUtils.onSelectGroupBy(item)
  }

  //---------sorting dispatch---------
  @ViewChild('sortingGroupingTemplate', { static: false }) sortingGroupingTemplate: any;
  showSortingGroupingTemplate() {
    this.filter.GroupByValue = this.filter.GroupingBy.find(i => i.Selected)?.ID
    this.filter.SortingValue = this.filter.SortingGroupsBy.find(i => i.Selected)?.ID
    this.filter.RecentValue = this.filter.RecentOrOldest.find(i => i.Selected).ID
    this.modalRef = this._sharedService.modalService.show(this.sortingGroupingTemplate, { class: 'modal-dialog modal-dialog-centered filter-model' });
  }
  resetSorting() {
    this._dispatchUtils.resetSorting()
  }
  sortDispatch() {
    this._dispatchUtils.sortDispatch()
  }
  onSortDispatchClick() {
    this._dispatchUtils.saveFilterAndSorting()
  }
  mapStoreList() {
    this.storeList = this.storeList.map(i => { return { ...i, NumberOfAgent: this.agents.filter(i => i.BranchID == i.ID).length } })
  }

  ///---------------- fliter ----------------
  getAgentList(id: number): DispatchAgentViewModel[] {
    return this.DummyDataService.DummyAgents.filter(i => (id ? i.BranchID == id : true))
  }
  getTripList(): DispatchTripViewModel[] {
    return this._dispatchUtils.getTripList()
  }
  getOrderList(items: DispatchOrderViewModel[]): DispatchOrderViewModel[] {
    return this._dispatchUtils.getOrderList(items)
  }
  getFilterByValue(): string {
    return this._dispatchUtils.getFilterByValue()
  }
  onFilterClick(item: DispatchSelectItemViewModel) {
    let filterBy = +this._activatedRoute.snapshot.queryParams["filterType"]
    this._dispatchUtils.onFilterClick(item, filterBy)
  }
  onUrgentClick(canFiltter: boolean, withUrgent: boolean) {
    // if(canFiltter)
    withUrgent = !withUrgent
  }
  resetFilter() {
    this.areaList.forEach(i => i.Selected = false)
    this.storeList.forEach(i => i.Selected = false)
    // this._dispatchUtils.saveFilterAndSorting()
  }

  getFiltterByList(): DispatchSelectItemViewModel[] {
    return this._dispatchUtils.getFiltterByList()
  }
  getUrgentTaskStoreCount(id) {
    return this._taskAction._taskUtils.getUrgentTaskStoreCount(id)
  }
  isSeletedInFilter(id: number): boolean {
    return this.filter.FiltterValue.split('_').some(i => i == id.toString())
  }
  /////////////////////////////
 canDrop(){return}

  /////////// Tabs ///////////
  setTaskTabs() {
    this._dispatchUtils.setTaskTabs()
  }
  onTasksTabClick(index: number) {
    this._dispatchUtils.onTasksTabClick(index)
  }
  getTabList() {
    return this._dispatchUtils.getTabList()
  }
  getOrderRowClass(groupItem) {
    return this._dispatchUtils.getOrderRowClass(groupItem)
  }
  getOrderGroupingColClass(groupItem) {
    return this._dispatchUtils.getOrderGroupingColClass(groupItem)
  }
  getPausedOrdersCount(item: any, orders: DispatchOrderViewModel[]) {
    return this._dispatchUtils.getPausedOrdersCount(item, orders)
  }
  getOrderCountForCol(item) {
    return this._dispatchUtils.getOrderCountForCol(item)
  }
  /////////////////////////////////////////

  // --------------- Drag Drop --------------- //
  drop(event: any) {
    this._dragDropUtils.drop(event)
  }
  onDrop(item: DispatchOrderViewModel, source, target, afterDropCallback) {
    this._dragDropUtils.onDrop(item, source, target, afterDropCallback)
    if ((item.Status == OrderStatus.New || item.Status == OrderStatus.CREATED || item.Status == OrderStatus.READY) &&
      +target.id == OrderStatus.SCHEDULED) {
      if (!this.hasFeature(this.featureEnum.Task_ScheduleOrder) || !this._dragDropUtils.canDrop(OrderStatus.SCHEDULED)) return false;
      this.showScheduledOrderTemplate(this.orders.find(i => i.ID == item.ID))
    }
  }
  onDragMoved(event) {
    this._dragDropUtils.onDragMoved(event)
  }
  getDropListElement(element: Element): Element {
    return this._dragDropUtils.getDropListElement(element)
  }
  canDropOrder(event): boolean {
    return true;
  }
  canDropOrderToTrip(event): boolean {
    let item: DispatchOrderViewModel = event.data
    return true;
  }
  canDropReadyOrder(event): boolean {
    let sourceID: OrderStatus = (event.data as DispatchOrderViewModel).Status
    return sourceID == OrderStatus.CREATED || sourceID == OrderStatus.SCHEDULED
  }

  @ViewChild('scrollEl')
  scrollEl: ElementRef<HTMLElement>;
  @ViewChildren(CdkDrag)
  dragEls: QueryList<CdkDrag>;
  subs = new Subscription();
  private animationFrame: number | undefined;
  @bound
  public triggerScroll($event: CdkDragMove) {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = undefined;
    }
    this.animationFrame = requestAnimationFrame(() => this.scroll($event));
  }
  @bound
  private cancelScroll() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = undefined;
    }
  }
  ngAfterViewInit() {
    const onMove$ = this.dragEls.changes.pipe(startWith(this.dragEls), map((d: QueryList<CdkDrag>) => d.toArray()), map(dragels => dragels.map(drag => drag.moved)), switchMap(obs => merge(...obs)), tap(this.triggerScroll));
    this.subs.add(onMove$.subscribe());
    const onDown$ = this.dragEls.changes.pipe(startWith(this.dragEls), map((d: QueryList<CdkDrag>) => d.toArray()), map(dragels => dragels.map(drag => drag.ended)), switchMap(obs => merge(...obs)), tap(this.cancelScroll));
    this.subs.add(onDown$.subscribe());
  }
  private scroll($event: CdkDragMove) {
    this._dragDropUtils.scroll($event, this.scrollEl, this.animationFrame)
  }
  // --------------------------------/

}


 function createDummyData(object,numRepate:number=5){

return  Array(numRepate).fill(object )

}

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
