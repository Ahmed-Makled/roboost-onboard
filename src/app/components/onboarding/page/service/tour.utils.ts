import { FilterTourStepEnum } from 'src/app/components/shared/layout/layout.component';
import { GuidedTour, Orientation } from 'src/app/lib/guided-tour.constants';
import { SharedService } from 'src/app/service/shared.service';
import { DispatchTripViewModel } from '../view-models/dispatch.model';



export class GuidedTourData {
  tripActionsTemplate
  modalRef: any;
  currentIndexTour: FilterTourStepEnum;
  selectedTrip: any;
  constructor(
    public _sharedService: SharedService,

  ) { }

  /*************************** dispatch General Tour Data ***********************/
  public dispatchGeneralTour: GuidedTour = {
    tourId: 'dispatch-general-tour',
    useOrb: false,
    preventBackdropFromAdvancing: true,
    skipCallback: (stepSkippedOn: number) => {
      this.modalRef?.hide()


    },
    completeCallback: () => { this.showCompleteTourTemplate() },
    steps: [
      {
        title: "Welcome to Roboost!",
        titleClass: 'c-b500',
        selector: '#WelcomeStep',
        content: "This is our dispatching page, where you can monitor and manage all your running live operations such as your deliverymen's status as well as the current ongoing trips, in addition to the all tasks uploaded on the system😊",
        orientation: Orientation.Right,
        action: () => {

          scrollToView('TaskNumberStep')
        },
        highlightPadding: 3,
      },
      {
        title: "Task Number",
        selector: '#TaskNumberStep',
        content: "<div class='mb-3'>One of our first features you can find is 'Task Number'.</div> From here, you can search for any details regarding the tasks, agents, and trips, while grouping and sorting the results as you may like.",
        orientation: Orientation.Bottom,

        action: () => {
        },
        highlightPadding: 0,
      },
      {
        title: "Stores, Hubs & Areas",
        selector: '#FilterBYStep',
        content: "<div class='mb-3'>Using this you can view your data according to <span class='c-g900 bold'>store, hub, or area</span>; thus, making things much easier to navigate through 👌</div> In addition, if there is an <span class='c-r500'>issue</span> with any store, hub or area you will be able to see it and locate the source of the problem!",
        orientation: Orientation.Bottom,

        action: () => {
          // scrollToView('searchStep')
        },
        highlightPadding: 0,
      },
      {
        title: "KPI's & Statistics",
        selector: '#KpiStep',
        content: "Here is where you can find a summary of the KPI's and statistics of your operations in a quick, efficient manner!",
        orientation: Orientation.Bottom,

        action: () => {
          // scrollToView('searchStep')
        },
        highlightPadding: 8,
      },
      {
        title: "Delivery Agents",
        selector: '#accordionAgentCard',
        content: "<div class='mb-3'>You can swiftly view all the delivery agents on shift while sectioning them according to their hub.</div> <div class='mb-3'>In addition, you can see whether the delivery agent is <span class='c-lb500' >on-duty</span>, <span class='c-gr600'>available</span>, on <span class='c-y600'>break</span>, or <span class='c-g700'>penalized</span>.</div> Note: A hub is a meeting point of delivery agents which you can create the configuration for from here 🛠",
        orientation: Orientation.Bottom,

        action: () => {
          scrollToView('TaskNumberStep')
        },
        highlightPadding: 8,
        overlayRadius: 6

      },
      {
        title: "On Going Trips",
        selector: '#accordionTripCard',
        content: "From 'On-going Trips', you can see all the running trips in real-time.",
        orientation: Orientation.TopLeft,

        action: () => {
          scrollToView('accordionAgentCard')
        },
        highlightPadding: 8,
        overlayRadius: 6
      },
      {
        title: "All Tasks",
        selector: '#AllTaskStep',
        content: "Lastly, this is where you can find all the undispatched tasks! 🧱",
        orientation: Orientation.TopLeft,

        action: () => {
          scrollToView('OrderTimerStep')
        },
        highlightPadding: 8,
        overlayRadius: 6
      },

    ],
  };

  /*************************** dispatch Trip Info Tour Data ***********************/

