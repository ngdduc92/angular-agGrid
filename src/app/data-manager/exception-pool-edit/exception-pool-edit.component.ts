import {Component, HostListener, Inject, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {BaseEditComponent} from '../base-edit/base-edit.component';
import {MatDialogRef} from '@angular/material';
import {DataManagerService} from '../data-manager.service';
import {DatePipe} from '@angular/common';
import {NetworkIDModel} from '../../models/network-id.model';
import {ExceptionPoolModel} from '../../models/exception-pool.model';

@Component({
  selector: 'app-exception-pool-edit',
  templateUrl: './exception-pool-edit.component.html',
  styleUrls: ['./exception-pool-edit.component.css']
})
export class ExceptionPoolEditComponent extends BaseEditComponent implements OnInit {

  editForm = new FormGroup({
    networkId: new FormControl(),
    effectiveDate: new FormControl(),
    expirationDate: new FormControl()
  });

  public tableData = new ExceptionPoolModel();

  constructor(
      @Inject(MAT_DIALOG_DATA) data: any,
      fb: FormBuilder,
      dialog: MatDialog,
      dialogRef: MatDialogRef<ExceptionPoolModel>,
      datePipe: DatePipe,
      dataManagerService: DataManagerService
  ) {
    super(data, fb, dialog, dialogRef, datePipe, dataManagerService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.editForm = this.fb.group({
      exceptionPool: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(7),
              Validators.pattern('[0-9a-zA-Z]+([0-9a-zA-Z ]+)*')]],
      effectiveDate: [null, [Validators.required]],
      expirationDate: [null, [Validators.required]],
    }, {validator: this.checkDates});

    if (this.data.editType === 'Update' ) {
      this.tableData = this.data.tableData;
      this.editForm.get('exceptionPool').setValue(this.tableData.ExceptionPool);
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
    const formData = new ExceptionPoolModel();
    if (this.data.editType === 'Update') {
      formData.SequenceNumber = this.tableData.Id;
    }
    formData.ExceptionPool = this.editForm.get('exceptionPool').value;
    formData.EffectiveDate = this.datePipe.transform(this.editForm.get('effectiveDate').value, 'yyyy-MM-dd');
    formData.ExpirationDate = this.datePipe.transform(this.editForm.get('expirationDate').value, 'yyyy-MM-dd');
    return formData;
  }
}
