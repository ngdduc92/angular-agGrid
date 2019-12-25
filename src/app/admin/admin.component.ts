import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AdminService } from './admin.service';
import { ToastrService } from 'ngx-toastr';
import { HTTP_ERROR_MESSAGES } from '@railinc/rl-common-ui-lib';

import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

import { messages } from 'src/app/shared/messages';
import { AlertService } from "./../shared/alert/alert.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  reportTypesFormControl = new FormControl();
  quartersFormControl = new FormControl();
  sendReportEmailsFormControl = new FormControl();
  quarters = [];
  selectedReportTypes = [];
  message = '';
  loadingMessage = '';
  hasLoading = false;
  channelName = "adminChannel";
  constructor(
    private dialog: MatDialog,
    private adminService: AdminService,
    private toastrService: ToastrService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.adminService.listReportPeriods().subscribe((reportPeriods: any) => {
      if (reportPeriods) {
        reportPeriods.map(reportPeriod => {
          this.quarters.push({value: reportPeriod.Year + 'Q' + reportPeriod.Quarter, viewValue: reportPeriod.Year + ' Q' + reportPeriod.Quarter})
        })
        if (this.quarters.length) {
          let defaultQuarter = this.quarters[0].value;
          this.quartersFormControl.setValue(defaultQuarter);
        }
      }
    },
    (err: any)  => {
      if (err.status === 0) {
        this.toastrService.error(HTTP_ERROR_MESSAGES.default);
      }
    });
    this.sendReportEmailsFormControl.setValue(true);
  }

  report_types = [
      { value: 'ObligationAdjustment', viewValue: 'Obligation Adjustment Summary' },
      { value: 'ExecutiveSummary', viewValue: 'Executive Summary' },
      { value: 'SuperSummary', viewValue: 'Super Summary' },
      { value: 'IntermediateJunction', viewValue: 'Intermediate Junction Movement' },
      { value: 'OriginDestination', viewValue: 'Origin Destination' },
      { value: 'OffsetCredit', viewValue: 'Offset Credit Detail' }
  ];

  selectAll () {
    this.reportTypesFormControl.setValue(['ObligationAdjustment', 'ExecutiveSummary', 'SuperSummary', 'IntermediateJunction', 'OriginDestination', 'OffsetCredit']);
  }


  selectAllReportTypes () {
    this.selectedReportTypes = ['ObligationAdjustment', 'ExecutiveSummary', 'SuperSummary', 'IntermediateJunction', 'OriginDestination', 'OffsetCredit'];
  }

  selectedReportType (event: MouseEvent, reportType: string) {
    if (event.ctrlKey || event.metaKey)
    {
      const index = this.selectedReportTypes.indexOf(reportType, 0);
      if (index > -1) {
        this.selectedReportTypes.splice(index, 1);
      } else {
        this.selectedReportTypes.push(reportType);
      }
    } else {
      this.selectedReportTypes = [];
      this.selectedReportTypes.push(reportType);
    }
  }

  releaseReports (action: string) {
    this.alertService.clearChannel(this.channelName);
    let year = '';
    let quarter = '';
    let selectedQuarter = this.quartersFormControl.value;
    if (selectedQuarter) {
      let selectedQuarterArray = selectedQuarter.split("Q");
      year = selectedQuarterArray[0];
      quarter = selectedQuarterArray[1];
    }

    let sendReportEmails = 'Y';
    if (!this.sendReportEmailsFormControl.value) {
      sendReportEmails = 'N';
    }

    let reportTypes = '';
    if (this.selectedReportTypes) {
      this.selectedReportTypes.map(selectedReportType => reportTypes = reportTypes + selectedReportType + '|');
    }

    let formData = 'Action='+action+'&Year='+year+'&ReportTypes='+reportTypes+'&Quarter='+quarter+'&SendReportEmails='+sendReportEmails;
    this.hasLoading = true;
    this.loadingMessage = messages.PERFORMING_OPERATION_MESSAGE;
    this.adminService.releaseReports(formData).subscribe(
      (data: any) => {
        this.hasLoading = false;
        if (data) {
          this.alertService.success(messages.OPERATION_SUCCESS_MESSAGE, this.channelName);
        } else {
          this.alertService.error(messages.OPERATION_FAILED_MESSAGE, this.channelName);
        }
      },
      (err: any)  => {
        this.hasLoading = false;
        if (err.status === 0) {
          this.toastrService.error(HTTP_ERROR_MESSAGES.default);
        }
      }
    );
  }

  generateReports () {
    this.alertService.clearChannel(this.channelName);
    let dialogRef = this.dialog.open(AlertDialogComponent, {
      hasBackdrop: true,
      data: {
        title: messages.GENERATE_REPORTS_TITLE,
        message: messages.GENERATE_REPORTS_MESSAGE
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'confirm') {
        this.hasLoading = true;
        this.loadingMessage = messages.REPORTS_GENERATING_MESSAGE;
        this.adminService.generateReports().subscribe(
          (data: any) => {
            if (data) {
              this.hasLoading = false;
              this.alertService.success(messages.REPORTS_GENERATED_SUCCESS_MESSAGE, this.channelName);
            }
          },
          (err: any)  => {
            this.hasLoading = false;
            if (err.status === 0) {
              this.toastrService.error(HTTP_ERROR_MESSAGES.default);
            }
          }
        );
      }
    })
  }

}
