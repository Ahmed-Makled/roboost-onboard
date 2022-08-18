import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutComponent } from './layout/layout.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AgmCoreModule } from '@agm/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { LocalizationService } from '../../service/localization.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { environment } from 'src/environments/environment';
import { StarComponent } from './component/star/star.component';
import { HotkeyModule } from 'angular2-hotkeys';
import { AnotationComponent } from './component/anotation/anotation.component';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { MaxLengthPipe } from 'src/app/pipes/max-length.pipe';
import { MaxLengthDotPipe } from 'src/app/pipes/max-length-dot.pipe';
import { RangeSliderComponent } from './component/range-slider/range-slider.component';
import { TimerPipe } from 'src/app/pipes/timer.pipe';
import { AuthGuardService } from 'src/app/guards/auth-guard.service ';
import { DistancePipe } from 'src/app/pipes/distance.pipe';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { TaxBillComponent } from './component/tax-bill/tax-bill.component';
import { TimerTransformPipe } from 'src/app/pipes/time-transform.pipe';
import { ReceiptComponent } from './component/receipt/index/receipt.component';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmOverlays } from 'agm-overlays';
import { LoadingComponent } from './component/loading/loading.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { NotificationComponent } from './component/push-notification/index/notification.component';
import { KpaiComponent } from '../dispatch/page/partial/_kpai/kpai.component';
import { OrderCardComponent } from '../dispatch/page/partial/order-card/order-card.component';
import { FeatureGuardService } from 'src/app/guards/feature-guard.service';
import { ForbiddenComponent } from './component/forbidden/forbidden.component';
import { ImageViewComponent } from './component/image-view/image-view.component';
import { NumberPipe } from 'src/app/pipes/number.pipe';
import { NgControlComponent } from './component/ng-control/ng-control.component';
import { NgPaginationComponent } from './component/ng-pagination/ng-pagination.component';
import { ExtendDatePipe } from 'src/app/pipes/date.pipe';
import { GuidedTourCustomModule } from 'src/app/lib/guided-tour.module';
import { PricePipe } from 'src/app/pipes/price.pipe';

export function HttpLoaderFactory( http: HttpClient ) {
  return new TranslateHttpLoader( http, 'assets/i18n/', '.json' );
}

@NgModule({
  declarations: [
    LayoutComponent,
    SideMenuComponent,
    MaxLengthPipe,
    MaxLengthDotPipe,
    PricePipe,
    TimerPipe,
    DistancePipe,
    TimerTransformPipe,
    StarComponent,
    AnotationComponent,
    RangeSliderComponent,
    TaxBillComponent,
    ReceiptComponent,
    KpaiComponent,OrderCardComponent,
    LoadingComponent,
    NotificationComponent,
    ForbiddenComponent,ImageViewComponent,NumberPipe, NgControlComponent, NgPaginationComponent,ExtendDatePipe
  ],
  imports: [
    CommonModule,FormsModule,RouterModule,ModalModule.forRoot(),
    HttpClientModule,DatepickerModule,HotkeyModule.forRoot(),BsDatepickerModule.forRoot(),
    ReactiveFormsModule,NgSelectModule,NgxPaginationModule,NgxSkeletonLoaderModule,AgmJsMarkerClustererModule,
    AgmSnazzyInfoWindowModule,AgmOverlays,NgxMaterialTimepickerModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateModule,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }, isolate: true
    }),
    AgmCoreModule.forRoot({
      apiKey: environment.mapApiKey,
      libraries: ['visualization'],
    }),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger', // set defaults here
    }),
    DragDropModule,
    ClipboardModule,
    GuidedTourCustomModule
  ],
  providers:[AuthGuardService,FeatureGuardService],
  exports:[
    FormsModule,ReactiveFormsModule,RouterModule,ModalModule,HttpClientModule,NgSelectModule,
    DatepickerModule,BsDatepickerModule,HotkeyModule,TranslateModule,NgxPaginationModule,MaxLengthPipe,
    MaxLengthDotPipe,PricePipe,TimerPipe,DistancePipe,NgxSkeletonLoaderModule,AgmCoreModule,StarComponent,
    AnotationComponent,SideMenuComponent,
    TimerTransformPipe,RangeSliderComponent,NgxQRCodeModule,TaxBillComponent,ReceiptComponent,AgmJsMarkerClustererModule,
    AgmSnazzyInfoWindowModule,AgmOverlays,KpaiComponent,OrderCardComponent,LoadingComponent,DragDropModule,ClipboardModule,
    NgxMaterialTimepickerModule,NotificationComponent,
    ForbiddenComponent,ImageViewComponent,NumberPipe,NgControlComponent,NgPaginationComponent,ExtendDatePipe,GuidedTourCustomModule

  ]
})
export class SharedModule {
  constructor( private translate: TranslateService, private localizationService: LocalizationService ) {
    this.translate.use( localizationService.getLanguage() );
    localizationService.setLanguage(localizationService.getLanguage())
  }
}
