import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../components/shared/shared.module';
import { AuthGuardService } from '../guards/auth-guard.service ';
import { PageEnum } from '../enum/page.enum';
import { FristLayoutComponent } from '../components/accounting/layout/frist-layout/frist-layout.component';
import { SystemSecondLayoutComponent } from '../components/accounting/layout/second-layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: FristLayoutComponent,
    children: [
      {
        path: 'wallet',
    component: SystemSecondLayoutComponent,

        children:[
          {
            path: 'store',
            loadChildren: () => import('../components/deliveryman/wallet-branchs/wallet-branchs.module').then(m => m.BranchsWalletModule),
            canActivate: [AuthGuardService], data: { pageList: [PageEnum.Accounts_Wallet] }
          },
          {
            path: 'agent',
            loadChildren: () => import('../components/deliveryman/wallet-transaction/wallet.module').then(m => m.WalletModule),
          },
          {
            path: 'agent/:id',
            loadChildren: () => import('../components/deliveryman/wallet-days/wallet-days.module').then(m => m.WalletDaysModule),
          },
          {
            path: 'transaction',
            loadChildren: () => import('../components/deliveryman/wallet-details/wallet-details.module').then(m => m.WalletDetailsModule),
          },
          {
            path: 'validation',
            loadChildren: () => import('../components/deliveryman/deliveryman-validation/deliveryman-validation.module').then(m => m.DeliverymanValidationModule),
          },
        ],
        canActivate: [AuthGuardService], data: { pageList: [PageEnum.Accounts_Wallet] }
      },
      
     ]
   }
]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes), SharedModule
  ],
  declarations: [FristLayoutComponent,SystemSecondLayoutComponent]
})
export class AccountingRoutingModule { }
