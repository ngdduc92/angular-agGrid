import {Component, HostListener, Inject, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {BaseEditComponent} from '../base-edit/base-edit.component';
import {MatDialogRef} from '@angular/material';
import {DatePipe} from '@angular/common';
import {DataManagerService} from '../data-manager.service';
import {JointIndustryPairModel} from '../../models/joint-industry-pair.model';
import { messages } from "src/app/shared/messages";
import { AlertService } from "./../../shared/alert/alert.service";

@Component({
  selector: 'app-joint-industry-pair-edit',
  templateUrl: './joint-industry-pair-edit.component.html',
  styleUrls: ['./joint-industry-pair-edit.component.css']
})
export class JointIndustryPairEditComponent extends BaseEditComponent implements OnInit {
  channelName = "jointIndustryPairEditChannel";
  editForm = new FormGroup({
    markInit: new FormControl(),
    markFamily: new FormControl(),
    effectiveDate: new FormControl(),
    expirationDate: new FormControl()
  });

  public tableData = new JointIndustryPairModel();

  constructor(
      @Inject(MAT_DIALOG_DATA) data: any,
      fb: FormBuilder,
      dialog: MatDialog,
      dialogRef: MatDialogRef<JointIndustryPairEditComponent>,
      datePipe: DatePipe,
      dataManagerService: DataManagerService,
      private alertService: AlertService

  ) {
    super(data, fb, dialog, dialogRef, datePipe, dataManagerService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.editForm = this.fb.group({
      jointRoad1: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(4),
                  Validators.pattern('[0-9a-zA-Z]+([0-9a-zA-Z ]+)*')]],
      jointRoad2: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(4),
                  Validators.pattern('[0-9a-zA-Z]+([0-9a-zA-Z ]+)*')]],
      jointSPLC: [null, [Validators.required, Validators.minLength(9), Validators.maxLength(9),
                          Validators.pattern('[0-9]+([0-9 ]+)*')]],
      effectiveDate: [null, [Validators.required]],
      expirationDate: [null, [Validators.required]],
    }, {validator: this.checkDates});

    if (this.data.editType === 'Update') {
      this.tableData = this.data.tableData;
      this.editForm.get('jointRoad1').setValue(this.tableData.JointRoad1);
      this.editForm.get('jointRoad2').setValue(this.tableData.JointRoad2);
      this.editForm.get('jointSPLC').setValue(this.tableData.JointSplc);
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
    const formData = new JointIndustryPairModel();
    if (this.data.editType === 'Update') {
      formData.SequenceNumber = this.tableData.Id;
    }
    formData.JointRoad1 = this.editForm.get('jointRoad1').value;
    formData.JointRoad2 = this.editForm.get('jointRoad2').value;
    formData.JointSplc = this.editForm.get('jointSPLC').value;
    formData.EffectiveDate = this.datePipe.transform(this.editForm.get('effectiveDate').value, 'yyyy-MM-dd');
    formData.ExpirationDate = this.datePipe.transform(this.editForm.get('expirationDate').value, 'yyyy-MM-dd');
    return formData;
  }
}
