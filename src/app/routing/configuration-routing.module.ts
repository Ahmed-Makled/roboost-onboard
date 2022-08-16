import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../components/shared/shared.module';
import { ConfigurationLayoutComponent } from '../components/configuration/layout/layout.component';
import { AuthGuardService } from '../guards/auth-guard.service ';
import { PageEnum } from '../enum/page.enum';

export const routes: Routes = [
  {
    path: '',
    component: ConfigurationLayoutComponent,
    children: [
      {
        path: 'item',
        loadChildren: () => import('../components/item/home/item-home.module').then(m => m.ItemHomeModule),
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Configuration_Items] },
      },
      {
        path: 'order',
        loadChildren: () => import('../components/configuration/order-configuration/order-configuration.module').then(m => m.OrderConfigurationModule),
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Configuration_Order] },
      },
      {
        path: 'trip',
        loadChildren: () => import('../components/configuration/trip-configuration/trip-configuration.module').then(m => m.TripConfigurationModule),
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Configuration_Trip] },
      },
      {
        path: 'address',
        loadChildren: () => import('../components/configuration/address-configuration/address-configuration.module').then(m => m.AddressConfigurationModule),
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Configuration_Address] },
      },
      {
        path: 'revenue',
        loadChildren: () => import('../components/configuration/revenue-configuration/revenue-configuration.module').then(m => m.RevenueConfigurationModule),
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Configuration_Revenue] },
      },
    ],
    canActivate: [AuthGuardService], data: { pageList: [PageEnum.Configuration] }
  },
]

@NgModule({
  declarations: [ConfigurationLayoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), SharedModule
  ],
})

export class ConfigurationRoutingModule { }
