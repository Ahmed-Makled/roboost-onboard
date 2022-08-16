export enum FeatureEnum {
  // [DescriptionAnnotation("REMOVE ORDER FROM TRIP", "REMOVE ORDER FROM TRIP")]
  REMOVE_ORDER_FROM_TRIP = 1,

  // [DescriptionAnnotation("ADD ORDER TO TRIP", "ADD ORDER To TRIP")]
  ADD_ORDER_To_TRIP,

  // [DescriptionAnnotation("Cancel ORDER ", "Cancel ORDER")]
  CANCEL_ORDER = 3,
  // [DescriptionAnnotation("Pause ORDER ", "Pause ORDER")]
  PAUSE_ORDER = 4,

  // [DescriptionAnnotation("UnPause ORDER ", "UnPause ORDER")]
  UnPause_ORDER = 5,

  // [DescriptionAnnotation("Change Status To Ready", "Change Status To Ready")]
  CHANGE_STATUS_TO_READY = 6,

  // [DescriptionAnnotation("Deliver Order", "Deliver Order")]
  DELIVER_ORDER = 7,

  // [DescriptionAnnotation("Change Order Priority", "Change Order Priority")]
  CHANGE_ORDER_PRIORITY = 8,

  // [DescriptionAnnotation("Update Order Info", "Update Order Info")]
  UPDATE_ORDER_INFO = 9,
  // [DescriptionAnnotation("ADD USER", "ADD USER")]
  ADD_USER = 10,
  // [DescriptionAnnotation("Add To Queue", "Add To Queue")]
  AddToQueue = 11,
  // [DescriptionAnnotation("End_Shift", "End_Shift")]
  End_Shift = 12,
  //// [DescriptionAnnotation("Archive", "Archive")]

  //Archive = 13,
  //// [DescriptionAnnotation("ChangeBranch", "ChangeBranch")]

  //ChangeBranch = 14,
  // [DescriptionAnnotation("RemovePenalize", "RemovePenalize")]

  RemovePenalize = 15,
  // [DescriptionAnnotation("START_BREAK", "START_BREAK")]

  START_BREAK = 16,
  // [DescriptionAnnotation("Reactivate", "Reactivate")]

  Reactivate = 17,
  // [DescriptionAnnotation("SET_AS_IN_PROGRESS", "SET_AS_IN_PROGRESS")]
  SET_AS_IN_PROGRESS = 18,
  // [DescriptionAnnotation("START_TRIP", "START_TRIP")]
  START_TRIP = 19,
  // [DescriptionAnnotation("CANCEL_TRIP", "CANCEL_TRIP")]
  CANCEL_TRIP = 20,
  // [DescriptionAnnotation("ASSIGN_TO_DM", "ASSIGN_TO_DM")]
  ASSIGN_TO_DM = 21,
  // [DescriptionAnnotation("CREATE_SPECIAL_TRIP", "CREATE_SPECIAL_TRIP")]
  CREATE_SPECIAL_TRIP = 22,
  // [DescriptionAnnotation("END_BREAK", "END_BREAK")]
  END_BREAK = 23,
  // [DescriptionAnnotation("GET_ORDER_DETAIL", "GET_ORDER_DETAIL")]
  GET_ORDER_DETAIL = 24,
  // [DescriptionAnnotation("GET_TRIP_DETAIL", "GET_TRIP_DETAIL")]
  GET_TRIP_DETAIL = 25,
  // [DescriptionAnnotation("UPDATE_CUSTOMER_PRIORITY", "UPDATE_CUSTOMER_PRIORITY")]
  UPDATE_CUSTOMER_PRIORITY = 26,
  // [DescriptionAnnotation("FORCE_LOG_OUT", "FORCE_LOG_OUT")]
  FORCE_LOG_OUT = 27,
  // [DescriptionAnnotation("Resolve Customer Review", "Resolve Customer Review")]
  Resolve_Customer_Review = 28,
  // [DescriptionAnnotation("Set as Schedulde", "Set as Schedulde")]
  SET_AS_SCHEDULED = 29,
  // [DescriptionAnnotation("Set as New", "Set as New")]
  SET_AS_NEW = 30,
  // [DescriptionAnnotation("Unscheduled Order", "Unscheduled Order")]
  UNSCHEDULED_ORDER = 31,


  // #region Trip
  // Trip Module Start From 1000
  // [DescriptionAnnotation("Trip Details", "Trip Details")]
  Trip_TripDetails = 1000,
  // [DescriptionAnnotation("Start Trip", "Start Trip")]
  Trip_StartTrip = 1001,
  // [DescriptionAnnotation("Close Trip", "Close Trip")]
  Trip_CloseTrip = 1002,
  // [DescriptionAnnotation("Cancel Trip", "Cancel Trip")]
  Trip_CancelTrip = 1003,
  // [DescriptionAnnotation("Assign To DM", "Assign To DM")]
  Trip_AssignToDM = 1004,
  // [DescriptionAnnotation("Create Special Trip", "Create Special Trip")]
  Trip_CreateSpecialTrip = 1005,
  // [DescriptionAnnotation("Auto Deliver Trip", "Auto Deliver Trip")]
  Trip_AutoDeliverTrip = 1006,
  // [DescriptionAnnotation("Auto Update Orders Count And Amount", "Auto Update Orders Count And Amount")]
  Trip_AutoUpdateOrdersCountAndAmount = 1007,
  // [DescriptionAnnotation("Auto Update Archived Trip Orders Count And Amount", "Auto Update Archived Trip Orders Count And Amount")]
  Trip_AutoUpdateArchivedTripOrdersCountAndAmount = 1008,
  // [DescriptionAnnotation("Get", "Get")]
  Trip_Get = 1009,
  // [DescriptionAnnotation("Get Archived Trip", "Get Archived Trip")]
  Trip_GetArchivedTrip = 1010,
  // [DescriptionAnnotation("Get Status List", "Get Status List")]
  Trip_GetStatusList = 1011,
  // [DescriptionAnnotation("Get Trip Rate Option List", "Get Trip Rate Option List")]
  Trip_GetTripRateOptionList = 1012,
  // [DescriptionAnnotation("Get Trip Details", "Get Trip Details")]
  Trip_GetTripDetails = 1013,
  // [DescriptionAnnotation("Get Performance Detail By Date", "Get Performance Detail By Date")]
  Trip_GetPerformanceDetailByDate = 1014,
  // [DescriptionAnnotation("Get Performance Detail By Deliveryman", "Get Performance Detail By Deliveryman")]
  Trip_GetPerformanceDetailByDeliveryman = 1015,
  // [DescriptionAnnotation("Get Performance Detail By Bracnh", "Get Performance Detail By Bracnh")]
  Trip_GetPerformanceDetailByBracnh = 1016,
  // [DescriptionAnnotation("Get Trip Order", "Get Trip Order")]
  Trip_GetTripOrder = 1017,
  // [DescriptionAnnotation("Get Performance Detail", "Get Performance Detail")]
  Trip_GetPerformanceDetail = 1018,
  // [DescriptionAnnotation("Reset Trip", "Reset Trip")]
  Trip_ResetTrip = 1019,
  // [DescriptionAnnotation("Get Pendding Ready Trip", "Get Pendding Ready Trip")]
  Trip_GetPenddingReadyTrip = 1020,
  // [DescriptionAnnotation("Get Trips To Add Order", "Get Trips To Add Order")]
  Trip_GetTripsToAddOrder = 1021,
  // [DescriptionAnnotation("Delete", "Delete")]
  Trip_Delete = 1022,
  // [DescriptionAnnotation("Reset Pending Trips", "Reset Pending Trips")]
  Trip_ResetPendingTrips = 1023,
  // [DescriptionAnnotation("Edit Rate", "Edit Rate")]
  Trip_EditRate = 1024,
  // [DescriptionAnnotation("Get Trip Rate Edit Reasons", "Get Trip Rate Edit Reasons")]
  Trip_GetTripRateEditReasons = 1025,
  // [DescriptionAnnotation("Get Trip Performance Data", "Get Trip Performance Data")]
  Trip_GetTripPerformanceData = 1026,
  // [DescriptionAnnotation("Get DM Trips Column Chart", "Get DM Trips Column Chart")]
  Trip_GetDMTripsColumnChart = 1027,
  // [DescriptionAnnotation("Create Optimized Trip", "Create Optimized Trip")]
  Trip_CreateOptimizedTrip = 1028,
  // [DescriptionAnnotation("Get Deliveryman On Duty Line Chart", "Get Deliveryman On Duty Line Chart")]
  Trip_GetDeliverymanOnDutyLineChart = 1029,
  // [DescriptionAnnotation("Cancel Empty Ready Trip", "Cancel Empty Ready Trip")]
  Trip_CancelEmptyReadyTrip = 1030,
  // [DescriptionAnnotation("Get Special Trip Reason List", "Get Special Trip Reason List")]
  Trip_GetSpecialTripReasonList = 1031,
  // [DescriptionAnnotation("Get Running Trip", "Get Running Trip")]
  GetRunningTrip = 1032,
  // [DescriptionAnnotation("Get Running Trip Old", "Get Running Trip Old")]
  Trip_GetRunningTripOld = 1033,
  // [DescriptionAnnotation("Start With Location", "Start With Location")]
  Trip_StartWithLocation = 1034,
  // [DescriptionAnnotation("Reset Not Started Trip", "Reset Not Started Trip")]
  Trip_ResetNotStartedTrip = 1035,
  // [DescriptionAnnotation("Auto Start", "Auto Start")]
  Trip_AutoStart = 1036,
  // [DescriptionAnnotation("Get Best Route", "Get Best Route")]
  Trip_GetBestRoute = 1037,
  // [DescriptionAnnotation("Edit", "Edit")]
  Trip_Edit = 1038,
  // [DescriptionAnnotation("Pause", "Pause")]
  Trip_Pause = 1039,
  // [DescriptionAnnotation("Arrive", "Arrive")]
  Trip_Arrive = 1040,
  // [DescriptionAnnotation("Pickup", "Pickup")]
  Trip_Pickup = 1041,
  // [DescriptionAnnotation("Auto Edit Rate", "Auto Edit Rate")]
  Trip_AutoEditRate = 1042,
  // [DescriptionAnnotation("Get Performance Detail By Date Report", "Get Performance Detail By Date Report")]
  Trip_GetPerformanceDetailByDateReport = 1043,
  // [DescriptionAnnotation("Get Info", "Get Info")]
  Trip_GetInfo = 1044,
  // [DescriptionAnnotation("Get Performance Detail By Branch Report", "Get Performance Detail By Branch Report")]
  Trip_GetPerformanceDetailByBranchReport = 1045,
  // [DescriptionAnnotation("Get Report", "Get Report")]
  Trip_GetReport = 1046,
  // [DescriptionAnnotation("Get Performance Report", "Get Performance Report")]
  Trip_GetPerformanceReport = 1047,
  // [DescriptionAnnotation("Get Performance Detail By Dm By Ds Report", "Get Performance Detail By Dm By Ds Report")]
  Trip_GetPerformanceDetailByDmByDsReport = 1048,
  // [DescriptionAnnotation("Get Trip Tracking", "Get Trip Tracking")]
  Trip_GetTripTracking = 1049,
  // [DescriptionAnnotation("Change Activation Status", "Change Activation Status")]
  Trip_ChangeActivationStatus = 1050,
  // [DescriptionAnnotation("Change Display Order", "Change Display Order")]
  Trip_ChangeDisplayOrder = 1051,
  // [DescriptionAnnotation("Get Trips Line Chart", "Get Trips Line Chart")]
  Trip_GetTripsLineChart = 1052,
  // [DescriptionAnnotation("Get Trips Line Chart By Hour", "Get Trips Line Chart By Hour")]
  Trip_GetTripsLineChartByHour = 1053,
  // [DescriptionAnnotation("Get Trip Rate Pie Chart Data", "Get Trip Rate Pie Chart Data")]
  Trip_GetTripRatePieChartData = 1054,
  // [DescriptionAnnotation("Get Running Trips Old", "Get Running Trips Old")]
  Trip_GetRunningTripsOld = 1055,
  // [DescriptionAnnotation("Show Optimized Trip", "Show Optimized Trip")]
  Trip_ShowOptimizedTrip = 1056,
  // [DescriptionAnnotation("Get Running Trips Aync", "Get Running Trips Aync")]
  Trip_GetRunningTripsAync = 1057,
  // [DescriptionAnnotation("Get Running Trips By Area", "Get Running Trips By Area")]
  Trip_GetRunningTripsByArea = 1058,






  //     #endregion
  //   #region Task
  // Task Module Start From 2000
  // [DescriptionAnnotation("Remove From Trip", "Remove From Trip")]
  Task_RemoveFromTrip = 2000,
  // [DescriptionAnnotation("Add To Trip", "Add To Trip")]
  Task_AddToTrip = 2001,
  // [DescriptionAnnotation("Cancel Order", "Cancel Order")]
  Task_CancelOrder = 2002,
  // [DescriptionAnnotation("Pause Order", "Pause Order")]
  Task_PauseOrder = 2003,
  // [DescriptionAnnotation("Un Pause Order", "Un Pause Order")]
  Task_UnPauseOrder = 2004,
  // [DescriptionAnnotation("Set As Ready", "Set As Ready")]
  Task_SetAsReady = 2005,
  // [DescriptionAnnotation("Deliver Order", "Deliver Order")]
  Task_DeliverOrder = 2006,
  // [DescriptionAnnotation("Change Priority", "Change Priority")]
  Task_ChangePriority = 2007,
  // [DescriptionAnnotation("Update Order Info", "Update Order Info")]
  Task_UpdateOrderInfo = 2008,
  // [DescriptionAnnotation("Get Order Details", "Get Order Details")]
  Task_GetOrderDetails = 2009,
  // [DescriptionAnnotation("Set As In Progress", "Set As In Progress")]
  Task_SetAsInProgress = 2010,
  // [DescriptionAnnotation("Set As New", "Set As New")]
  Task_SetAsNew = 2011,
  // [DescriptionAnnotation("Get Order Invoice", "Get Order Invoice")]
  Task_GetOrderInvoice = 2012,
  // [DescriptionAnnotation("Get Orders Line Chart", "Get Orders Line Chart")]
  Task_GetOrdersLineChart = 2013,
  // [DescriptionAnnotation("Get Ticket Category Line Chart", "Get Ticket Category Line Chart")]
  Task_GetTicketCategoryLineChart = 2014,
  // [DescriptionAnnotation("Get Customer Orders Count Chart", "Get Customer Orders Count Chart")]
  Task_GetCustomerOrdersCountChart = 2015,
  // [DescriptionAnnotation("Get Avg Tickets", "Get Avg Tickets")]
  Task_GetAvgTickets = 2016,
  // [DescriptionAnnotation("Get Avg Purchase Frequancy Per Customer", "Get Avg Purchase Frequancy PerCustomer")]
  Task_GetAvgPurchaseFrequancyPerCustomer = 2017,
  // [DescriptionAnnotation("Get Avg Delivery Time", "Get Avg Delivery Time")]
  Task_GetAvgDeliveryTime = 2018,
  // [DescriptionAnnotation("Get Canceled Orders Count", "Get Canceled Orders Count")]
  Task_GetCanceledOrdersCount = 2019,
  // [DescriptionAnnotation("Get Order Status", "Get Order Status")]
  Task_GetOrderStatus = 2020,
  // [DescriptionAnnotation("Get Avg Branch Preparation", "Get Avg Branch Preparation")]
  Task_GetAvgBranchPreparation = 2021,
  // [DescriptionAnnotation("Get Avg User Preparation", "Get Avg User Preparation")]
  Task_GetAvgUserPreparation = 2022,
  // [DescriptionAnnotation("Get Pending Assign Request", "Get Pending Assign Request")]
  Task_GetPendingAssignRequest = 2023,
  // [DescriptionAnnotation("Synced Date", "Synced Date")]
  Task_SyncedDate = 2024,
  // [DescriptionAnnotation("Remove Synced Date", "Remove Synced Date")]
  Task_RemoveSyncedDate = 2025,
  // [DescriptionAnnotation("Update Delivery Service Count", "Update Delivery Service Count")]
  Task_UpdateDeliveryServiceCount = 2026,
  // [DescriptionAnnotation("Get Dispatcher Orders Async", "Get Dispatcher Orders Async")]
  Task_GetDispatcherOrdersAsync = 2027,
  // [DescriptionAnnotation("Get Orders", "Get Orders")]
  Task_GetOrders = 2028,
  // [DescriptionAnnotation("Get Archived Orders", "Get Archived Orders")]
  Task_GetArchivedOrders = 2029,
  // [DescriptionAnnotation("Get Order Status List", "Get Order Status List")]
  Task_GetOrderStatusList = 2030,
  // [DescriptionAnnotation("Get Orders Performance List", "Get Orders Performance List")]
  Task_GetOrderPerformanceList = 2031,
  // [DescriptionAnnotation("Get Order Performance Details By Date", "Get Order Performance Details By Date")]
  Task_GetOrderPerformanceDetailsByDate = 2032,
  // [DescriptionAnnotation("Get Order Performance Details By Branch", "Get Order Performance Details By Branch")]
  Task_GetOrdersPerformanceDetailsByBranch = 2033,
  // [DescriptionAnnotation("Get Orders Performance Details By Deliveryman", "Get Orders Performance Details By Agent")]
  Task_GetOrderPerformanceDetailsByDeliveryman = 2034,
  // [DescriptionAnnotation("Remove Order From Trip Async", "Remove Order From Trip Async")]
  Task_RemoveOrderFromTripAsync = 2035,
  // [DescriptionAnnotation("Reset Pending Created Orders", "Reset Pending Created Orders")]
  Task_ResetPendingCreatedOrders = 2036,
  // [DescriptionAnnotation("Delete Order", "Delete Order")]
  Task_DeleteOrder = 2037,
  // [DescriptionAnnotation("Get Order Performance Data", "Get Order Performance Data")]
  Task_GetOrderPerformanceData = 2038,
  // [DescriptionAnnotation("Get Deliveryman Orders Line Chart", "Get Deliveryman Orders Line Chart")]
  Task_GetDeliverymanOrdersLineChart = 2039,
  // [DescriptionAnnotation("Auto Expire Pendding Order", "Auto Expire Pendding Order")]
  Task_AutoExpirePenddingOrder = 2040,
  // [DescriptionAnnotation("Get Can Not Deliver Order", "Get Can Not Deliver Order")]
  Task_GetCanNotDeliverOrder = 2041,
  // [DescriptionAnnotation("Create Fast Fast Order", "Create Fast Fast Order")]
  Task_CreateFastFastOrder = 2042,
  // [DescriptionAnnotation("Change Order Location", "Change Order Location")]
  Task_ChangeOrderLocation = 2043,
  // [DescriptionAnnotation("Deliver Order With Location", "Deliver Order With Location")]
  Task_DeliverOrderWithLocation = 2044,
  // [DescriptionAnnotation("Deliver Order Async", "Deliver Order Async")]
  Task_DeliverOrderAsync = 2045,
  // [DescriptionAnnotation("Get By Code", "Get By Code")]
  Task_GetByCode = 2046,
  // [DescriptionAnnotation("Get Order Delivery Status", "Get Order Delivery Status")]
  Task_GetOrderDeliveryStatus = 2047,
  // [DescriptionAnnotation("Get Recent", "Get Recent")]
  Task_GetRecent = 2048,
  // [DescriptionAnnotation("Edit", "Edit")]
  Task_Edit = 2049,
  // [DescriptionAnnotation("Get Orders By Trip ID", "Get Orders By Trip ID")]
  Task_GetOrdersByTripID = 2050,
  // [DescriptionAnnotation("Get Can Not Deliver Reson List", "Get Can Not Deliver Reson List")]
  Task_GetCanNotDeliverResonList = 2051,
  // [DescriptionAnnotation("Get Summary Fees", "Get Summary Fees")]
  Task_GetSummaryFees = 2052,
  // [DescriptionAnnotation("Get Income", "Get Income")]
  Task_GetIncome = 2053,
  // [DescriptionAnnotation("Get Daily Income Summary", "Get Daily Income Summary")]
  Task_GetDailyIncomeSummary = 2054,
  // [DescriptionAnnotation("Get Daily Income Details", "Get Daily Income Details")]
  Task_GetDailyIncomeDetails = 2055,
  // [DescriptionAnnotation("Get", "Get")]
  Task_Get = 2056,
  // [DescriptionAnnotation("Get Status List", "Get Status List")]
  Task_GetStatusList = 2057,
  // [DescriptionAnnotation("Get Performance List", "Get Performance List")]
  Task_GetPerformanceList = 2058,
  // [DescriptionAnnotation("Create Fast Order", "Create Fast Order")]
  Task_CreateFastOrder = 2059,
  // [DescriptionAnnotation("Get Live Orders", "Get Live Orders")]
  Task_GetLiveOrders = 2060,
  // [DescriptionAnnotation("Get Archive Orders", "Get Archive Orders")]
  Task_GetArchiveOrders = 2061,
  // [DescriptionAnnotation("Get Report By Date", "Get Report By Date")]
  Task_GetReportByDate = 2062,
  // [DescriptionAnnotation("Get Report By Branch", "Get Report By Branch")]
  Task_GetReportByBranch = 2063,
  // [DescriptionAnnotation("Get Performance Details By Date", "Get Performance Details By Date")]
  Task_GetPerformanceDetailsByDate = 2064,
  // [DescriptionAnnotation("Get Performance Details By Branch", "Get Performance Details By Branch")]
  Task_GetPerformanceDetailsByBranch = 2065,
  // [DescriptionAnnotation("Get Performance Details By Deliveryman", "Get Performance Details By Deliveryman")]
  Task_GetPerformanceDetailsByDeliveryman = 2066,
  // [DescriptionAnnotation("Get Alternative Orders", "Get Alternative Orders")]
  Task_GetAlternativeOrders = 2067,
  // [DescriptionAnnotation("Upload Excel", "Upload Excel")]
  Task_UploadExcel = 2068,
  // [DescriptionAnnotation("Cancel Orders From Excel File", "Cancel Orders From Excel File")]
  Task_CancelOrdersFromExcelFile = 2069,
  // [DescriptionAnnotation("Add Orders From Excel File", "Add Orders From Excel File")]
  Task_AddOrdersFromExcelFile = 2070,
  // [DescriptionAnnotation("Add Orders From Temp Table", "Add Orders From Temp Table")]
  Task_AddOrdersFromTempTable = 2071,
  // [DescriptionAnnotation("Get List", "Get List")]
  Task_GetList = 2072,
  // [DescriptionAnnotation("Get Editable By ID", "Get Editable By ID")]
  Task_GetEditableByID = 2073,
  // [DescriptionAnnotation("Change Status To Ready", "Change Status To Ready")]
  Task_ChangeStatusToReady = 2074,
  // [DescriptionAnnotation("Get By ID", "Get By ID")]
  Task_GetByID = 2075,
  // [DescriptionAnnotation("POST Async", "POST Async")]
  Task_POSTAsync = 2076,
  // [DescriptionAnnotation("Change Order To Ready", "Change Order To Ready")]
  Task_ChangeOrderToReady = 2077,
  // [DescriptionAnnotation("Change Activation Status", "Change Activation Status")]
  Task_ChangeActivationStatus = 2078,
  // [DescriptionAnnotation("Change Display Order", "Change Display Order")]
  Task_ChangeDisplayOrder = 2079,
  // [DescriptionAnnotation("Get Excellent Orders", "Get Excellent Orders")]
  Task_GetExcellentOrders = 2080,
  // [DescriptionAnnotation("Get Order Avg Delivery Time By Branch", "Get Order Avg Delivery Time By Branch")]
  Task_GetOrderAvgDeliveryTimeByBranch = 2081,
  // [DescriptionAnnotation("Get Pendding Orders", "Get Pendding Orders")]
  Task_GetPenddingOrders = 2082,
  // [DescriptionAnnotation("Get Orders Kpis", "Get Orders Kpis")]
  Task_GetOrdersKpis = 2083,
  // [DescriptionAnnotation("Get Recent Orders", "Get Recent Orders")]
  Task_GetRecentOrders = 2084,
  // [DescriptionAnnotation("Get Order Status Pie Chart Data", "Get Order Status Pie Chart Data")]
  Task_GetOrderStatusPieChartData = 2085,
  // [DescriptionAnnotation("Get Ready Orders", "Get Ready Orders")]
  Task_GetReadyOrders = 2086,
  // [DescriptionAnnotation("Get Orders Line Chart By Hour", "Get Orders Line Chart By Hour")]
  Task_GetOrdersLineChartByHour = 2087,
  // [DescriptionAnnotation("Get Average Delivery Time", "Get Average Delivery Time")]
  Task_GetAverageDeliveryTime = 2088,
  // [DescriptionAnnotation("Get Order Avg Delivery Time", "Get Order Avg Delivery Time")]
  Task_GetOrderAvgDeliveryTime = 2089,
  // [DescriptionAnnotation("Get Order Avg Delivery Time By Hour", "Get Order Avg Delivery Time By Hour")]
  Task_GetOrderAvgDeliveryTimeByHour = 2090,
  // [DescriptionAnnotation("Get Order Avg Delivery Time For Eqbal", "Get Order Avg Delivery Time For Eqbal")]
  Task_GetOrderAvgDeliveryTimeForEqbal = 2091,
  // [DescriptionAnnotation("Get Order Avg Delivery Time By Branch Report", "Get Order Avg Delivery Time By Branch Report")]
  Task_GetOrderAvgDeliveryTimeByBranchReport = 2092,
  // [DescriptionAnnotation("Get Order Avg Delivery Time By Week", "Get Order Avg Delivery Time By Week")]
  Task_GetOrderAvgDeliveryTimeByWeek = 2093,
  // [DescriptionAnnotation("Change Order Branch", "Change Order Branch")]
  Task_ChangeOrderBranch = 2094,
  // [DescriptionAnnotation("Get Dispatcher Orders Old", "Get Dispatcher Orders Old")]
  Task_GetDispatcherOrdersOld = 2095,
  // [DescriptionAnnotation("Change Order Status", "Change Order Status")]
  Task_ChangeOrderStatus = 2096,
  // [DescriptionAnnotation("Add Order To Trip", "Add Order To Trip")]
  Task_AddOrderToTrip = 2097,
  // [DescriptionAnnotation("Get Orders To Special Trip", "Get Orders To Special Trip")]
  Task_GetOrdersToSpecialTrip = 2098,
  // [DescriptionAnnotation("Get Order Services", "Get Order Services")]
  Task_GetOrderServices = 2099,
  // [DescriptionAnnotation("Get Fast Order Reason List", "Get Fast Order Reason List")]
  Task_GetFastOrderReasonList = 2100,
  // [DescriptionAnnotation("Get Dispatcher Orders By Area", "Get Dispatcher Orders By Area")]
  Task_GetDispatcherOrdersByArea = 2101,
  Task_ChangeTrip = 2102,
  Task_ScheduleOrder = 2103,

  Task_NewStatus = 2112,
  Task_TransferStatus = 2113,
  Task_InprogressStatus = 2114,

  Task_CancelOTP=2115,

  //     #endregion
  //   #region Agent




  // Agent Module Start From 3000

  // [DescriptionAnnotation("Add To Queue", "Add To Queue")]
  Agent_AddToQueueAsync = 3000,
  // [DescriptionAnnotation("End Shift", "End Shift")]
  Agent_EndShift = 3001,
  // [DescriptionAnnotation("Archive", "Archive")]
  Agent_Archive = 3002,
  // [DescriptionAnnotation("UnArchive", "UnArchive")]
  Agent_UnArchive = 3003,
  // [DescriptionAnnotation("Change Branch", "Change Branch")]
  Agent_ChangeBranch = 3004,
  // [DescriptionAnnotation("Log Out From All Devices", "Log Out From All Devices")]
  Agent_LogOutFromAllDevices = 3005,
  // [DescriptionAnnotation("Force Logout Deliverymen With UnUpdated Version", "Force Logout Deliverymen With UnUpdated Version")]
  Agent_ForceLogoutDeliverymenWithUnUpdatedVersion = 3006,
  // [DescriptionAnnotation("Close Off Duty Shift", "Close Off Duty Shift")]
  Agent_CloseOffDutyShift = 3007,
  // [DescriptionAnnotation("Is Allowed", "Is Allowed")]
  Agent_IsAllowed = 3008,

  //AgentBranch Controller

  // [DescriptionAnnotation("Deliveryman Branch Get", "Deliveryman Branch Get")]
  Agent_DeliverymanBranchGet = 3009,
  // [DescriptionAnnotation("Deliveryman Branch Put", "Deliveryman Branch Put")]
  Agent_DeliverymanBranchPUT = 3010,
  // [DescriptionAnnotation("Deliveryman Branch Update", "Deliveryman Branch Update")]
  Agent_DeliverymanBranchUpdate = 3011,

  //AgentBreak Controller
  // [DescriptionAnnotation("Deliveryman Break Start", "Deliveryman Break Start")]
  Agent_DeliverymanBreakStart = 3012,
  // [DescriptionAnnotation("Deliveryman Break Close", "Deliveryman Break Close")]
  Agent_DeliverymanBreakClose = 3013,
  // [DescriptionAnnotation("Deliveryman Break GetReport", "Deliveryman Break GetReport")]
  Agent_DeliverymanBreakGetReport = 3014,

  //AgnetPenalize Controller
  // [DescriptionAnnotation("Deliveryman Penalize Remove", "Deliveryman Penalize Remove")]
  Agent_DeliverymanPenalizeRemove = 3015,
  // [DescriptionAnnotation("Deliveryman Penalize GetReport", "Deliveryman Penalize GetReport")]
  Agent_DeliverymanPenalizeGetReport = 3016,
  //-------//

  // [DescriptionAnnotation("Get TOP DM", "GetTOP DM")]
  Agent_GetTOPDM = 3017,
  // [DescriptionAnnotation("Get TOP DM By Point", "Get TOP DM By Point")]
  Agent_GetTOPDMByPoint = 3018,
  // [DescriptionAnnotation("Get Deliveryman Shift Pie Chart Data", "Get Deliveryman Shift Pie Chart Data")]
  Agent_GetDeliverymanShiftPieChartData = 3019,
  // [DescriptionAnnotation("Get Deliveryman Shift Line Chart Data", "Get Deliveryman Shift Line Chart Data")]
  Agent_GetDeliverymanShiftLineChartData = 3020,
  // [DescriptionAnnotation("Get Deliveryman Shift By Hour Line Chart Data", "Get Deliveryman Shift By Hour Line Chart Data")]
  Agent_GetDeliverymanShiftByHourLineChartData = 3021,
  // [DescriptionAnnotation("Get Deliveryman On Shift By Hour", "Get Deliveryman On Shift By Hour")]
  Agent_GetDeliverymanOnShiftByHour = 3022,
  // [DescriptionAnnotation("Get TOP DM By Total Point", "Get TOP DM By Total Point")]
  Agent_GetTOPDMByTotalPoint = 3023,
  // [DescriptionAnnotation("get Deliverymen", "get Deliverymen")]
  Agent_GetDeliverymen = 3024,
  // [DescriptionAnnotation("Get Available Deliverymen", "Get Available Deliverymen")]
  Agent_GetAvailableDeliverymen = 3025,
  // [DescriptionAnnotation("Get Available DM", "Get Available DM")]
  Agent_GetAvailableDM = 3026,
  // [DescriptionAnnotation("Get Dispatcher Deliverymen", "Get Dispatcher Deliverymen")]
  Agent_GetDispatcherDeliverymen = 3027,
  Agent_DeliverymanShiftGetReport = 3028,
  Agent_StartShift = 3029,
  Agent_GetMonthlyWalletTransactionReport=3030,
  Agent_SettlementRequestPost=3031,
  Agent_WalletTransactionPost=3032,
  Agent_WalletTransactionDelete=3033,
  Agent_WalletTransactionGet=3034,
  Agent_Post=3037,





  //  #endregion
  // #region    Branch
  // Branch Module Start From 4000
  // [DescriptionAnnotation("Get", "Get")]
  Store_Branch_Get = 4000,
  // [DescriptionAnnotation("Get Branch Orders And DeliveryMen", "Get Branch Orders And DeliveryMen")]
  Store_Branch_GetBranchOrdersAndDeliveryMen = 4001,
  // [DescriptionAnnotation("Get By ID", "Get By ID")]
  Store_Branch_GetByID = 4002,
  // [DescriptionAnnotation("Get Branches List", "Get Branches List")]
  Store_Branch_GetBranchesList = 4003,
  // [DescriptionAnnotation("Get Area List", "Get Area List")]
  Store_Branch_GetAreaList = 4004,
  // [DescriptionAnnotation("Get All Cmpany Branches", "Get All Cmpany Branches")]
  Store_Branch_GetAllCmpanyBranches = 4005,
  // [DescriptionAnnotation("Get Branch Performance", "Get Branch Performance")]
  Store_Branch_GetBranchPerformance = 4006,
  // [DescriptionAnnotation("Get Performance Report", "Get Performance Report")]
  Store_Branch_GetPerformanceReport = 4007,
  // [DescriptionAnnotation("Post", "Post")]
  Store_Branch_Post = 4008,
  // [DescriptionAnnotation("Delete", "Delete")]
  Store_Branch_Delete = 4009,
  // [DescriptionAnnotation("Get Branches List By Area ID", "Get Branches List By Area ID")]
  Store_Branch_GetBranchesListByAreaID = 4010,
  // [DescriptionAnnotation("Get Branches Location", "Get Branches Location")]
  Store_GetBranchesLocation = 4011,
  // [DescriptionAnnotation("Get API Key", "Get API Key")]
  Store_GetAPIKey = 4012,
  // [DescriptionAnnotation("Show Recommended List", "Show Recommended List")]
  Store_ShowRecommendedList = 4013,
  // [DescriptionAnnotation("Get Dispatcher Branches List", "Get Dispatcher Branches List")]
  Store_GetDispatcherBranchesList = 4014,
  Store_UpdateQrCode = 4015,
  Store_CopyStore = 4016,
  Store_UpdateStore = 4017,












  //  #endregion

  // #region User
  // User Module Start From 5000
  // [DescriptionAnnotation("Change Activation Status", "Change Activation Status")]
  User_ChangeActivationStatus = 5000,
  // [DescriptionAnnotation("Get Logged User Details", "Get Logged User Details")]
  User_GetLoggedUserDetails = 5001,
  // [DescriptionAnnotation("Sign Out", "Sign Out")]
  User_SignOut = 5002,
  // [DescriptionAnnotation("Get User Role", "Get User Role")]
  User_GetUserRole = 5003,
  // [DescriptionAnnotation("Change Logged User Password", "Change Logged User Password")]
  User_ChangeLoggedUserPassword = 5004,
  // [DescriptionAnnotation("Change Profile Picture", "Change Profile Picture")]
  User_ChangeProfilePicture = 5005,
  // [DescriptionAnnotation("Get Main Info", "Get Main Info")]
  User_GetMainInfo = 5006,
  // [DescriptionAnnotation("Update Main Info", "Update Main Info")]
  User_UpdateMainInfo = 5007,
  // [DescriptionAnnotation("Upload Picture", "Upload Picture")]
  User_UploadPicture = 5008,
  // [DescriptionAnnotation("Update Profile Picture", "Update Profile Picture")]
  User_UpdateProfilePicture = 5009,
  // [DescriptionAnnotation("Change Password", "Change Password")]
  User_ChangePassword = 5010,
  // [DescriptionAnnotation("Get Hashed Password", "Get Hashed Password")]
  User_GetHashedPassword = 5011,
  // [DescriptionAnnotation("Add", "Add")]
  User_Add = 5012,
  // [DescriptionAnnotation("Get Loged User Company ID", "Get Loged User Company ID")]
  User_GetLogedUserCompanyID = 5013,
  // [DescriptionAnnotation("Get", "Get")]
  User_Get = 5014,
  // [DescriptionAnnotation("Get Main Info", "Get Main Info")]
  User_AdGetMainInfo = 5015,
  // [DescriptionAnnotation("Get Manager Profile", "Get Manager Profile")]
  User_GetManagerProfile = 5016,
  // [DescriptionAnnotation("Get Supervisor Profile", "Get Supervisor Profile")]
  User_GetSupervisorProfile = 5017,
  // [DescriptionAnnotation("Add User As Owner", "Add User As Owner")]
  User_AddUserAsOwner = 5018,
  // [DescriptionAnnotation("Add User As Marketing", "Add User As Marketing")]
  User_AddUserAsMarketing = 5019,
  // [DescriptionAnnotation("Add User As Supervisor", "Add User As Supervisor")]
  User_AddUserAsSupervisor = 5020,
  // [DescriptionAnnotation("AddU ser As Area Manager", "Add User As Area Manager")]
  User_AddUserAsAreaManager = 5021,
  // [DescriptionAnnotation("Add User As Dispatcher", "Add User As Dispatcher")]
  User_AddUserAsDispatcher = 5022,
  // [DescriptionAnnotation("Add User As Branch Manager", "Add User As Branch Manager")]
  User_AddUserAsBranchManager = 5023,
  // [DescriptionAnnotation("Add User As Operator", "Add User As Operator")]
  User_AddUserAsOperator = 5024,
  // [DescriptionAnnotation("Remove Role", "Remove Role")]
  User_RemoveRole = 5025,
  // [DescriptionAnnotation("Get User Roles List", "Get User Roles List")]
  User_GetUserRolesList = 5026,
  // [DescriptionAnnotation("Get Area Manager Branches", "Get Area Manager Branches")]
  User_GetAreaManagerBranches = 5027,
  // [DescriptionAnnotation("Get Dispatcher Branches", "Get Dispatcher Branches")]
  User_GetDispatcherBranches = 5028,
  User_UpdateRole = 5029,
  User_UpdateSore = 5030,
  User_ForceLogout=5031,
  User_SwitchAllowMultipleDevices=5032,



  // #endregion


  //ITEM
  // [DescriptionAnnotation("Get", "Get")]
  Item_Get = 8000,
  // [DescriptionAnnotation("Set As Service Item", "Set As Service Item")]
  Item_SetAsServiceItem = 8001,
  // [DescriptionAnnotation("Set As Not Service Item", "Set As Not Service Item")]
  Item_SetAsNotServiceItem = 8002,
  // [DescriptionAnnotation("Put", "Put")]
  Item_Put = 8003,
  // [DescriptionAnnotation("Get Services Items", "Get Services Items")]
  Item_GetServicesItems = 8004,
  // [DescriptionAnnotation("Get Services Icon", "Get Services Icon")]
  Item_GetServicesIcon = 8005,
  // [DescriptionAnnotation("Get Services List", "Get Services List")]
  Item_GetServicesList = 8006,
  // [DescriptionAnnotation("Delete", "Delete")]
  Item_Delete = 8007,
  // [DescriptionAnnotation("Update Priority", "Update Priority")]
  Item_UpdatePriority = 8008,
  // [DescriptionAnnotation("Get Top Items", "Get Top Items")]
  Item_GetTopItems = 8009,
  // [DescriptionAnnotation("Get Item Summary", "Get Item Summary")]
  Item_GetItemSummary = 7022,


  //Company
  // [DescriptionAnnotation("Get", "Get")]
  Company_Get = 9000,
  // [DescriptionAnnotation("Get Company List", "Get Company List")]
  Company_GetCompanyList = 9001,
  // [DescriptionAnnotation("Get By ID", "Get By ID")]
  Company_GetByID = 9002,
  // [DescriptionAnnotation("Post", "Post")]
  Company_Post = 9003,
  // [DescriptionAnnotation("Delete", "Delete")]
  Company_Delete = 9004,
  // [DescriptionAnnotation("Can Show Transite", "Can Show Transite")]
  Company_CanShowTransite = 9005,
  // [DescriptionAnnotation("Get Company Main Info", "Get Company Main Info")]
  Company_GetCompanyMainInfoByCustomer = 9006,
  // [DescriptionAnnotation("Can Change Order Branch", "Can Change Order Branch")]
  Company_CanChangeOrderBranch = 9007,
  // [DescriptionAnnotation("Is Comapny Auto Ready Order", "Is Comapny Auto Ready Order")]
  Company_IsComapnyAutoReadyOrder = 9008,












  // #region Customer

  // Customer Module Start From 10000
  // [DescriptionAnnotation("Get", "Get")]
  Customer_GetCustomers = 10001,
  // [DescriptionAnnotation("Get Details", "Get Details")]
  Customer_GetDetails = 10002,
  // [DescriptionAnnotation("Get Customer Order", "Get Customer Order")]
  Customer_GetCustomerOrder = 10003,
  // [DescriptionAnnotation("Get Customer By Mobile", "Get Customer By Mobile")]
  Customer_GetCustomerByMobile = 10004,
  // [DescriptionAnnotation("Get Customer Main Info", "Get Customer Main Info")]
  Customer_GetCustomerMainInfo = 10005,
  // [DescriptionAnnotation("Get Customer Orders By Day", "Get Customer Orders By Day")]
  Customer_GetCustomerOrdersByDay = 10006,
  // [DescriptionAnnotation("Get Customer Orders By Month", "Get Customer Orders By Month")]
  Customer_GetCustomerOrdersByMonth = 10007,
  // [DescriptionAnnotation("Get Customer Orders Pie Chart", "Get Customer Orders Pie Chart")]
  Customer_GetCustomerOrdersPieChart = 10008,
  // [DescriptionAnnotation("GetCustomerProfileKPI", "GetCustomerProfileKPI")]
  Customer_GetCustomerProfileKPI = 10009,
  // [DescriptionAnnotation("Get Customer And Closest Branches Locations", "Get Customer And Closest Branches Locations")]
  Customer_GetCustomerAndClosestBranchesLocations = 10010,
  // [DescriptionAnnotation("Get Customer Orders", "Get Customer Orders")]
  Customer_GetCustomerOrders = 10011,
  // [DescriptionAnnotation("Get Review", "Get Review")]
  Customer_GetReview = 10012,



  // [DescriptionAnnotation("Get Shipping Addres", "Get Shipping Addres")]
  Customer_GetShippingAddres = 10014,

  // [DescriptionAnnotation("Verify Shipping Address Location", "Verify Shipping Address Location")]
  VerifyShippingAddressLocation = 10017,
  // [DescriptionAnnotation("Add Shipping Address Location", "Add Shipping Address Location")]
  AddShippingAddressLocation = 10018,
  // [DescriptionAnnotation("Get Shipping Address List", "Get Shipping Address List")]
  GetShippingAddressList = 10019,
  // [DescriptionAnnotation("Delete Shipping Address", "Delete Shipping Address")]
  DeleteShippingAddress = 10020,

  // [DescriptionAnnotation("Get By ID", "Get By ID")]
  GetByID = 10022,
  // [DescriptionAnnotation("POST", "POST")]
  POST = 10023,
  // [DescriptionAnnotation("Put", "Put")]
  Put = 10024,
  // [DescriptionAnnotation("Change Activation Status", "Chang eActivation Status")]
  ChangeCustomerActivationStatus = 10025,

  // [DescriptionAnnotation("Delete", "Delete")]
  Delete = 10027,
  // [DescriptionAnnotation("Get New Customers", "Get New Customers")]
  GetNewCustomers = 10028,
  // [DescriptionAnnotation("Get TOP Customer", "Get TOP Customer")]
  GetTOPCustomer = 10029,
  Customer_UpdatePriority = 10030,
  Customer_IsTransite = 10031,

  // [DescriptionAnnotation("Get Heatmap Data", "Get Heatmap Data")]
  GetHeatmapData = 6024,



}