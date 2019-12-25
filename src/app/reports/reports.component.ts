import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReportsService } from './reports.service';
import { ToastrService } from 'ngx-toastr';
import { ServerService } from 'src/app/shared/server.service';
import { HTTP_ERROR_MESSAGES } from '@railinc/rl-common-ui-lib';

import {messages} from 'src/app/shared/messages';
import { AlertService } from "./../shared/alert/alert.service";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  roadMarksFormControl = new FormControl();
  reportTypesFormControl = new FormControl();
  quartersFormControl = new FormControl();
  transportationCodeFormControl = new FormControl();
  agreeTermsFormControl = new FormControl();
  quarters = [];
  roadMarks = [];
  channelName = "reportChannel";

  apiBaseUrl = this.serverService.API_BASE_URL;

  reportUrl = '';
  reportTitle = '';

  constructor(
    private reportsService: ReportsService,
    private toastrService: ToastrService,
    private serverService: ServerService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.reportsService.listReportPeriods().subscribe((reportPeriods: any) => {
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

    this.reportsService.listRoadMarks().subscribe((roadMarks: any) => {
      if (roadMarks) {
        this.roadMarks = roadMarks;
        this.roadMarksFormControl.setValue(this.roadMarks[0].Mark);
      }
    },
    (err: any)  => {
      if (err.status === 0) {
        this.toastrService.error(HTTP_ERROR_MESSAGES.default);
      }
    });

    this.reportTypesFormControl.setValue('ObligationAdjustment');
    this.transportationCodeFormControl.setValue('1');
  }

  report_types = [
    { value: 'ObligationAdjustment', viewValue: 'Obligation Adjustment Summary' },
    { value: 'ExecutiveSummary', viewValue: 'Executive Summary' },
    { value: 'SuperSummary', viewValue: 'Super Summary' },
    { value: 'IntermediateJunction', viewValue: 'Intermediate Junction Movement' },
    { value: 'OriginDestination', viewValue: 'Origin Destination' },
    { value: 'OffsetCredit', viewValue: 'Offset Credit Detail' }
  ];

  downloadReports () {
    let year = '';
    let quarter = '';
    let selectedQuarter = this.quartersFormControl.value;
    if (selectedQuarter) {
      let selectedQuarterArray = selectedQuarter.split("Q");
      year = selectedQuarterArray[0];
      quarter = selectedQuarterArray[1];
    }

    let transportationCode = 'T';
    if (this.transportationCodeFormControl.value != 1) {
      transportationCode = 'E';
    }
    let mark = this.roadMarksFormControl.value;
    let reportType = this.reportTypesFormControl.value;

    let formData = 'TransportationCode='+transportationCode+'&Mark='+mark+'&ReportType='+reportType+'&Year='+year+'&Format=PDF&Quarter='+quarter;

    this.reportsService.reportInfo(formData).subscribe(
      (data: any) => {

        if(data.Record == null || data.Record == '') {
          this.alertService.error(messages.REPORT_NOT_FOUND, this.channelName);
        } else {
          let currentReport = data.Record;
          this.alertService.success(messages.REPORT_RETRIEVED, this.channelName);

          this.reportUrl = this.apiBaseUrl+'/reports/';
          if(currentReport.Mark != null && currentReport.Mark != '')
          {
            this.reportUrl  = this.reportUrl+currentReport.Mark+'/';
          }

          this.reportUrl = this.reportUrl+currentReport.Year+'/'+currentReport.Quarter+'/'+currentReport.ReportName+'/'+currentReport.TransportationCode+'/'+currentReport.Format;
          this.reportTitle = currentReport.DisplayName;
          window.open(this.reportUrl, "_blank");
        }
      },
      (err: any)  => {
        if (err.status === 0) {
          this.toastrService.error(HTTP_ERROR_MESSAGES.default);
        }
      }
    );
  }

  downloadFile () {
    this.alertService.clearChannel(this.channelName);
    window.open(this.reportUrl, "_blank");
  }

}