  public dispatchTripInfoTour: GuidedTour = {
    tourId: 'dispatch-trip-info-tour',
    useOrb: false,
    preventBackdropFromAdvancing: true,
    skipCallback: (stepSkippedOn: number) => {
      document.querySelectorAll('#TripInfoStep_hubName , #TripInfoStep_status, #TripInfoStep_timer, #TripInfoStep_waitTime, #OrderTimerStep , #FastActionStep').forEach(el => {
        if (el.classList.contains("bc-b500")) {
          el.classList.remove("b-2", "bc-b500", "radius-6")
        }
      })
      this.modalRef?.hide()
    },
    completeCallback: () => {
      document.querySelectorAll('#TripInfoStep_hubName , #TripInfoStep_status, #TripInfoStep_timer, #OrderTimerStep , #FastActionStep').forEach(el => {
        if (el.classList.contains("bc-b500")) {
          el.classList.remove("b-2", "bc-b500", "radius-6")
        }
      });
      this.showCompleteTourTemplate()
    },
    steps: [
      {
        title: "Delivery Agent",
        selector: '#TripInfoStep_header',
        content: "First off, you can find a picture of the delivery agent and followed by his/her name.",
        orientation: Orientation.Right,
        highlightPadding: 0,
        overlayRadius: 6,
        action: () => {
          scrollToView('TaskNumberStep')

        },

      },
      {
        title: "Hub Name",
        selector: '#TripInfoStep_header',
        content: "Under the delivery agent's name, you can also find the hub name from which the delivery agent is dispatched from.",
        orientation: Orientation.Right,
        highlightPadding: 0,
        highlightHeight: 30,
        overlayRadius: 6,
        action: () => {
          document.getElementById('TripInfoStep_hubName').classList.add("b-2", "bc-b500", "radius-6")
        },
        closeAction() {
          document.getElementById('TripInfoStep_hubName').classList.remove("b-2", "bc-b500", "radius-6")
        },

      },
      {
        title: "Trip Status",
        selector: '#TripInfoStep_header',
        content: "A trip's status can also be viewed from here.",
        orientation: Orientation.Right,
        highlightPadding: 0,
        highlightHeight: 30,
        overlayRadius: 6,
        action: () => {
          document.getElementById('TripInfoStep_status').classList.add("b-2", "bc-b500", "radius-6", 'rb-p-2')
        },
        closeAction() {
          document.getElementById('TripInfoStep_status').classList.remove("b-2", "bc-b500", "radius-6", 'rb-p-2')
        },
      },
      {
        title: "Trip Number",
        selector: '#TripInfoStep_header',
        content: "Next is the trip's number as well as the number of tasks this trip contains 🔢",
        orientation: Orientation.Right
        ,
        highlightPadding: 0,
        highlightHeight: 32,
        overlayRadius: 6,
        action: () => {
          document.getElementById('TripInfoStep_number').classList.add("b-2", "bc-b500", "radius-6")
        },
        closeAction() {
          document.getElementById('TripInfoStep_number').classList.remove("b-2", "bc-b500", "radius-6")
        },
      },
      {
        title: "Waiting Time in to Pickup",
        selector: '#TripInfoStep_header',
        content: "<div class='mb-3'>From this timer, you can see how long it took for the agent to pick up the ready tasks. You will see that as the color yellow, but when the agents start the trip you will see the icon as green 🎨</div> Tip: since it is our main goal to optimize the delivery process, we set this up to help you to monitor even the smallest details like how long each pick-up location holds up the agents till it gives out the task to them ⏸",
        orientation: Orientation.Right,
        highlightPadding: 0,
        highlightHeight: 32,
        overlayRadius: 6,
        action: () => {
          document.getElementById('TripInfoStep_waitTime').classList.add("b-2", "bc-b500", "radius-6", "rb-p-2")
        },
        closeAction() {
          document.getElementById('TripInfoStep_waitTime').classList.remove("b-2", "bc-b500", "radius-6", "rb-p-2")
        }
      },
      {
        title: "Trip Timer",
        selector: '#TripInfoStep_header',
        content: "To view the time since the trip is dispatched till trip is completed and the agent returns to the hub, this timer can be used ⏱",
        orientation: Orientation.Right,
        highlightPadding: 0,
        highlightHeight: 32,
        overlayRadius: 6,
        action: () => {
          document.getElementById('TripInfoStep_timer').classList.add("b-2", "bc-b500", "radius-6", "rb-p-2")
        },
        closeAction() {
          document.getElementById('TripInfoStep_timer').classList.remove("b-2", "bc-b500", "radius-6", "rb-p-2")
        }
      },
      {
        title: "Task Timer",
        selector: '#TripInfoStep_header',
        content: "On the other hand, this timer shows you the time from which the customer placed their order to when the task was delivered to him/her",
        orientation: Orientation.Right,
        highlightPadding: 0,
        highlightHeight: 163,
        overlayRadius: 6,
        subSelector: '#OrderTimerStep',
        action: () => {
          document.getElementById('TripInfoStep_orderCard').querySelector('#OrderTimerStep').classList.add("b-2", "bc-b500", "radius-6", "rb-p-2")
        },
        closeAction() {
          document.getElementById('TripInfoStep_orderCard').querySelector('#OrderTimerStep').classList.remove("b-2", "bc-b500", "radius-6", "rb-p-2")
        }
      },
      {
        title: "Fast Actions",
        selector: '#TripInfoStep_header',
        content: "For some quick actions without having to click on the task card, you can use these two icons; using them you can remove a task from the trip or change the trip it is currently on!",
        orientation: Orientation.Right,
        highlightPadding: 0,
        highlightHeight: 163,
        overlayRadius: 6,
        subSelector: '#FastActionStep',
        action: () => {
          document.getElementById('TripInfoStep_orderCard').querySelector('#FastActionStep').classList.add("b-2", "bc-b500", "radius-6", "rb-p-2")
        },
        closeAction() {
          document.getElementById('TripInfoStep_orderCard').querySelector('#FastActionStep').classList.remove("b-2", "bc-b500", "radius-6", "rb-p-2")
        }
      },
      {
        title: "Running Trip Actions",
        selector: '#TripInfoStep_header',
        content: "For more details on the trip actions, please click on the trip card itself 🖱",
        orientation: Orientation.Right,
        highlightPadding: 0,
        overlayRadius: 6,
        hiddenSteps: true,
        textBtnNext: 'Okey',
        classBtnNext: 'rb-btn-success ',
        hiddenBtnPrev: true,
        action: () => {
        },
        closeAction() {
        }
      },

    ],
  };

