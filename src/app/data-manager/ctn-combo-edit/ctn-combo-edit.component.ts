import { Component, Inject, OnInit } from '@angular/core';
import { BaseEditComponent } from '../base-edit/base-edit.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { CtnComboModel } from '../../models/ctn-combo.model';
import { DatePipe } from '@angular/common';
import { DataManagerService } from '../data-manager.service';

@Component({
  selector: 'app-ctn-combo-edit',
  templateUrl: './ctn-combo-edit.component.html',
  styleUrls: ['./ctn-combo-edit.component.css']
})
export class CtnComboEditComponent extends BaseEditComponent implements OnInit {

  editForm = new FormGroup({
    roadMark: new FormControl(),
    ownerMark: new FormControl(),
    tradeNameHomeRoad: new FormControl(),
    effectiveDate: new FormControl(),
    expirationDate: new FormControl()
  });
  public tableData = new CtnComboModel();

  constructor(
      @Inject(MAT_DIALOG_DATA) data: any,
      fb: FormBuilder,
      dialog: MatDialog,
      dialogRef: MatDialogRef<CtnComboEditComponent>,
      datePipe: DatePipe,
      dataManagerService: DataManagerService
  ) {
    super(data, fb, dialog, dialogRef, datePipe, dataManagerService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.editForm = this.fb.group({
      roadMark: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(4),
        Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      ownerMark: [null, [Validators.minLength(2), Validators.maxLength(4),
        Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      tradeNameHomeRoad: [null, [Validators.minLength(2), Validators.maxLength(4),
        Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      effectiveDate: [null, [Validators.required]],
      expirationDate: [null, [Validators.required]],
    }, {validator: this.checkDates});

    if (this.data.editType == 'Update') {
      this.tableData = this.data.tableData;
      this.editForm.get('roadMark').setValue(this.tableData.MarkInit);
      this.editForm.get('ownerMark').setValue(this.tableData.MarkFamily);
      this.editForm.get('tradeNameHomeRoad').setValue(this.tableData.OwnerIdentifier);
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
    const formData = new CtnComboModel();
    if (this.data.editType === 'Update') {
      formData.SequenceNumber = this.tableData.Id;
    }
    formData.MarkInit = this.editForm.get('roadMark').value;
    formData.MarkFamily = this.editForm.get('ownerMark').value;
    formData.OwnerIdentifier = this.editForm.get('tradeNameHomeRoad').value;
    formData.EffectiveDate = this.datePipe.transform(this.editForm.get('effectiveDate').value, 'yyyy-MM-dd');
    formData.ExpirationDate = this.datePipe.transform(this.editForm.get('expirationDate').value, 'yyyy-MM-dd');
    return formData;
  }
}


