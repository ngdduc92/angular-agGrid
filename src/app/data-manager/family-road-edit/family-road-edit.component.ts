import { Component, Inject, OnInit } from '@angular/core';
import { BaseEditComponent } from '../base-edit/base-edit.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { FamilyRoadModel } from '../../models/family-road.model';
import { DatePipe } from '@angular/common';
import { DataManagerService } from '../data-manager.service';

import { messages } from "src/app/shared/messages";
import { AlertService } from "./../../shared/alert/alert.service";

@Component({
  selector: 'app-family-road-edit',
  templateUrl: './family-road-edit.component.html',
  styleUrls: ['./family-road-edit.component.css']
})
export class FamilyRoadEditComponent extends BaseEditComponent implements OnInit {
  channelName = "familyRoadEditChannel";
  editForm = new FormGroup({
    roadMark: new FormControl(),
    ownerIdentifier: new FormControl(),
    effectiveDate: new FormControl(),
    expirationDate: new FormControl()
  });
  public tableData = new FamilyRoadModel();

  constructor(
      @Inject(MAT_DIALOG_DATA) data: any,
      fb: FormBuilder,
      dialog: MatDialog,
      dialogRef: MatDialogRef<FamilyRoadEditComponent>,
      datePipe: DatePipe,
      dataManagerService: DataManagerService,
      private alertService: AlertService
  ) {
    super(data, fb, dialog, dialogRef, datePipe, dataManagerService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.editForm = this.fb.group({
      roadMark: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(4),
        Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      ownerIdentifier: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(4),
        Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      effectiveDate: [null, [Validators.required]],
      expirationDate: [null, [Validators.required]],
    }, {validator: this.checkDates});

    if (this.data.editType == 'Update') {
      this.tableData = this.data.tableData;
      this.editForm.get('roadMark').setValue(this.tableData.RoadMark);
      this.editForm.get('ownerIdentifier').setValue(this.tableData.OwnerIdentifier);
      this.editForm.get('effectiveDate').setValue(this.tableData.EffectiveDate);
      this.editForm.get('expirationDate').setValue(this.tableData.ExpirationDate);
      this.oldEffectiveDate = this.tableData.EffectiveDate;
      this.minDate = this.editForm.get('effectiveDate').value;
    } else {
      // Set init form default
      this.editForm.get('effectiveDate').setValue(this.minDate);
      this.editForm.get('expirationDate').setValue(this.maxDate);
    }
    this.canChangeEffectiveDate = true;
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
    const formData = new FamilyRoadModel();
    if (this.data.editType === 'Update') {
      formData.SequenceNumber = this.tableData.Id;
    }
    formData.RoadMark = this.editForm.get('roadMark').value;
    formData.OwnerIdentifier = this.editForm.get('ownerIdentifier').value;
    formData.EffectiveDate = this.datePipe.transform(this.editForm.get('effectiveDate').value, 'yyyy-MM-dd');
    formData.ExpirationDate = this.datePipe.transform(this.editForm.get('expirationDate').value, 'yyyy-MM-dd');
    return formData;
  }
}
