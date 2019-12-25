import {Component, HostListener, Inject, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {BaseEditComponent} from '../base-edit/base-edit.component';
import {MatDialogRef} from '@angular/material';
import {DatePipe} from '@angular/common';
import {ConnectModel} from '../../models/connect.model';
import {DataManagerService} from '../data-manager.service';


@Component({
  selector: 'app-connect-edit',
  templateUrl: './connect-edit.component.html',
  styleUrls: ['./connect-edit.component.css']
})
export class ConnectEditComponent extends BaseEditComponent implements OnInit {

  editForm = new FormGroup({
    carrier1: new FormControl(),
    carrier2: new FormControl(),
    effectiveDate: new FormControl(),
    expirationDate: new FormControl()
  });

  public tableData = new ConnectModel();

  constructor(
      @Inject(MAT_DIALOG_DATA) data: any,
      fb: FormBuilder,
      dialog: MatDialog,
      dialogRef: MatDialogRef<ConnectEditComponent>,
      datePipe: DatePipe,
      dataManagerService: DataManagerService
  ) {
    super(data, fb, dialog, dialogRef, datePipe, dataManagerService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.editForm = this.fb.group({
      carrier1: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(4),
            Validators.pattern('[0-9a-zA-Z]+([0-9a-zA-Z ]+)*')]],
      carrier2: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(4),
            Validators.pattern('[0-9a-zA-Z]+([0-9a-zA-Z ]+)*')]],
      effectiveDate: [null, [Validators.required]],
      expirationDate: [null, [Validators.required]],
    }, {validator: this.checkDates});

    if (this.data.editType === 'Update') {
      this.tableData = this.data.tableData;
      this.editForm.get('carrier1').setValue(this.tableData.Carrier1);
      this.editForm.get('carrier2').setValue(this.tableData.Carrier2);
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
    const formData = new ConnectModel();
    if (this.data.editType === 'Update') {
      formData.SequenceNumber = this.tableData.Id;
    }
    formData.Carrier1 = this.editForm.get('carrier1').value;
    formData.Carrier2 = this.editForm.get('carrier2').value;
    formData.EffectiveDate = this.datePipe.transform(this.editForm.get('effectiveDate').value, 'yyyy-MM-dd');
    formData.ExpirationDate = this.datePipe.transform(this.editForm.get('expirationDate').value, 'yyyy-MM-dd');
    return formData;
  }
}
