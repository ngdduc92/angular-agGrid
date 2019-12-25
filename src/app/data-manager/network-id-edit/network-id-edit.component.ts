import {Component, HostListener, Inject, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {BaseEditComponent} from '../base-edit/base-edit.component';
import {MatDialogRef} from '@angular/material';
import {DataManagerService} from '../data-manager.service';
import {DatePipe} from '@angular/common';
import {NetworkIDModel} from '../../models/network-id.model';

@Component({
  selector: 'app-network-id-edit',
  templateUrl: './network-id-edit.component.html',
  styleUrls: ['./network-id-edit.component.css']
})
export class NetworkIdEditComponent extends BaseEditComponent implements OnInit {

  editForm = new FormGroup({
    networkId: new FormControl(),
    effectiveDate: new FormControl(),
    expirationDate: new FormControl()
  });

  public tableData = new NetworkIDModel();

  constructor(
      @Inject(MAT_DIALOG_DATA) data: any,
      fb: FormBuilder,
      dialog: MatDialog,
      dialogRef: MatDialogRef<NetworkIdEditComponent>,
      datePipe: DatePipe,
      dataManagerService: DataManagerService
  ) {
    super(data, fb, dialog, dialogRef, datePipe, dataManagerService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.editForm = this.fb.group({
      networkId: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(4),
            Validators.pattern('[0-9a-zA-Z]+([0-9a-zA-Z ]+)*')]],
      effectiveDate: [null, [Validators.required]],
      expirationDate: [null, [Validators.required]],
    }, {validator: this.checkDates});

    if (this.data.editType === 'Update') {
      this.tableData = this.data.tableData;
      this.editForm.get('networkId').setValue(this.tableData.NetworkId);
      this.editForm.get('effectiveDate').setValue(this.tableData.EffectiveDate);
      this.editForm.get('expirationDate').setValue(this.tableData.ExpirationDate);
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
    const formData = new NetworkIDModel();
    if (this.data.editType === 'Update') {
      formData.SequenceNumber = this.tableData.Id;
    }
    formData.NetworkId = this.editForm.get('networkId').value;
    formData.EffectiveDate = this.datePipe.transform(this.editForm.get('effectiveDate').value, 'yyyy-MM-dd');
    formData.ExpirationDate = this.datePipe.transform(this.editForm.get('expirationDate').value, 'yyyy-MM-dd');
    return formData;
  }
}
