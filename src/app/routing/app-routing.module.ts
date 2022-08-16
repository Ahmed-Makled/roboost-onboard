import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BroadCastLayoutComponent } from '../components/broadcast/layout/layout.component';
import { DispatchLayoutComponent } from '../components/dispatch/layout/layout.component';
import { HeatmapLayoutComponent } from '../components/heatmap/layout/layout.component';
import { OnboardingLayoutComponent } from '../components/onboarding/layout/layout.component';
import { ForbiddenComponent } from '../components/shared/component/forbidden/forbidden.component';
import { LayoutComponent } from '../components/shared/layout/layout.component';
import { SharedModule } from '../components/shared/shared.module';
import { LiveTrackingLayoutComponent } from '../components/track-location/layout/layout.component';
import { PageEnum } from '../enum/page.enum';
import { AuthGuardService } from '../guards/auth-guard.service ';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('../components/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'not-authorized',component:ForbiddenComponent
  },
  // {
  //   path: '**',
  //   redirectTo: 'not-authorized'
  // },

  {
    path: '', component: LayoutComponent,
    children: [
      {
        path: '', redirectTo: 'live-operation', pathMatch: 'full'
      },
      {
        path: 'live-operation',
        loadChildren: () => import('./live-operation-routing.module').then(m => m.LiveOperationRoutingModule)
      },
      {
        path: 'dispatch',
        component: DispatchLayoutComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('../components/dispatch/page/dispatch.module').then((m) => m.DispatchModule),
          }
        ],
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Dispatch] }
      },
      {
        path: 'onboarding',
        component: OnboardingLayoutComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('../components/onboarding/page/dispatch.module').then((m) => m.OnboardingModule),
          }
        ],
      },
      {
        path: 'trip',
        loadChildren: () => import('./trip-routing.module').then(m => m.TripRoutingModule)
      },
      {
        path: 'task',
        loadChildren: () => import('./order-routing.module').then(m => m.OrderRoutingModule)
      },
      {
        path: 'analytics',
        loadChildren: () => import('./analytics-routing.module').then((m) => m.AnalyticsRoutingModule),
      },
      {
        path: 'customer',
        loadChildren: () => import('./customer-routing.module').then(m => m.CustomerRoutingModule)
      },
      {
        path: 'agent',
        loadChildren: () => import('./agent-routing.module').then(m => m.AgentRoutingModule)
      },
      {
        path: 'user',
        loadChildren: () => import('./user-routing.module').then((m) => m.UserRoutingModule),
      },
      {
        path: 'store',
        loadChildren: () => import('./branch-routing.module').then((m) => m.BranchRoutingModule),
      },
      {
        path: 'item',
        loadChildren: () => import('./item-routing.module').then((m) => m.ItemRoutingModule),
      },
      {
        path: 'heatmap',
        component: HeatmapLayoutComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('../components/heatmap/heatmap.module').then(m => m.HeatmapModule),
          }
        ],
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Heatmap] }
      },
      {
        path: 'configuration',
        loadChildren: () => import('./configuration-routing.module').then((m) => m.ConfigurationRoutingModule),
      },
      {
        path: 'broadcast',
        component:BroadCastLayoutComponent,
        children:[  {
          path:'home',
          loadChildren: () => import('./broadcast-routing.module').then((m) => m.BroadCastRoutingModule),
          
        }
      ],
      canActivate: [AuthGuardService], data: { pageList: [PageEnum.Broadcast] }


      },
      {
        path: 'system-config',
        loadChildren: () => import('./system-config-routing.module').then((m) => m.SystemConfigRoutingModule),
      },
      {
        path: 'accounting',
        loadChildren: () => import('./accounting-routing.module').then((m) => m.AccountingRoutingModule),
      },
      {
        path: 'live-tracking',
        component:LiveTrackingLayoutComponent,

        loadChildren: () => import('../components/track-location/track-location.module').then(m => m.TrackLocationModule),
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Live_Tracking] }

      },
      {
        path: 'ranking-board',
        loadChildren: () => import('./ranking-routing.module').then((m) => m.RankingRoutingModule),
      },
      


    ],
    canActivate: [AuthGuardService],

  },
];

@NgModule({
  declarations: [DispatchLayoutComponent,HeatmapLayoutComponent,BroadCastLayoutComponent,LiveTrackingLayoutComponent
   ],
  imports: [RouterModule.forRoot(routes), SharedModule,CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
