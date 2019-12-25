import { Component, Inject, OnInit } from '@angular/core';
import { BaseEditComponent } from '../base-edit/base-edit.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { HomeRoadModel } from '../../models/home-road.model';
import { DatePipe } from '@angular/common';
import { DataManagerService } from '../data-manager.service';

@Component({
  selector: 'app-home-road-edit',
  templateUrl: './home-road-edit.component.html',
  styleUrls: ['./home-road-edit.component.css']
})
export class HomeRoadEditComponent extends BaseEditComponent implements OnInit {

  editForm = new FormGroup({
    equipmentMark: new FormControl(),
    homeRoad: new FormControl(),
    effectiveDate: new FormControl(),
    expirationDate: new FormControl()
  });

  public tableData = new HomeRoadModel();

  constructor(
      @Inject(MAT_DIALOG_DATA) data: any,
      fb: FormBuilder,
      dialog: MatDialog,
      dialogRef: MatDialogRef<HomeRoadEditComponent>,
      datePipe: DatePipe,
      dataManagerService: DataManagerService
  ) {
    super(data, fb, dialog, dialogRef, datePipe, dataManagerService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.editForm = this.fb.group({
      equipmentMark: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(4),
        Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      homeRoad: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(4),
        Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      effectiveDate: [null, [Validators.required]],
      expirationDate: [null, [Validators.required]],
    }, {validator: this.checkDates});

    if (this.data.editType == 'Update') {
      this.tableData = this.data.tableData;
      this.editForm.get('equipmentMark').setValue(this.tableData.MarkInit);
      this.editForm.get('homeRoad').setValue(this.tableData.HomeRoadMark);
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
    const formData = new HomeRoadModel();
    if (this.data.editType === 'Update') {
      formData.SequenceNumber = this.tableData.Id;
    }
    formData.MarkInit = this.editForm.get('equipmentMark').value;
    formData.HomeRoad = this.editForm.get('homeRoad').value;
    formData.EffectiveDate = this.datePipe.transform(this.editForm.get('effectiveDate').value, 'yyyy-MM-dd');
    formData.ExpirationDate = this.datePipe.transform(this.editForm.get('expirationDate').value, 'yyyy-MM-dd');
    return formData;
  }
}
