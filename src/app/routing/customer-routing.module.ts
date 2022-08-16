import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../components/shared/shared.module';
import { CustomerLayoutComponent } from '../components/customer/layout/layout.component';
import { PageEnum } from '../enum/page.enum';
import { AuthGuardService } from '../guards/auth-guard.service ';

export const routes: Routes = [
  {
    path: '',
    component: CustomerLayoutComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../components/customer/home/customer-home.module').then(m => m.CustomerHomeModule),
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Customers_Home] },
      },
      {
        path: 'review',
        loadChildren: () => import('../components/customer/customer-review/cutsomer-review.module').then(m => m.CustomerReviewModule),
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Customers_Reviews] }

      },
      {
        path: 'shipping-address',
        loadChildren: () => import('../components/customer/shipping-address/shipping-address.module').then(m => m.ShippingAddressModule),
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Customers_Shipping_addresses] }

      },
      {
        path: 'profile',
        loadChildren: () => import('../components/customer/profile/profile.module').then(m => m.ProfileModule),
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Customers_Home] },
      },
      {
        path: 'call-center',
        loadChildren: () => import('../components/customer/call-center/call-center.module').then(m => m.CallCenterModule),
      },
    ],
    canActivate: [AuthGuardService], data: { pageList: [PageEnum.Customers] }
  },
]

@NgModule({
  declarations: [CustomerLayoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), SharedModule
  ],
})

export class CustomerRoutingModule { }
