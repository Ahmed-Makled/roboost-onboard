import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../components/shared/shared.module';
import { TripLayoutComponent } from '../components/trip/layout/layout.component';
import { AuthGuardService } from '../guards/auth-guard.service ';
import { PageEnum } from '../enum/page.enum';
export const routes: Routes = [
  {
    path: '',
    component: TripLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../components/trip/home/home.module').then(m => m.HomeModule),
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Trips_Recent, PageEnum.Trips_History] }
      },
 
      {
        path: 'by-deliveryman-service',
        loadChildren: () => import('../components/trip/by-delivery-service/by-delivery-service.module').then(m => m.ByDeliveryServiceModule),
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Trips_By_Deliveryman_Service, ] }
      },
      {
        path: 'details',
        loadChildren: () => import('../components/trip/details/trip-details.module').then(m => m.TripDetailsModule),
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Trips_Recent, PageEnum.Trips_History] }
      },
      {
        path: 'validation-request',
        loadChildren: () => import('../components/trip/validation-request/validation-request.module').then(m => m.ValidationRequestModule),
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Trips_Validation_Requests] }
      },
      {
        path: 'request',
        loadChildren: () => import('../components/trip/trip-request/trip-ignored-request.module').then(m => m.TripsIgnoredExpiredRequestsModule),
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Trips_Ignored_Expired_Requests] }
      },
      {
        path: 'uncompleted',
        loadChildren: () => import('../components/trip/uncomplate/uncomplate.module').then(m => m.UncomplateTripModule),
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Trips_Uncompleted_Cancelled] }
      },
      {
        path: 'alternative',
        loadChildren: () => import('../components/order/alternative/alternative-order.module').then(m => m.AlternativeOrderModule),
      },
    ]
  }
]
@NgModule({
  declarations: [TripLayoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), SharedModule
  ],
})
export class TripRoutingModule { }
