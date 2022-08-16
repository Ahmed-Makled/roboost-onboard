import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../components/shared/shared.module';
import { StoreLayoutComponent } from '../components/branch/layout/layout.component';
import { AuthGuardService } from '../guards/auth-guard.service ';
import { PageEnum } from '../enum/page.enum';

export const routes: Routes = [
  {
    path: '',
    component: StoreLayoutComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../components/branch/home/branch-home.module').then(m => m.BranchHomeModule),
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Stores_Home] }
      },
     
      {
        path: 'tracking',
        loadChildren: () => import('../components/branch/tracking/branch-tracking.module').then(m => m.BranchTrackingMenModule),
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Stores_Monitoring_Tracking] }
      },
  
      {
        path: 'delivery-time',
        loadChildren: () => import('../components/branch/delivery-time/branch-delivery-time.module').then(m => m.BranchDeliveryTimeModule),
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Stores_Delivery_Time] }
      },
     
      {
        path: 'area',
        loadChildren: () => import('../components/branch/area/branch-area.module').then(m => m.BranchAreaModule),
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Stores_Hubs_Areas] }
      },
      {
        path: 'profile',
        loadChildren: () => import('../components/branch/profile/branch-profile.module').then(m => m.BranchProfileModule),
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Stores_Home] }
      },
      {
        path: 'qr-code',
        loadChildren: () => import('../components/branch/qr-code/qr-code.module').then(m => m.GenerateQRCodeSModule),
      },
      {
        path: 'dedicated',
        loadChildren: () => import('../components/branch/dedicated/dedicated-branch.module').then(m => m.DedicatedBranchModule),
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Stores_Dedicated] }

      },
    ],
    canActivate: [AuthGuardService], data: { pageList: [PageEnum.Stores] }
  },
]

@NgModule({
  declarations: [StoreLayoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), SharedModule
  ],
})

export class BranchRoutingModule { }
