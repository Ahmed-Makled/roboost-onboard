import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../components/shared/shared.module';
import { AnalyticsSecondLayoutComponent } from '../components/analytics/layout/second-layout/layout.component';
import { AnalyticsLayoutComponent } from '../components/analytics/layout/first-layout/first-layout.component';
import { AuthGuardService } from '../guards/auth-guard.service ';
import { PageEnum } from '../enum/page.enum';

export const routes: Routes = [
  {
    path: '',
    component: AnalyticsLayoutComponent,
    children: [

      {
        path: '',
        component: AnalyticsSecondLayoutComponent,
        children: [
          {
            path: 'trip',
            children: [
              {
                path: 'date',
                loadChildren: () => import('../components/trip/by-date/by-date.module').then(m => m.ByDateModule),
                canActivate: [AuthGuardService], data: { pageList: [PageEnum.Analytics_Trips_By_Date] }

              },
              {
                path: 'deliveryman',
                loadChildren: () => import('../components/trip/by-deliveryman/by-deliveryman.module').then(m => m.ByDeliverymanModule),
                canActivate: [AuthGuardService], data: { pageList: [PageEnum.Analytics_Trips_By_Deliveryman] }
         
              },
              {
                path: 'store',
                loadChildren: () => import('../components/trip/by-branch/by-branch.module').then(m => m.ByBranchModule),
                canActivate: [AuthGuardService], data: { pageList: [PageEnum.Analytics_Trips_By_Stores] }

              },

            ]
          },
          {
            path: 'task',
            children: [
              {
                path: 'store',
                loadChildren: () => import('../components/order/performance/by-branch/order-store-performance.module').then(m => m.OrderPerformanceStoreModule),
                canActivate: [AuthGuardService], data: { pageList: [PageEnum.Analytics_Tasks_By_Branch] }

              },
              {
                path: 'date',
                loadChildren: () => import('../components/order/performance/by-date/order-store-performance.module').then(m => m.OrderPerformanceDateModule),
                canActivate: [AuthGuardService], data: { pageList: [PageEnum.Analytics_Trips_By_Date] }

              },
              {
                path: 'deliveryman',
                loadChildren: () => import('../components/order/performance/by-deliveryman/order-store-performance.module').then(m => m.OrderPerformanceDateModule                ),
                canActivate: [AuthGuardService], data: { pageList: [PageEnum.Analytics_Tasks_By_Deliveryman] }

              },
              {
                path: 'preparation-time',
                 children:[
                  {
                    path: '', redirectTo: 'user', pathMatch: 'full'
                  },
                  {
                    path: 'user',
                    loadChildren: () => import('../components/order/user-preparation/user-preparation.module').then(m => m.UserPreparationhModule),
                  },
                  {
                    path: 'store',
                    loadChildren: () => import('../components/order/branch-preparation/branch-preparation.module').then(m => m.BranchPreparationhModule),
                  },
                 ] 

              },
            ]
          },
          {
            path: 'performance',
            children: [
              {
                path: 'area',
                loadChildren: () => import('../components/branch/area-performance/branch-area-performance.module').then(m => m.BranchAreaPerformanceModule),
                canActivate: [AuthGuardService], data: { pageList: [PageEnum.Analytics_Performance_Area] }

              },
              {
                path: 'store',
                loadChildren: () => import('../components/branch/performance/branch-performance.module').then(m => m.BranchPerformanceModule),
              },
              {
                path: 'behavior',
                loadChildren: () => import('../components/branch/behavior/branch-behavior.module').then(m => m.BranchBehaviorModule),
              },
             
            ]
          },

        ]
      }




    ],
  },
]

@NgModule({
  declarations: [AnalyticsLayoutComponent, AnalyticsSecondLayoutComponent,],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), SharedModule
  ],
})

export class AnalyticsRoutingModule { }
