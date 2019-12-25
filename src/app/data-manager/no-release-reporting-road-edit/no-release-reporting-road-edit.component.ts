import {Component, HostListener, Inject, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {BaseEditComponent} from '../base-edit/base-edit.component';
import {MatDialogRef} from '@angular/material';
import {DatePipe} from '@angular/common';
import {NoReleaseReportingRoad} from '../../models/no-release-reporting-road.model';
import {DataManagerService} from '../data-manager.service';


@Component({
  selector: 'app-no-release-reporting-road-edit',
  templateUrl: './no-release-reporting-road-edit.component.html',
  styleUrls: ['./no-release-reporting-road-edit.component.css']
})
export class NoReleaseReportingRoadEditComponent extends BaseEditComponent implements OnInit {

  editForm = new FormGroup({
    shortLine: new FormControl(),
    trunkLine: new FormControl(),
    effectiveDate: new FormControl(),
    expirationDate: new FormControl()
  });

  public tableData = new NoReleaseReportingRoad();

  constructor(
      @Inject(MAT_DIALOG_DATA) data: any,
      fb: FormBuilder,
      dialog: MatDialog,
      dialogRef: MatDialogRef<NoReleaseReportingRoadEditComponent>,
      datePipe: DatePipe,
      dataManagerService: DataManagerService
  ) {
    super(data, fb, dialog, dialogRef, datePipe, dataManagerService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.editForm = this.fb.group({
      shortLine: [null, [Validators.required]],
      trunkLine: [null, [Validators.required]],
      effectiveDate: [null, [Validators.required]],
      expirationDate: [null, [Validators.required]],
    }, {validator: this.checkDates});

    if (this.data.editType === 'Update') {
      this.tableData = this.data.tableData;
      this.editForm.get('shortLine').setValue(this.tableData.ShortLine);
      this.editForm.get('trunkLine').setValue(this.tableData.TrunkLine);
      this.editForm.get('effectiveDate').setValue(this.tableData.EffectiveDate);
      this.editForm.get('expirationDate').setValue(this.tableData.ExpirationDate);
      this.oldEffectiveDate = this.tableData.EffectiveDate;
      this.minDate = this.editForm.get('effectiveDate').value;
    } else {
      // Set init form default
      this.editForm.get('effectiveDate').setValue(this.minDate);
      this.editForm.get('expirationDate').setValue(this.maxDate);
    }
  }

  formChanged() {
    super.formChanged();
  }

  callCancelDialog(event) {
    super.onCancelDialog(this.editForm);
  }

  onAddNew() {
    if (this.editForm.invalid) {
      return;
    }
    const sendData = this.getDataOnForm();
    this.addNewData(sendData, this.editForm);
  }

  onExpireToday() {
    const sendData = {
      'SequenceNumber': this.tableData.Id
    };
   this.expireToday(sendData, this.editForm);
  }

  public onModify() {
    if (this.editForm.invalid) {
      return;
    }
    const sendData = this.getDataOnForm();
    this.modifyData(sendData, this.editForm);
  }

  getDataOnForm() {
    const formData = new NoReleaseReportingRoad();
    if (this.data.editType === 'Update') {
      formData.SequenceNumber = this.tableData.Id;
    }
    formData.ShortLine = this.editForm.get('shortLine').value;
    formData.TrunkLine = this.editForm.get('trunkLine').value;
    formData.EffectiveDate = this.datePipe.transform(this.editForm.get('effectiveDate').value, 'yyyy-MM-dd');
    formData.ExpirationDate = this.datePipe.transform(this.editForm.get('expirationDate').value, 'yyyy-MM-dd');
    return formData;
  }
}