  /*************************** dispatch Trip Actions Tour Data ***********************/

  public dispatchTripActionsTour: GuidedTour = {
    tourId: 'dispatch-trip-actions-tour',
    useOrb: false,
    preventBackdropFromAdvancing: true,
    skipCallback: (stepSkippedOn: number) => {
      this.modalRef?.hide()
    },
    completeCallback: () => {
      this.modalRef?.hide()
      this.showCompleteTourTemplate()

    },
    steps: [
      {
        selector: '#TripInfoStep_header',
        orientation: Orientation.Top,
        hiddenOverLay: true,

        action: () => {
          this.modalRef?.hide()

          document.getElementById('TripInfoStep_header').style.cssText = `
          box-shadow: 0px 15px 25px #0f61fd40;
          border: 2px solid #0F61FD;
        `;

        },
        closeAction: () => {

          document.getElementById('TripInfoStep_header').style.cssText = `
          box-shadow: unset;
          border: usnet;
        `;

          if (this.currentIndexTour == FilterTourStepEnum.TripActions) {
            this.selectedTrip = this.getTripListByGrouping(this.getGroupingList()[0])[0];
            this.selectedTrip.showTripLog = false
            this.selectedTrip.showTracking = false;
            this.modalRef = this._sharedService.modalService.show(this.tripActionsTemplate,
              { class: 'modal-order modal-transparent', backdrop: 'static', keyboard: false });
          }

        }

      },
      {
        title: "Trip Actions",
        selector: '#TripActionsStep',
        content: "These are the trip actions for an on-going trip.",
        orientation: Orientation.Right,
        action: () => {
          this.selectedTrip.hiddenOrders = true


        },
        closeAction: () => {
        }

      },
      {
        title: "Change Agent",
        selector: '#TripActionsStep',
        content: "To change the delivery agent for a trip, you can easily do so from 'Change Agent'!",
        orientation: Orientation.Right,
        topPosition:75,

        action: () => {
          this.selectedTrip.hiddenOrders = true
          document.getElementById('TripActionsStep').querySelector('#TripsActionStep_changeAgent').classList.add("b-2", "bc-b500", "radius-6", "rb-p-2")

        },
        closeAction: () => {
          document.getElementById('TripActionsStep').querySelector('#TripsActionStep_changeAgent').classList.remove("b-2", "bc-b500", "radius-6", "rb-p-2")

        }

      },
      {
        title: "Live Tracking (1/2)",
        selector: '#TripActionsStep',
        content: "One of our outstanding features is live tracking trips 😎 <div class='mt-3'>For a brief demo, <a class='c-b500'  >click the icon!</a> </div>",
        orientation: Orientation.Right,
        topPosition:75,

        action: () => {
          this.selectedTrip.hiddenOrders = true
          document.getElementById('TripActionsStep').querySelector('#TripsActionStep_livetracking').classList.add("b-2", "bc-b500", "radius-6", "rb-p-2")

        },
        closeAction: () => {
          document.getElementById('TripActionsStep').querySelector('#TripsActionStep_livetracking').classList.remove("b-2", "bc-b500", "radius-6", "rb-p-2")

        }

      },
      {
        title: "Live Tracking (2/2)",
        selector: '#TripsActionStep_livetracking2',
        content: "Live Tracking' enables you to view clearly how far each of the drop-off locations is from your agent.",
        orientation: Orientation.Right,
        action: () => {
          this.selectedTrip.hiddenOrders = true
          this.showLiveTracking()
          document.getElementById('TripActionsStep').querySelector('#TripsActionStep_livetracking').classList.add("b-2", "bc-b500", "radius-6")

        },
        closeAction: () => {
          this.selectedTrip.showTracking = false;
          document.getElementById('TripActionsStep').querySelector('#TripsActionStep_livetracking').classList.remove("b-2", "bc-b500", "radius-6")
        }

      },
      {
        title: "Complete Trip",
        selector: '#TripActionsStep',
        content: "To manually mark the trip as complete, this can be used.",
        orientation: Orientation.Right,
        topPosition:175,
        action: () => {
          document.getElementById('TripActionsStep').querySelector('#TripsActionStep_complete').classList.add("b-2", "bc-b500", "radius-6")

        },
        closeAction: () => {
          document.getElementById('TripActionsStep').querySelector('#TripsActionStep_complete').classList.remove("b-2", "bc-b500", "radius-6")
        }

      },

      {
        title: "Cancel Trip",
        selector: '#TripActionsStep',
        content: "You can cancel the trip manually from here.",
        orientation: Orientation.Right,
        topPosition:175,
        action: () => {
          document.getElementById('TripActionsStep').querySelector('#TripsActionStep_cancel').classList.add("b-2", "bc-b500", "radius-6")

        },
        closeAction: () => {
          document.getElementById('TripActionsStep').querySelector('#TripsActionStep_cancel').classList.remove("b-2", "bc-b500", "radius-6")
        }

      },
      

    ],
  };

