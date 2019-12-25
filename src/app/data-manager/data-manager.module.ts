import { NgModule } from '@angular/core';

import { DataManagerComponent } from './data-manager.component';
import { MasterEditComponent } from './master/master-edit.component';
import { SharedModule } from '../shared/shared.module';
import { DataManagerService } from './data-manager.service';
import { RouterModule } from '@angular/router';
import { ROUTES } from './data-manager.routes';
import { ConfirmationDialogComponent} from '../shared/confirmation-dialog/confirmation-dialog.component';
import { BaseEditComponent } from './base-edit/base-edit.component';
import { JointIndustryPairEditComponent } from './joint-industry-pair-edit/joint-industry-pair-edit.component';
import { ExceptionPoolEditComponent } from './exception-pool-edit/exception-pool-edit.component';
import { CarmarkEditComponent } from './carmark-edit/carmark-edit.component';
import { FamilyRoadEditComponent } from './family-road-edit/family-road-edit.component';
import { CtnComboEditComponent } from './ctn-combo-edit/ctn-combo-edit.component';
import { ConnectEditComponent } from './connect-edit/connect-edit.component';
import { NetworkIdEditComponent } from './network-id-edit/network-id-edit.component';
import { NoInterchangeReportingRoadEditComponent } from './no-interchange-reporting-road-edit/no-interchange-reporting-road-edit.component';
import { NoReleaseReportingRoadEditComponent } from './no-release-reporting-road-edit/no-release-reporting-road-edit.component';
import { ParticipantsEditComponent } from './participants-edit/participants-edit.component';
import { RateEditComponent } from './rate-edit/rate-edit.component';
import { HomeRoadEditComponent } from './home-road-edit/home-road-edit.component';
import { MasterDraftValidationResultComponent } from './master-draft-validation-result/master-draft-validation-result.component';
import { MasterDraftMassEditComponent } from './master-draft-mass-edit/master-draft-mass-edit.component';
import { MasterDraftRefreshDataComponent } from './master-draft-refresh-data/master-draft-refresh-data.component';

@NgModule({
  bootstrap: [DataManagerComponent],
  declarations: [
    DataManagerComponent,
    BaseEditComponent,
    MasterEditComponent,
    JointIndustryPairEditComponent,
    ExceptionPoolEditComponent,
    CarmarkEditComponent,
    FamilyRoadEditComponent,
    CtnComboEditComponent,
    ConnectEditComponent,
    NetworkIdEditComponent,
    NoInterchangeReportingRoadEditComponent,
    NoReleaseReportingRoadEditComponent,
    ParticipantsEditComponent,
    RateEditComponent,
    HomeRoadEditComponent,
    MasterDraftValidationResultComponent,
    MasterDraftMassEditComponent,
    MasterDraftRefreshDataComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(ROUTES)
  ],
  providers: [DataManagerService],
  entryComponents: [
    ConfirmationDialogComponent,
    BaseEditComponent,
    MasterEditComponent,
    JointIndustryPairEditComponent,
    ExceptionPoolEditComponent,
    CarmarkEditComponent,
    FamilyRoadEditComponent,
    CtnComboEditComponent,
    ConnectEditComponent,
    NetworkIdEditComponent,
    NoInterchangeReportingRoadEditComponent,
    NoReleaseReportingRoadEditComponent,
    ParticipantsEditComponent,
    RateEditComponent,
    HomeRoadEditComponent,
    MasterDraftValidationResultComponent,
    MasterDraftMassEditComponent,
    MasterDraftRefreshDataComponent
  ]
})
export class DataManagerModule { }
