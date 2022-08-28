import { TemplateRef } from '@angular/core';
import { FilterTourStepEnum } from 'src/app/components/shared/layout/layout.component';
import { GuidedTour, Orientation } from 'src/app/lib/guided-tour.constants';
import { GuidedTourTestService } from 'src/app/lib/guided-tour.service';
import { DummyDataService } from 'src/app/service/dummy-data.service';
import { SharedService } from 'src/app/service/shared.service';
export class GuidedTourData {
  tripActionsTemplate
  modalRef: any;
  currentIndexTour: FilterTourStepEnum;
  selectedTrip: any;
  selectedOrder: any;
  public _pageService: any;
  actionTamplate: string | TemplateRef<any> | (new (...args: any[]) => Object);
  constructor(
    public _sharedService: SharedService,
    public DummyDataService: DummyDataService,
    public guidedTourService: GuidedTourTestService,

  ) { }
  /*************************** dispatch General Tour Data ***********************/
  public dispatchGeneralTour: GuidedTour = {
    tourId: 'dispatch-general-tour',
    useOrb: false,
    preventBackdropFromAdvancing: true,
    skipCallback: (stepSkippedOn: number) => {
      this.modalRef?.hide(),
        document.getElementById('WelcomeStep').classList.remove('active')
      document.getElementById('WelcomeStep').querySelector('img').src = '/assets/img/side-menu/dispatch.svg'

    },
    completeCallback: () => {
      this.modalRef?.hide()
      this.guidedTourService.resetTour();
      this.showCompleteTourTemplate()
      document.getElementById('WelcomeStep').classList.remove('active')
      document.getElementById('WelcomeStep').querySelector('img').src = '/assets/img/side-menu/dispatch.svg'

    },
    steps: [
      {
        title: "Welcome to Roboost!",
        titleClass: 'c-b500',
        selector: '#WelcomeStep',
        content: "This is our dispatching page, where you can monitor and manage all your running live operations such as your deliverymen's status as well as the current ongoing trips, in addition to the all tasks uploaded on the system😊",
        orientation: Orientation.Right,
        highlightPadding: 3,
        overlayRadius: 8,
        action: () => {
          document.getElementById('WelcomeStep').classList.add('active')
          document.getElementById('WelcomeStep').querySelector('img').src = '/assets/img/side-menu/dispatch-active.svg'
          scrollToView('TaskNumberStep')
        },
      },
      {
        title: "Task Number",
        selector: '#TaskNumberStep',
        content: "<div class='mb-3'>One of our first features you can find is 'Task Number'.</div> From here, you can search for any details regarding the tasks, agents, and trips, while grouping and sorting the results as you may like.",
        orientation: Orientation.Bottom,
        overlayRadius: 8,
        highlightPadding: 0,
        action: () => {
        },
      },
      {
        title: "Stores, Hubs & Areas",
        selector: '#FilterBYStep',
        content: "<div class='mb-3'>Using this you can view your data according to <span class='c-g900 bold'>store, hub, or area</span>; thus, making things much easier to navigate through 👌</div> In addition, if there is an <span class='c-r500 bold' >issue</span> with any store, hub or area you will be able to see it and locate the source of the problem!",
        orientation: Orientation.Bottom,
        highlightPadding: 0,
        action: () => {
        },
      },
      {
        title: "KPIs & Statistics",
        selector: '#KpiStep',
        content: "Here is where you can find a summary of the KPI's and statistics of your operations in a quick, efficient manner!",
        orientation: Orientation.Bottom,
        highlightPadding: 8,
        highlightHeight: -3,
        action: () => {
        },
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
      this.modalRef?.hide()
    },
    completeCallback: () => {
      // this.modalRef?.hide()
      // this.guidedTourService.resetTour();
      // this.onTourStart(FilterTourStepEnum.TripActions)
      // this._sharedService.router.navigate(['/onboarding'],{ queryParams:{step: FilterTourStepEnum.TripActions}})
      this.modalRef?.hide()
      this.guidedTourService.resetTour();
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
        highlightHeight: 34,
        overlayRadius: 6,
        action: () => {
          AddClassSubStepActive('TripInfoStep_hubName')
          document.getElementById('TripInfoStep_hubName').style.cssText = `
          outline-offset:0!important;
          `
        },
        closeAction: () => {
          RemoveClassSubStepActive('TripInfoStep_hubName')
        },
      },
      {
        title: "Trip Status",
        selector: '#TripInfoStep_header',
        content: "A trip's status can also be viewed from here.",
        orientation: Orientation.Right,
        highlightPadding: 0,
        highlightHeight: 34,
        overlayRadius: 6,
        action: () => {
          AddClassSubStepActive('TripInfoStep_status')
          document.getElementById('TripInfoStep_status').style.cssText = `
          outline-offset:0!important;
          `
        },
        closeAction: () => {
          RemoveClassSubStepActive('TripInfoStep_status')
        },
      },
      {
        title: "Trip Number",
        selector: '#TripInfoStep_header',
        content: "Next is the trip's number as well as the number of tasks this trip contains 🔢",
        orientation: Orientation.Right,
        highlightPadding: 0,
        highlightHeight: 34,
        overlayRadius: 6,
        action: () => {
          AddClassSubStepActive('TripInfoStep_number')
        },
        closeAction: () => {
          RemoveClassSubStepActive('TripInfoStep_number')
        },
      },
      {
        title: "Waiting Time in to Pickup",
        selector: '#TripInfoStep_header',
        content: "<div class='mb-3'>From this timer, you can see how long it took for the agent to pick up the ready tasks. You will see that as the color yellow, but when the agents start the trip you will see the icon as green 🎨</div> Tip: since it is our main goal to optimize the delivery process, we set this up to help you to monitor even the smallest details like how long each pick-up location holds up the agents till it gives out the task to them ⏸",
        orientation: Orientation.Right,
        highlightPadding: 0,
        highlightHeight: 34,
        overlayRadius: 6,
        action: () => {
          AddClassSubStepActive('TripInfoStep_waitTime')
        },
        closeAction: () => {
          RemoveClassSubStepActive('TripInfoStep_waitTime')
        },
      },
      {
        title: "Trip Timer",
        selector: '#TripInfoStep_header',
        content: "To view the time since the trip is dispatched till trip is completed and the agent returns to the hub, this timer can be used ⏱",
        orientation: Orientation.Right,
        highlightPadding: 0,
        highlightHeight: 34,
        overlayRadius: 6,
        action: () => {
          AddClassSubStepActive('TripInfoStep_timer')
        },
        closeAction: () => {
          RemoveClassSubStepActive('TripInfoStep_timer')
        },
      },
      {
        title: "Task Timer",
        selector: '#TripInfoStep_header',
        content: "On the other hand, this timer shows you the time from which the customer placed their order to when the task was delivered to him/her",
        orientation: Orientation.Right,
        highlightPadding: 0,
        highlightHeight: 158,
        overlayRadius: 6,
        action: () => {
          document.getElementById('2').scrollTo(0, 0)
          AddClassSubStepActive('OrderTimerStep', 'TripInfoStep_orderCard')
        },
        closeAction: () => {
          RemoveClassSubStepActive('OrderTimerStep', 'TripInfoStep_orderCard')
        },
      },
      {
        title: "Fast Actions",
        selector: '#TripInfoStep_header',
        content: "For some quick actions without having to click on the task card, you can use these two icons; using them you can remove a task from the trip or change the trip it is currently on!",
        orientation: Orientation.Right,
        highlightPadding: 0,
        highlightHeight: 158,
        overlayRadius: 6,
        action: () => {
          AddClassSubStepActive('FastActionStep', 'TripInfoStep_orderCard')
        },
        closeAction: () => {
          RemoveClassSubStepActive('FastActionStep', 'TripInfoStep_orderCard')
        },
      },
      // {
      //   title: "Running Trip Actions",
      //   selector: '#TripInfoStep_header',
      //   content: "For more details on the trip actions, please click on the trip card itself 🖱",
      //   orientation: Orientation.Right,
      //   highlightPadding: 0,
      //   overlayRadius: 6,
      //   hiddenSteps: true,
      //   textBtnNext: 'Open Trip Actions',
      //   classBtnNext: 'rb-btn-success ms-2',
      //   hiddenBtnPrev: true,
      //   action: () => {

      //   },
      //   closeAction: () => {

      //   }
      // },
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
      this.guidedTourService.resetTour();
      this.showCompleteTourTemplate()
    },
    steps: [
      {
        selector: '#TripInfoStep_header',
        orientation: Orientation.Top,
        hiddenOverLay: true,
        action: () => {
          this.modalRef?.hide()
          scrollToView('accordionTripCard')

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
        topPosition: 75,
        action: () => {
          AddClassSubStepActive('TripsActionStep_changeAgent', 'TripActionsStep')
        },
        closeAction: () => {
          RemoveClassSubStepActive('TripsActionStep_changeAgent', 'TripActionsStep')
        },
      },
      {
        title: "Live Tracking (1/2)",
        selector: '#TripActionsStep',
        content: "One of our outstanding features is live tracking trips 😎 <div class='mt-3'>For a brief demo.</div>",
        orientation: Orientation.Right,
        topPosition: 75,
        textBtnNext: 'Open Live Tracking',
        action: () => {
          AddClassSubStepActive('TripsActionStep_livetracking', 'TripActionsStep')
        },
        closeAction: () => {
        },
      },
      {
        title: "Live Tracking (2/2)",
        selector: '#TripsActionStep_livetracking2',
        content: "Live Tracking' enables you to view clearly how far each of the drop-off locations is from your agent.",
        orientation: Orientation.Right,
        action: () => {
          this.showLiveTracking()
        },
        closeAction: () => {
          this.selectedTrip.showTracking = false;
          RemoveClassSubStepActive('TripsActionStep_livetracking', 'TripActionsStep')
        },
      },
      {
        title: "Complete Trip",
        selector: '#TripActionsStep',
        content: "To manually mark the trip as complete, this can be used.",
        orientation: Orientation.Right,
        topPosition: 175,
        action: () => {
          AddClassSubStepActive('TripsActionStep_complete', 'TripActionsStep')
        },
        closeAction: () => {
          RemoveClassSubStepActive('TripsActionStep_complete', 'TripActionsStep')
        }
      },
      {
        title: "Cancel Trip",
        selector: '#TripActionsStep',
        content: "You can cancel the trip manually from here.",
        orientation: Orientation.Right,
        topPosition: 175,
        action: () => {
          AddClassSubStepActive('TripsActionStep_cancel', 'TripActionsStep')
        },
        closeAction: () => {
          RemoveClassSubStepActive('TripsActionStep_cancel', 'TripActionsStep')
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
      this.guidedTourService.resetTour();
      this.showCompleteTourTemplate()
    },
    steps: [
      {
        title: "Task Action on a Running Trip",
        selector: '#TripInfoStep_orderCard',
        content: "Task actions after it is dispatched!",
        orientation: Orientation.Right,
        highlightPadding: 5,
        overlayRadius: 6,
        hiddenSteps: true,
        textBtnNext: 'Okey',
        classBtnNext: 'rb-btn-success ',
        hiddenBtnPrev: true,
        action: () => {
          document.getElementById('2').scrollTo(0, 0)
          scrollToView('accordionTripCard')
        },
        closeAction: () => {
        }
      },
      {
        selector: '#TripInfoStep_orderCard',
        orientation: Orientation.Top,
        hiddenOverLay: true,
        highlightPadding: 2,
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

          this.selectedOrder = this.getTripListByGrouping(this.getGroupingList()[0])[0].Orders[0]
          console.log(this.selectedOrder);
          this._pageService.selectedOrder = this.selectedOrder
          if (!this.selectedOrder.action) this.showTaskAction()
          else this.excuteActionOnTask(this.selectedOrder.action, this.selectedOrder.item)
        }
      },
      {
        title: "Task Actions",
        selector: '#TripTaskActionsStep',
        content: "As seen, there are 2 new task actions which can be used after a task is dispatched:",
        orientation: Orientation.Right,
        action: () => {
        },
        closeAction: () => {
        }
      },
      {
        title: "Change Trip",
        selector: '#TripTaskActionsStep',
        content: "The use of the 'Change Trip' gives you the option to change the trip this task is on and assign it to another on-going trip.",
        orientation: Orientation.Right,
        topPosition: 85,
        action: () => {
          AddClassSubStepActive('TaskActionsStep_changeTrip', 'TripTaskActionsStep')
        },
        closeAction: () => {
          RemoveClassSubStepActive('TaskActionsStep_changeTrip', 'TripTaskActionsStep')
        }
      },
      {
        title: "Remove Task from Trip",
        selector: '#TripTaskActionsStep',
        content: "'Remove' allows you to remove a task from the trip and return it to ready tasks ⏪, but in pause status, to re-dispatch it automatically removes the pause",
        orientation: Orientation.Right,
        topPosition: 85,
        action: () => {
          AddClassSubStepActive('TaskActionsStep_remove', 'TripTaskActionsStep')
        },
        closeAction: () => {
          RemoveClassSubStepActive('TaskActionsStep_remove', 'TripTaskActionsStep')
        }
      },
    ],
  };
  /*************************** dispatch Tasks Section  Tour Data ***********************/
  public dispatchAllTaskTour: GuidedTour = {
    tourId: 'dispatch-All-tasks-tour',
    useOrb: false,
    preventBackdropFromAdvancing: true,
    skipCallback: (stepSkippedOn: number) => {
      this.modalRef?.hide()
    },
    completeCallback: () => {
      this.modalRef?.hide()
      this.guidedTourService.resetTour();
      this.showCompleteTourTemplate()
    },
    steps: [
      {
        title: "Ready & In-Progress",
        selector: '#AllTasksStep_Ready',
        content: "<div class='mb-3'>In 'Tasks' you can view two main categories which are ready and in-progress tasks..</div> <div class='mb-3'>First of these categories is ready tasks; which are tasks that have been prepared and are ready to be picked by a delivery agent ✅</div> In-progress section must b activated from the configuration",
        orientation: Orientation.Bottom,
        highlightPadding: 3,
        overlayRadius: 6,
        action: () => {
          this.onTasksTabClick(1)
          scrollToView('TripInfoStep_orderCard')
        },
        closeAction: () => {
        }
      },
      {
        title: "Scheduled",
        selector: '#AllTasksStep_Scheduled',
        content: "Here, you can find the orders that are arranged for pickup on a later date! 📅",
        orientation: Orientation.Bottom,
        highlightPadding: 3,
        overlayRadius: 6,
        action: () => {
          this.onTasksTabClick(2)
        },
        closeAction: () => {
          this.onTasksTabClick(0)
        }
      },
      {
        title: "Fast Task",
        selector: '#AllTasksStep_FastTaskBtn',
        content: "<div class='mb-3'>For a quick efficient way to set up a task without using integration, you can use 'Fast Task' ⚡ </div> Click on <span class='c-g900'>Learn More</span> on how to create your fast task.",
        orientation: Orientation.Left,
        highlightPadding: 2,
        overlayRadius: 6,
        showLearnMoreBtn: true,
        learnMoreLink: '',
        action: () => {
        },
        closeAction: () => {
        }
      },
      {
        title: "Manual Trip",
        selector: '#AllTasksStep_SpecialTripBtn',
        content: "The 'Manual Trip' feature allows you to override the auto-dispatch system and pair any agent of your choice with the specific task 👨‍💻 ",
        orientation: Orientation.Left,
        highlightPadding: 2,
        overlayRadius: 6,
        showLearnMoreBtn: true,
        learnMoreLink: '',
        action: () => {
        },
        closeAction: () => {
        }
      },
    ],
  };
  /*************************** dispatch Task Card Info Tour Data ***********************/
  public dispatchTaskCardInfoTour: GuidedTour = {
    tourId: 'dispatch-task-info-tour',
    useOrb: false,
    preventBackdropFromAdvancing: true,
    skipCallback: (stepSkippedOn: number) => {
      this.modalRef?.hide()
    },
    completeCallback: () => {
      this.modalRef?.hide()
      this.guidedTourService.resetTour();
      this.showCompleteTourTemplate()
    },
    steps: [
      {
        title: "Pickup Location",
        selector: '#TaskCardInfoStep',
        content: "First up is the name of the pick-up location from which the task was placed.",
        orientation: Orientation.Right,
        highlightPadding: 2,
        overlayRadius: 6,
        action: () => {
          console.log('TaskCardInfoStep');
          scrollToView('TaskCardInfoStep')
          AddClassSubStepActive('StoreInfo', 'TaskCardInfoStep')
        },
        closeAction: () => {
          RemoveClassSubStepActive('StoreInfo', 'TaskCardInfoStep')
        }
      },
      {
        title: "Task Status",
        selector: '#TaskCardInfoStep',
        content: "First up is the name of the pick-up location from which the task was placed.",
        orientation: Orientation.Right,
        highlightPadding: 2,
        overlayRadius: 6,
        action: () => {
          AddClassSubStepActive('taskStatus', 'TaskCardInfoStep')
        },
        closeAction: () => {
          RemoveClassSubStepActive('taskStatus', 'TaskCardInfoStep')
        }
      },
      {
        title: "Task Timer",
        selector: '#TaskCardInfoStep',
        content: "From here, you can view how long it has been since the pickup time. ⏱",
        orientation: Orientation.Right,
        highlightPadding: 2,
        overlayRadius: 6,
        action: () => {
          AddClassSubStepActive('OrderTimerStep', 'TaskCardInfoStep')
        },
        closeAction: () => {
          RemoveClassSubStepActive('OrderTimerStep', 'TaskCardInfoStep')
        }
      },
      {
        title: "Task Number",
        selector: '#TaskCardInfoStep',
        content: "In the case of task integration from the point of sale, you will see a task number similar to this one.",
        orientation: Orientation.Right,
        highlightPadding: 2,
        overlayRadius: 6,
        action: () => {
          AddClassSubStepActive('TaskNumber', 'TaskCardInfoStep')
        },
        closeAction: () => {
          RemoveClassSubStepActive('TaskNumber', 'TaskCardInfoStep')
        }
      },
      {
        title: "Total Bill",
        selector: '#TaskCardInfoStep',
        content: "This is total bill the task amounts for 🧾",
        orientation: Orientation.Right,
        highlightPadding: 2,
        overlayRadius: 6,
        action: () => {
          AddClassSubStepActive('TotalBill', 'TaskCardInfoStep')
        },
        closeAction: () => {
          RemoveClassSubStepActive('TotalBill', 'TaskCardInfoStep')
        }
      },
      {
        title: "Customer Name & Drop-off",
        selector: '#TaskCardInfoStep',
        content: "You can also find the customer's name followed by their drop-off address. 📍",
        orientation: Orientation.Right,
        highlightPadding: 2,
        overlayRadius: 6,
        action: () => {
          AddClassSubStepActive('CustomerName', 'TaskCardInfoStep')
          AddClassSubStepActive('AddressCustomer', 'TaskCardInfoStep')
        },
        closeAction: () => {
          RemoveClassSubStepActive('CustomerName', 'TaskCardInfoStep')
          RemoveClassSubStepActive('AddressCustomer', 'TaskCardInfoStep')
        },
      },
      {
        title: "Customer Distance",
        selector: '#TaskCardInfoStep',
        content: "Next to them, the distance between the pick-up and drop-off locations can be seen 🗺",
        orientation: Orientation.Right,
        highlightPadding: 2,
        overlayRadius: 6,
        action: () => {
          AddClassSubStepActive('CustomerDistance', 'TaskCardInfoStep')
        },
        closeAction: () => {
          RemoveClassSubStepActive('CustomerDistance', 'TaskCardInfoStep')
        },
      },
      {
        title: "Service Skills",
        selector: '#TaskCardInfoStep',
        content: "<div class='mb-3'>These icons can help highlight if specific service skills are needed for this task, such as specific language and top rated.</div> the skills can be created from the configuration and then assigned to your agent. <span class='c-b500'>More Details</span>",
        orientation: Orientation.Right,
        highlightPadding: 2,
        overlayRadius: 6,
        action: () => {
          AddClassSubStepActive('ServiceSkills', 'TaskCardInfoStep')
        },
        closeAction: () => {
          RemoveClassSubStepActive('ServiceSkills', 'TaskCardInfoStep')
        },
      },
      {
        title: "Fast Actions",
        selector: '#TaskCardInfoStep',
        content: "<div class='mb-3'>The last items on the task card are two fast actions icons.</div>  right, you can find the 'Pause Task' icon, pausing the task's dispatching.<div class='mb-3'> The icon after it is for 'Immediate Dispatching' from which you can add the task to any running trip of your choice.</div> <span class='c-g900'>Note: </span>the pause action only pauses the automatic dispatching, not the task timer.",
        orientation: Orientation.Right,
        highlightPadding: 2,
        overlayRadius: 6,
        action: () => {
          AddClassSubStepActive('FastActionStep', 'TaskCardInfoStep')
        },
        closeAction: () => {
          RemoveClassSubStepActive('FastActionStep', 'TaskCardInfoStep')
        },
      },
      // {
      //   title: "That's all for the task card",
      //   titleClass: "c-b500",
      //   selector: '#TaskCardInfoStep',
      //   content: "To move on to the task actions, please click on the task card!",
      //   orientation: Orientation.Right,
      //   highlightPadding: 2,
      //   highlightHeight:5,
      //   overlayRadius: 6,
      //   hiddenSteps: true,
      //   textBtnNext: 'Okey',
      //   classBtnNext: 'rb-btn-success ',
      //   hiddenBtnPrev: true,
      //   action: () => {
      //   },
      //   closeAction: () => {
      //   }
      // },
    ],
  };

  $flagOpenModalTaskActions: boolean = false
  /*************************** dispatch  Task Actions Tour Data ***********************/
  public dispatchTaskCardActionsTour: GuidedTour = {
    tourId: 'dispatch-task-actions-tour',
    useOrb: false,
    preventBackdropFromAdvancing: true,
    skipCallback: (stepSkippedOn: number) => {
      this.modalRef?.hide()
      this.$flagOpenModalTaskActions = false

    },
    completeCallback: () => {
      this.modalRef?.hide()
      this.$flagOpenModalTaskActions = false
      this.guidedTourService.resetTour();
      this.showCompleteTourTemplate()
    },
    steps: [
      {
        selector: '#TaskCardInfoStep',
        orientation: Orientation.Top,
        hiddenOverLay: true,
        highlightPadding: 2,
        action: () => {
          scrollToView('TaskCardInfoStep')
          if (this.$flagOpenModalTaskActions) {
            console.log('flagOpenModalTaskActions');
            this.modalRef?.hide()
          }
          this.$flagOpenModalTaskActions = false
          document.getElementById('TaskCardInfoStep').style.cssText = `
              box-shadow: 0px 15px 25px #0F61FD40;
              border: 2px solid #0F61FD;
              border-radius: 4px;
            `;
        },
        closeAction: () => {
          document.getElementById('TaskCardInfoStep').style.cssText = `
              box-shadow: unset;
              border: usnet;
            `;
        }
      },
      {
        title: "Task Actions",
        selector: '#TripTaskActionsStep',
        content: "There are task multiple actions for a task before it is dispatched.",
        orientation: Orientation.Right,
        action: () => {
          if (this.currentIndexTour == FilterTourStepEnum.TaskCardAction && !this.$flagOpenModalTaskActions) {
            this.selectedOrder = this.DummyDataService.DummyOrders[0]
            this._pageService.selectedOrder = this.selectedOrder
            this.selectedOrder.ShowOrderLocation = false
            this.selectedOrder.ShowTaskLog = false
            this.selectedOrder.ShowTaskDetails = false
            this.modalRef = this._sharedService.modalService.show(this.actionTamplate, { class: 'modal-order modal-transparent' });
            this.$flagOpenModalTaskActions = true

          }
        },
        closeAction: () => {
        }
      },
      {
        title: "Pause Task",
        selector: '#TripTaskActionsStep',
        content: "On click, this pauses the dispatching of a task while keeping its time running 🏃",
        orientation: Orientation.Right,
        topPosition: 85,
        action: () => {
          AddClassSubStepActive('TaskActions_Pause', 'TripTaskActionsStep')
        },
        closeAction: () => {
          RemoveClassSubStepActive('TaskActions_Pause', 'TripTaskActionsStep')
        },
      },
      {
        title: "Specific Trip",
        selector: '#TripTaskActionsStep',
        content: "'Using this you can add a task to any running trip of your choice.",
        orientation: Orientation.Right,
        topPosition: 85,
        action: () => {
          AddClassSubStepActive('TaskActions_Specific', 'TripTaskActionsStep')
        },
        closeAction: () => {
          RemoveClassSubStepActive('TaskActions_Specific', 'TripTaskActionsStep')
        },
      },

      {
        title: "Top Priority",
        selector: '#TripTaskActionsStep',
        content: "'When you click on this, you give the task a higher priority in dispatching.",
        orientation: Orientation.Right,
        topPosition: 85,
        action: () => {
          AddClassSubStepActive('TaskActions_TopPriority', 'TripTaskActionsStep')
        },
        closeAction: () => {
          RemoveClassSubStepActive('TaskActions_TopPriority', 'TripTaskActionsStep')
        },
      },
      {
        title: "Manual Delivered",
        selector: '#TripTaskActionsStep',
        content: "This specifies that the task is to be delivered manually and removes it from the running tasks.",
        orientation: Orientation.Right,
        topPosition: 150,
        action: () => {
          AddClassSubStepActive('TaskActions_ManualDeliver', 'TripTaskActionsStep')
        },
        closeAction: () => {
          RemoveClassSubStepActive('TaskActions_ManualDeliver', 'TripTaskActionsStep')
        },
      },
      {
        title: "Cancel Task",
        selector: '#TripTaskActionsStep',
        content: "You can cancel the task using this. This can be quite useful in case a customer canceled his/her order 👌",
        orientation: Orientation.Right,
        topPosition: 150,
        action: () => {
          AddClassSubStepActive('TaskActions_Cancel', 'TripTaskActionsStep')
        },
        closeAction: () => {
          RemoveClassSubStepActive('TaskActions_Cancel', 'TripTaskActionsStep')
        },
      },
      {
        title: "Update Task Details (1/2)",
        selector: '#TripTaskActionsStep',
        content: "Whenever you want to update the task, You can do it from this icon.",
        orientation: Orientation.Right,
        topPosition: 200,
        textBtnNext: 'Open update task',
        action: () => {
          setTimeout(() => {
            AddClassSubStepActive('TaskActionsStep_Update', 'TripTaskActionsStep')
          }, 100);
        },
        closeAction: () => {
          // this.modalRef?.hide();
          // this.showUpdateTaskTemplate()
          RemoveClassSubStepActive('TaskActionsStep_Update', 'TripTaskActionsStep')
        },
      },
      {
        title: "Update Task Details (2/2)",
        selector: '#UpdateTaskStep',
        content: "From here you can add any needed extra services or special notes to the task.",
        orientation: Orientation.Right,
        topPosition: 100,
        hiddenBtnPrev: true,
        action: () => {
          this.modalRef?.hide();
          this.showUpdateTaskTemplate()

        },
        closeAction: () => {
          this.modalRef?.hide();
          this.selectedOrder = this.DummyDataService.DummyOrders[0]
          this._pageService.selectedOrder = this.selectedOrder
          this.selectedOrder.ShowOrderLocation = false
          this.selectedOrder.ShowTaskLog = false
          this.selectedOrder.ShowTaskDetails = false
          this.modalRef = this._sharedService.modalService.show(this.actionTamplate, { class: 'modal-order modal-transparent' });
        }
      },
      {
        title: "Task Log (1/2)",
        selector: '#TripTaskActionsStep',
        content: "Task Log' shows you the timeline that the task is following.",
        orientation: Orientation.Right,
        topPosition: 200,
        textBtnNext: 'Open task log',

        action: () => {
          AddClassSubStepActive('TaskActionsStep_Log', 'TripTaskActionsStep')
        },
        closeAction: () => {
          RemoveClassSubStepActive('TaskActionsStep_Log', 'TripTaskActionsStep')
        },
      },
      {
        title: "Task Log (2/2)",
        selector: '#TaskLogStep2',
        content: "This an example of the timestamps of a completed task 💪",
        orientation: Orientation.Right,
        // topPosition: 200,
        action: () => {
          this.getTaskLog()
        },
        closeAction: () => {
          this.selectedOrder.ShowTaskLog = false
        }
      },
      {
        title: "Task Location",
        selector: '#TripTaskActionsStep',
        content: "With this icon, you are able to view the task location on map (pick-up to drop-off), while viewing the Estimated Time of Arrival (ETA).",
        orientation: Orientation.Right,
        topPosition: 200,
        action: () => {
          AddClassSubStepActive('TaskActionsStep_Map', 'TripTaskActionsStep')
        },
        closeAction: () => {
          RemoveClassSubStepActive('TaskActionsStep_Map', 'TripTaskActionsStep')
        },
      },
      {
        title: "Pickup & Drop-off",
        selector: '#TripTaskActionsStep',
        content: "Next up, you can find the distance between the pick-up and drop-off locations. In addition, you are able to view the full address of the drop-off location 📍",
        orientation: Orientation.Right,
        topPosition: 300,
        action: () => {
          AddClassSubStepActive('TaskActionsStep_Pickup', 'TripTaskActionsStep')
        },
        closeAction: () => {
          RemoveClassSubStepActive('TaskActionsStep_Pickup', 'TripTaskActionsStep')
        },
      },
      {
        title: "Show Task Details",
        selector: '#TripTaskActionsStep',
        content: "Click on it to show the details of the task.",
        orientation: Orientation.Right,
        topPosition: 400,
        action: () => {
          AddClassSubStepActive('TaskActionsStep_ShowDetails', 'TripTaskActionsStep')
        },
        closeAction: () => {
          RemoveClassSubStepActive('TaskActionsStep_ShowDetails', 'TripTaskActionsStep')
          this.selectedOrder.ShowTaskDetails = true
        },
      },
      {
        title: "Task Details",
        selector: '#TaskDetailsStep ',
        content: "On this card, you can find the time the task was entered into the system using integration as well as the estimated time of arrival; the items on the task; and the final receipt for the task (taking into consideration VAT and any discount that applies).",
        orientation: Orientation.Right,
        action: () => {
        },
        closeAction: () => {
          this.selectedOrder.ShowTaskDetails = false

        }
      },
    ],
  };
  /*************************** Methods ***********************/
  onTourStart(param): void {
    throw new Error('Method not implemented.');
  }
  showCompleteTourTemplate() {
    throw new Error('Method not implemented.');
  }
  getGroupingList() {
    throw new Error('Method not implemented.');
  }
  getTripListByGrouping(arg?: any) {
    throw new Error('Method not implemented.');
  }
  showLiveTracking() {
    throw new Error('Method not implemented.');
  }
  onOrderClick(arg?: any) {
    throw new Error('Method not implemented.');
  }
  excuteActionOnTask(action: any, item: any) {
    throw new Error('Method not implemented.');
  }
  showTaskAction() {
    throw new Error('Method not implemented.');
  }
  onTasksTabClick(i: any) {
    throw new Error('Function not implemented.');
  }
  showUpdateTaskTemplate() {
    throw new Error('Function not implemented.');
  }
  getTaskLog() {
    throw new Error('Function not implemented.');
  }
}
function scrollToView(id: string) {
  var elment = document.getElementById(id);
  elment.scrollIntoView(true);
}
function AddClassSubStepActive(elementID: string, parentId?: string) {
  if (!parentId) document.getElementById(elementID).classList.add('sub-step__active')
  if (parentId) document.getElementById(parentId).querySelector(`#${elementID}`).classList.add('sub-step__active')
}
function RemoveClassSubStepActive(elementID: string, parentId?: string) {
  if (!parentId) document.getElementById(elementID).classList.remove('sub-step__active')
  if (parentId) document.getElementById(parentId).querySelector(`#${elementID}`).classList.remove('sub-step__active')
}