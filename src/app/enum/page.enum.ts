export enum PageEnum {
  //#region Pages live Operation
  Live_Operation = 100,
  Live_Operation_Dashboard = 101,
  Live_Operation_Marketing = 102,
  //#endregion Pages live Operation
  //#region Pages Trips
  Trips = 200,
  Trips_Recent = 201,
  Trips_History = 202,
  Trips_Ignored_Expired_Requests = 204,
  Trips_Validation_Requests = 205,
  Trips_Uncompleted_Cancelled = 206,
  Trips_By_Deliveryman_Service = 210,
  //#endregion Pages Trips
  //#region Pages Tasks
  Tasks = 300,
  Tasks_Recent = 301,
  Tasks_History = 302,
  Tasks_Uncompleted_Cancelled = 303,
  Tasks_Scheduled = 304,
  Tasks_Transfers = 305,

  //#endregion Pages Tasks
  //#region Pages agents
  Agent_Delivery = 400,
  Agent_profiles = 401,
  Agent_Requests = 402,
  Agent_Shifts = 403,
  Agent_Shifts_Working_Hours = 404,
  Agent_Shifts_Availability = 405,
  Agent_Shifts_Penalized = 406,
  Agent_Shifts_Break = 407,
  Agent_Schedule = 408,
  Agent_Skills = 409,
  Agent_Vehicles = 410,
  Agent_Trip_Request = 412,
  //#endregion Pages agents
  //#region Pages Stores
  Stores = 500,
  Stores_Home = 501,
  Stores_Hubs_Areas = 502,
  Stores_Monitoring_Tracking = 503,
  Stores_Dedicated = 504,

  Stores_Delivery_Time = 507,
  //#endregion Pages Stores
  //#region Pages Customers
  Customers = 600,
  Customers_Home = 601,
  Customers_Shipping_addresses = 602,
  Customers_Reviews = 603,
  Customers_Call_Center = 604,
  //#endregion Pages Customers
  //#region Pages Accounts
  Accounts = 700,
  Accounts_Wallet = 701,
  Accounts_Collection_Module = 702,
  Accounts_Delivery_Bundles = 703,
  Accounting_Wallet_Store = 704,
  Accounting_Wallet_Agent = 705,
  Accounting_Wallet_Transaction = 706,
  Accounting_Wallet_Validation = 707,
  //#endregion Pages Accounts
  //#region Pages Billing & Invoices
  Billing_Invoices = 800,
  Billing_Invoices_Billing = 801,
  Billing_Invoices_Invoices = 802,
  //#endregion Pages Billing & Invoices
  //#region Pages Ranking
  Ranking_Board = 900,
  Ranking_Board_Delivery_Agents = 901,
  Ranking_Board_Stores = 902,
  Ranking_Board_Preparing_Agents = 903,
  //#endregion Pages Ranking
  //#region Pages Analytics
  Analytics = 1000,
  Analytics_Trip = 1001,
  Analytics_Trips_By_Date = 207, //1002
  Analytics_Trips_By_Stores = 208,//1003
  Analytics_Trips_By_Deliveryman = 209,//1003
  Analytics_Taks = 1004,
  Analytics_Tasks_By_Date=306, //1005
  Analytics_Tasks_By_Branch=307,//1006
  Analytics_Tasks_By_Deliveryman = 308, //10077
  Analytics_Tasks_By_Preparation_Time = 1008, 

  Analytics_Tasks_By_Preparation_Time_store=309,//1009
  Analytics_Tasks_By_Preparation_Time_user = 310,//1010
  Analytics_Performance = 1011,
  Analytics_Performance_Area = 508,//1012
  Analytics_Performance_Store = 505,//1013
  Analytics_Performance_Behavior = 506,//1014


  
  //#endregion Pages Analytics
  //#region Pages Configuration
  Configuration = 1200,
  Configuration_Items = 1201,
  Configuration_Skills = 1202,
  Configuration_Create = 1203,
  Configuration_Order = 1204,
  Configuration_Trip = 1205,
  Configuration_Revenue = 1206,
  Configuration_Address = 1207,
  //#endregion Pages configuration
  //#region Pages Dispatch
  Dispatch = 1300,
  //#endregion Pages Dispatch
  //#region Pages Live Tracking
  Live_Tracking = 1400,
  //#endregion Pages Live Tracking
  //#region Pages System
  System = 1500,
  System_Page = 1501,
  System_Page_Home = 1507,
  System_Page_Role = 1502,
  System_Page_Company = 1506,
  System_Feature = 1503,
  System_Feature_Module = 1508,
  System_Feature_Role = 1504,
  System_Feature_Company = 1505,
  //#endregion Pages System
  //#region Pages Broadcast  
  Broadcast = 1600,
  Broadcast_Home = 1601,

  //#endregion Pages Broadcast
  //#region Pages Heatmap
  Heatmap = 1700,
  //#endregion Pages Heatmap
  //#region Pages users
  Users = 1800,
  Users_Home = 1801,
  //#endregion Pages users
}
