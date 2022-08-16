import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../components/shared/shared.module';
import { AgentLayoutComponent } from '../components/deliveryman/layout/agent-layout/agent-layout.component';
import { AgentSecondLayoutComponent } from '../components/deliveryman/layout/second-layout/layout.component';
import { AuthGuardService } from '../guards/auth-guard.service ';
import { PageEnum } from '../enum/page.enum';
export const routes: Routes = [
  // {
  //   path: '',
  //   children: [
  //     {
  //       path: '',
  //       loadChildren: () => import('../components/deliveryman/home/deliveryman.module').then(m => m.DeliverymanModule),
  //     },
  //     {
  //       path: 'break',
  //       loadChildren: () => import('../components/deliveryman/deliveryman-break/deliveryman-break.module').then(m => m.DeliverymanBreakModule),
  //     },
  //     {
  //       path: 'penalize',
  //       loadChildren: () => import('../components/deliveryman/deliveryman-penalize/deliveryman-penalize.module').then(m => m.DeliverymanPenalizeModule),
  //     },
  //     {
  //       path: 'shift',
  //       loadChildren: () => import('../components/deliveryman/deliveryman-shift/deliveryman-shift.module').then(m => m.DeliverymanShiftModule),
  //     },
  //     {
  //       path: 'request',
  //       loadChildren: () => import('../components/deliveryman/availability-request/availability-request.module').then(m => m.AvailabilityRequestModule),
  //     },
  //     {
  //       path: 'profile',
  //       loadChildren: () => import('../components/deliveryman/deliveryman-profile/deliveryman-profile.module').then(m => m.DeliverymanProfileModule),
  //     },
  //     {
  //       path: 'location-tracking',
  //       loadChildren: () => import('../components/deliveryman/track-location/track-location.module').then(m => m.TrackLocationModule),
  //     },
  //     {
  //       path: 'branchs-wallet',
  //       loadChildren: () => import('../components/deliveryman/wallet-branchs/wallet-branchs.module').then(m => m.BranchsWalletModule),
  //     },
  //     {
  //       path: 'log',
  //       loadChildren: () => import('../components/deliveryman/log/deliveryman-log.module').then(m => m.DeliverymanLogModule),
  //     },
  //     {
  //       path: 'wallet-transaction',
  //       loadChildren: () => import('../components/deliveryman/wallet-transaction/wallet.module').then(m => m.WalletModule),
  //     },
  //     {
  //       path: 'wallet-days',
  //       loadChildren: () => import('../components/deliveryman/wallet-days/wallet-days.module').then(m => m.WalletDaysModule),
  //     },
  //     {
  //       path: 'wallet-details',
  //       loadChildren: () => import('../components/deliveryman/wallet-transaction-test/wallet-transaction.module').then(m => m.WalletTransactionModule),
  //     },
  //     {
  //       path: 'deliveryman-validation',
  //       loadChildren: () => import('../components/deliveryman/deliveryman-validation/deliveryman-validation.module').then(m => m.DeliverymanValidationModule),
  //     }
  //   ]
  // },
  {
    path: '',
    component: AgentLayoutComponent,
    children: [
      {
        path: '',
        component: AgentSecondLayoutComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('../components/deliveryman/home/deliveryman.module').then(m => m.DeliverymanModule),
            canActivate: [AuthGuardService], data: { pageList: [PageEnum.Agent_profiles] }
          },
          {
            path: 'shift',
            children: [
              {
                path: "working-hours",
                loadChildren: () => import('../components/deliveryman/deliveryman-shift/deliveryman-shift.module').then(m => m.DeliverymanShiftModule),
                canActivate: [AuthGuardService], data: { pageList: [PageEnum.Agent_Shifts_Working_Hours] },
              },
              {
                path: 'availability',
                loadChildren: () => import('../components/deliveryman/availability-request/availability-request.module').then(m => m.AvailabilityRequestModule),
                canActivate: [AuthGuardService], data: { pageList: [PageEnum.Agent_Shifts_Availability] },
              },
              {
                path: 'penalized',
                loadChildren: () => import('../components/deliveryman/deliveryman-penalize/deliveryman-penalize.module').then(m => m.DeliverymanPenalizeModule),
                canActivate: [AuthGuardService], data: { pageList: [PageEnum.Agent_Shifts_Penalized] },
              },
              {
                path: 'break',
                loadChildren: () => import('../components/deliveryman/deliveryman-break/deliveryman-break.module').then(m => m.DeliverymanBreakModule),
                canActivate: [AuthGuardService], data: { pageList: [PageEnum.Agent_Shifts_Break] },
              },
            ],
            canActivate: [AuthGuardService], data: { pageList: [PageEnum.Agent_Shifts] }
          },
          {
            path: 'profiles/profile',
            loadChildren: () => import('../components/deliveryman/deliveryman-profile/deliveryman-profile.module').then(m => m.DeliverymanProfileModule),
            canActivate: [AuthGuardService], data: { pageList: [PageEnum.Agent_profiles] }
          },

          // {
          //   path: 'branchs-wallet',
          //   loadChildren: () => import('../components/deliveryman/wallet-branchs/wallet-branchs.module').then(m => m.BranchsWalletModule),
          // },
          {
            path: 'dedicated',
            loadChildren: () => import('../components/branch/dedicated/dedicated-branch.module').then(m => m.DedicatedBranchModule),
          },
          {
            path: 'log',
            loadChildren: () => import('../components/deliveryman/log/deliveryman-log.module').then(m => m.DeliverymanLogModule),
          },
          {
            path: 'request',
            loadChildren: () => import('../components/deliveryman/trip-request/trip-request.module').then(m => m.TripRequestModule),
            canActivate: [AuthGuardService], data: { pageList: [PageEnum.Agent_Trip_Request] }
          },
          // {
          //   path: 'wallet-transaction',
          //   loadChildren: () => import('../components/deliveryman/wallet-transaction/wallet.module').then(m => m.WalletModule),
          // },
          // {
          //   path: 'wallet-days',
          //   loadChildren: () => import('../components/deliveryman/wallet-days/wallet-days.module').then(m => m.WalletDaysModule),
          // },
          // {
          //   path: 'wallet-details',
          //   loadChildren: () => import('../components/deliveryman/wallet-transaction-test/wallet-transaction.module').then(m => m.WalletTransactionModule),
          // },
          // {
          //   path: 'deliveryman-validation',
          //   loadChildren: () => import('../components/deliveryman/deliveryman-validation/deliveryman-validation.module').then(m => m.DeliverymanValidationModule),
          // }
        ]
      },
    ]
  }
]
@NgModule({
  declarations: [AgentLayoutComponent, AgentSecondLayoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), SharedModule
  ],
})
export class AgentRoutingModule { }
