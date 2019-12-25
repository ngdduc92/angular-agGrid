import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from './material.module';
import { RailincCommonModule } from '@railinc/rl-common-ui-lib';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AlertModule } from "./alert/alert.module";

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@NgModule({
  declarations: [ConfirmationDialogComponent],
  imports: [
    CommonModule,
    AgGridModule.withComponents([
      // Add you cell components here
    ]),
    MaterialModule,
    RailincCommonModule,
    FlexLayoutModule,
    AlertModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    AgGridModule,
    MaterialModule,
    RailincCommonModule,
    ConfirmationDialogComponent,
    AlertModule
  ],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ],
  entryComponents: [ConfirmationDialogComponent]
})
export class SharedModule { }
