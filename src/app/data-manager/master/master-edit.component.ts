import {Component, HostListener, Inject, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {BaseEditComponent} from '../base-edit/base-edit.component';
import {MasterModel} from '../../models/master.model';
import {INTERCHAGE_TYPES, REASON_CODES} from '../data-manager.enum';
import {MatDialogRef} from '@angular/material';
import {DataManagerService} from '../data-manager.service';
import {DatePipe} from '@angular/common';
import { messages } from "src/app/shared/messages";
import { AlertService } from "./../../shared/alert/alert.service";
@Component({
  selector: 'app-master-edit',
  templateUrl: './master-edit.component.html',
  styleUrls: ['./master-edit.component.scss']
})
export class MasterEditComponent extends BaseEditComponent implements OnInit {
  channelName = "masterEditChannel";
  editForm = new FormGroup({
    equipmentMark: new FormControl(),
    deliveryCarrier: new FormControl(),
    receivingCarrier: new FormControl(),
    interchangeType: new FormControl(),
    outletSPLC: new FormControl(),
    outletCity: new FormControl(),
    outletState: new FormControl(),
    reasonCode: new FormControl(),
    effectiveDate: new FormControl(),
    expirationDate: new FormControl()
  });

  interchangeTypes = INTERCHAGE_TYPES;
  reasonCodes = REASON_CODES;

  public tableData = new MasterModel();
  public interchangeType: string;
  public reasonCode: string;
  public isBilateral: boolean;
  oldSplcTxt: string;

  constructor(
      @Inject(MAT_DIALOG_DATA) data: any,
      fb: FormBuilder,
      dialog: MatDialog,
      dialogRef: MatDialogRef<MasterEditComponent>,
      datePipe: DatePipe,
      dataManagerService: DataManagerService,
      private alertService: AlertService
  ) {
    super(data, fb, dialog, dialogRef, datePipe, dataManagerService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.editForm = this.fb.group({
      equipmentMark: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(4),
                  Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      deliveryCarrier: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(4),
                  Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      receivingCarrier: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(4),
                  Validators.pattern('[a-zA-Z]+([a-zA-Z ]+)*')]],
      interchangeType: [null, [Validators.required]],
      outletSPLC: [null, [Validators.required, Validators.minLength(9), Validators.maxLength(9),
                  Validators.pattern('[0-9]+([0-9 ]+)*')]],
      outletCity: [],
      outletState: [null, [Validators.minLength(2), Validators.maxLength(4)]],
      reasonCode: [null, [Validators.required]],
      effectiveDate: [null, [Validators.required]],
      expirationDate: [null, [Validators.required]],
    }, {validator: this.checkDates});

    if (this.data.editType === 'Update' || this.data.editType === 'Clone' ) {
      this.tableData = this.data.tableData;
      this.editForm.get('equipmentMark').setValue(this.tableData.MarkInit);
      this.editForm.get('deliveryCarrier').setValue(this.tableData.DeliveringRoad);
      this.editForm.get('receivingCarrier').setValue(this.tableData.ReceivingRoad);
      this.editForm.get('interchangeType').setValue(this.tableData.InterchangeType);
      this.editForm.get('outletSPLC').setValue(this.tableData.Splc);
      this.editForm.get('outletCity').setValue(this.tableData.City);
      this.editForm.get('outletState').setValue(this.tableData.State);
      this.editForm.get('reasonCode').setValue(this.tableData.ReasonCode);
      if (this.data.editType === 'Update') {
        this.editForm.get('effectiveDate').setValue(this.tableData.EffectiveDate);
        this.minDate = this.editForm.get('effectiveDate').value;
      } else {
        this.editForm.get('effectiveDate').setValue(this.minDate);
        this.editForm.get('outletCity').disable();
        this.editForm.get('outletState').disable();
      }
      this.editForm.get('expirationDate').setValue(this.tableData.ExpirationDate);
    } else {
      // Set init form default
      this.editForm.get('interchangeType').setValue('N');
      this.editForm.get('reasonCode').setValue(1);
      this.editForm.get('effectiveDate').setValue(this.minDate);
      this.editForm.get('expirationDate').setValue(this.maxDate);
      this.editForm.get('outletCity').disable();
      this.editForm.get('outletState').disable();
    }
    this.canChangeEffectiveDate = true;
  }

  formChanged() {
    super.formChanged();
  }

  callCancelDialog(event) {
    super.onCancelDialog(this.editForm);
  }

  onChangeInterchangeTypes(interchangeType: object) {
    if (this.editForm.get('interchangeType').value === 'B') {
      this.isBilateral = true;
      this.oldSplcTxt = this.editForm.get('outletSPLC').value;
      this.editForm.get('outletSPLC').setValue('999999999');
      this.editForm.get('outletSPLC').enable();
      this.editForm.get('outletCity').enable();
      this.editForm.get('outletState').enable();
      this.editForm.get('outletCity').setValidators([Validators.required]);
      this.editForm.get('outletState').setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(4)]);
    } else {
      this.isBilateral = false;
      this.editForm.get('outletSPLC').enable();
      if (this.data.editType === 'Add') {
        this.editForm.get('outletCity').disable();
        this.editForm.get('outletState').disable();
      }
      this.editForm.get('outletCity').clearValidators();
      this.editForm.get('outletState').clearValidators();
      if (this.editForm.get('outletSPLC').value === '999999999') {
        this.editForm.get('outletSPLC').setValue(this.oldSplcTxt);
      }
    }
    this.editForm.get('outletCity').updateValueAndValidity();
    this.editForm.get('outletState').updateValueAndValidity();
  }

  onChangeReasonCodes(reasonCode: object) {
 
  }

  onClone() {
    const dialogRef = this.dialog.open(MasterEditComponent, {
      id: this.tableConfig.DbTableName + '_ADD',
      width: '1024px',
      position: {top: '100px'},
      disableClose: true,
      data: {
        editType: 'Clone',
        tableConfig: this.tableConfig,
        tableData: this.tableData,
      }
    });
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
    const formData = new MasterModel();
    if (this.data.editType === 'Update') {
      formData.SequenceNumber = this.tableData.Id;
    }
    formData.Mark = this.editForm.get('equipmentMark').value;
    formData.DeliveringRoad = this.editForm.get('deliveryCarrier').value;
    formData.ReceivingRoad = this.editForm.get('receivingCarrier').value;
    formData.InterchangeType = this.editForm.get('interchangeType').value;
    formData.Splc = this.editForm.get('outletSPLC').value;
    formData.ReasonCode = this.editForm.get('reasonCode').value;
    formData.EffectiveDate = this.datePipe.transform(this.editForm.get('effectiveDate').value, 'yyyy-MM-dd');
    formData.ExpirationDate = this.datePipe.transform(this.editForm.get('expirationDate').value, 'yyyy-MM-dd');
    formData.CityName = this.editForm.get('outletCity').value;
    formData.StateName = this.editForm.get('outletState').value;
    return formData;
  }

  onRevert() {
    const dialogConfirmRef = this.getConfirmRevertDialog();
    dialogConfirmRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        const sendData = {
          'SequenceNumber': this.tableData.Id
        };
        this.dataManagerService.revertMasterDraftData(this.tableConfig, sendData).subscribe (
            data => {
              this.handlePostDataRespond(data, this.editForm);
            },
            error => {
              console.log('Error', error);
            }
        );
      }
    });
  }

  isMasterDraft() {
    return this.tableConfig.DbTableName === 'SCO_MASTER_DRAFT';
  }
}