    /*************************** dispatch Trip Task Actions Tour Data ***********************/
  public dispatchTripTaskActionsTour: GuidedTour = {
      tourId: 'dispatch-trip-task-actions-tour',
      useOrb: false,
      preventBackdropFromAdvancing: true,
      skipCallback: (stepSkippedOn: number) => {
        this.modalRef?.hide()
      },
      completeCallback: () => {
        this.modalRef?.hide()
        this.showCompleteTourTemplate()
  
      },
      steps: [
        {
          title: "Task Action on a Running Trip",
          selector: '#TripInfoStep_orderCard',
          content: "Task actions after it is dispatched!",
          orientation: Orientation.Right,
          highlightPadding: 0,
          overlayRadius: 6,
          hiddenSteps: true,
          textBtnNext: 'Okey',
          classBtnNext: 'rb-btn-success ',
          hiddenBtnPrev: true,
          action: () => {
          },
          closeAction: () => {
          }
        },
        {
          selector: '#TripInfoStep_orderCard',
          orientation: Orientation.Top,
          hiddenOverLay: true,
          highlightPadding:2,
  
          action: () => {
            this.modalRef?.hide()
  
            document.getElementById('TripInfoStep_orderCard').style.cssText = `
            box-shadow: 0px 15px 25px #0F61FD40;
            border: 2px solid #0F61FD;
            border-radius: 4px;
          `;
  
          },
          closeAction: () => {
  
            document.getElementById('TripInfoStep_orderCard').style.cssText = `
            box-shadow: unset;
            border: usnet;
          `;
  
  
          }
  
        },
        
        
  
      ],
    };
  
  


  /*************************** Methods ***********************/

  onTourStart(): void {
    throw new Error('Method not implemented.');

  }
  showCompleteTourTemplate() {
    throw new Error('Method not implemented.');
  }
  getGroupingList() {
    throw new Error('Method not implemented.');
  }
  getTripListByGrouping(arg0: any) {
    throw new Error('Method not implemented.');
  }
  showLiveTracking() {
    throw new Error('Method not implemented.');

  }

}

function scrollToView(id: string) {
  var elment = document.getElementById(id);
  elment.scrollIntoView(true);
}