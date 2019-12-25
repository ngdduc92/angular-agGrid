import {Component, HostListener, Inject, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {BaseEditComponent} from '../base-edit/base-edit.component';
import {MatDialogRef} from '@angular/material';
import {DatePipe} from '@angular/common';
import {ConnectModel} from '../../models/connect.model';
import {CarmarkModel} from '../../models/carmark.model';
import {DataManagerService} from '../data-manager.service';
import { messages } from "src/app/shared/messages";
import { AlertService } from "./../../shared/alert/alert.service";

@Component({
  selector: 'app-carmark-edit',
  templateUrl: './carmark-edit.component.html',
  styleUrls: ['./carmark-edit.component.css']
})

export class CarmarkEditComponent extends BaseEditComponent implements OnInit {
  channelName = "carmarkEditChannel";

  editForm = new FormGroup({
    markInit: new FormControl(),
    markFamily: new FormControl(),
    effectiveDate: new FormControl(),
    expirationDate: new FormControl()
  });

  public tableData = new CarmarkModel();

  constructor(
      @Inject(MAT_DIALOG_DATA) data: any,
      fb: FormBuilder,
      dialog: MatDialog,
      dialogRef: MatDialogRef<CarmarkEditComponent>,
      datePipe: DatePipe,
      dataManagerService: DataManagerService,
      private alertService: AlertService
  ) {
    super(data, fb, dialog, dialogRef, datePipe, dataManagerService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.editForm = this.fb.group({
      markInit: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(4),
          Validators.pattern('[0-9a-zA-Z]+([0-9a-zA-Z ]+)*')]],
      markFamily: [null, [Validators.minLength(2), Validators.maxLength(4),
          Validators.pattern('[0-9a-zA-Z]+([0-9a-zA-Z ]+)*')]],
      effectiveDate: [null, [Validators.required]],
      expirationDate: [null, [Validators.required]],
    }, {validator: this.checkDates});

    if (this.data.editType === 'Update') {
      this.tableData = this.data.tableData;
      this.editForm.get('markInit').setValue(this.tableData.MarkInit);
      this.editForm.get('markFamily').setValue(this.tableData.MarkFamily);
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
    const formData = new CarmarkModel();
    if (this.data.editType === 'Update') {
      formData.SequenceNumber = this.tableData.Id;
    }
    formData.MarkInit = this.editForm.get('markInit').value;
    formData.MarkFamily = this.editForm.get('markFamily').value ? this.editForm.get('markFamily').value : '';
    formData.EffectiveDate = this.datePipe.transform(this.editForm.get('effectiveDate').value, 'yyyy-MM-dd');
    formData.ExpirationDate = this.datePipe.transform(this.editForm.get('expirationDate').value, 'yyyy-MM-dd');
    return formData;
  }
}
