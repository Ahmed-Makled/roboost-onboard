import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../components/shared/shared.module';

import { TaskLayoutComponent } from '../components/order/layout/layout.component';
import { AuthGuardService } from '../guards/auth-guard.service ';
import { PageEnum } from '../enum/page.enum';

export const routes: Routes = [

  {
    path: '',
    component: TaskLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../components/order/home/home.module').then(m => m.OrderHomeModule),
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Tasks_Recent, PageEnum.Tasks_History] }
      },
      {
        path: 'transfers',
        loadChildren: () => import('../components/order/transfer/transfer.module').then(m => m.TransferModule),
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Tasks_Transfers] }
      },
    
      {
        path: 'scheduled',
        loadChildren: () => import('../components/order/scheduled-order/scheduled-order.module').then(m => m.ScheduledOrderModule),
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Tasks_Scheduled] }
      },
    
      {
        path: 'details',
        loadChildren: () => import('../components/order/details/order-details.module').then(m => m.OrderDetailsModule),
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Tasks_Recent, PageEnum.Tasks_History] }
      },
    
      {
        path: 'uncompleted',
        loadChildren: () => import('../components/order/uncompleted-order/uncomplate.module').then(m => m.OrderUncomplateModule),
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Tasks_Uncompleted_Cancelled] }
      },
     

    ]
  }

  // {
  //   path:'',
  //   component:OrderLayoutComponent,
  //   children:[
  //     {
  //       path:'',
  //       component:HomeLayoutComponent,
  //       children:[
  //         {
  //           path:'',
  //           loadChildren: () => import('../components/order/home/home.module').then(m => m.OrderHomeModule),
  //         },
  //         {
  //           path:'transfer',
  //           loadChildren: () => import('../components/order/transfer/transfer.module').then(m => m.TransferModule),
  //         },
  //       ],
  //     },
  //     {
  //       path:'performance',
  //       loadChildren: () => import('../components/order/performance/order-performance.module').then(m => m.OrderPerformanceModule),
  //     },
  //     {
  //       path:'scheduled-order',
  //       loadChildren: () => import('../components/order/scheduled-order/scheduled-order.module').then(m => m.ScheduledOrderModule),
  //     },
  //     {
  //       path:'user-preparation',
  //       loadChildren: () => import('../components/order/user-preparation/user-preparation.module').then(m => m.UserPreparationhModule),
  //     },
  //     {
  //       path:'branch-preparation',
  //       loadChildren: () => import('../components/order/branch-preparation/branch-preparation.module').then(m => m.BranchPreparationhModule),
  //     },
  //   ]
  // },
]

@NgModule({
  declarations: [TaskLayoutComponent, ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), SharedModule
  ],
})

export class OrderRoutingModule { }
