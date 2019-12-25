import {Component, Inject, OnInit} from '@angular/core';
import {BaseEditComponent} from '../base-edit/base-edit.component';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {DatePipe} from '@angular/common';
import {DataManagerService} from '../data-manager.service';
import {ErrorMessages, FIELD_TO_EDIT, REASON_CODES, WarningMessages} from '../data-manager.enum';
import {ConfirmationDialogComponent} from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-master-draft-mass-edit',
  templateUrl: './master-draft-mass-edit.component.html',
  styleUrls: ['./master-draft-mass-edit.component.css']
})
export class MasterDraftMassEditComponent extends BaseEditComponent implements OnInit {
  editForm = new FormGroup({
    fieldToEdit: new FormControl(),
    newValue: new FormControl(),
    reasonCode: new FormControl(),
    effectiveDate: new FormControl(),
    expirationDate: new FormControl()
  });

  reasonCodes = REASON_CODES;
  fieldsToEdit = FIELD_TO_EDIT;
  rowData: any = [];
  isLoading = false;
  mainResult = '';
  errorText = '';
  errorMessages: ErrorMessages[];
  
  @BlockUI() blockUI: NgBlockUI;
  constructor(
      @Inject(MAT_DIALOG_DATA) data: any,
      fb: FormBuilder,
      dialog: MatDialog,
      dialogRef: MatDialogRef<MasterDraftMassEditComponent>,
      datePipe: DatePipe,
      dataManagerService: DataManagerService
  ) {
    super(data, fb, dialog, dialogRef, datePipe, dataManagerService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.rowData = this.data.rowData;
    this.editForm = this.fb.group({
      fieldToEdit: [],
      newValue: [null, [Validators.required, Validators.pattern('[A-Z]+([A-Z ]+)*')]],
      reasonCode: [null, [Validators.required]],
      effectiveDate: [null, [Validators.required]],
      expirationDate: [null, [Validators.required]],
    }, {validator: this.checkDates});

    this.editForm.get('fieldToEdit').setValue('None');
    this.editForm.get('newValue').disable();
    this.editForm.get('reasonCode').setValue(5);
    this.editForm.get('effectiveDate').setValue(this.minDate);
    this.editForm.get('expirationDate').setValue(this.maxDate);
  }

  public onCancelDialog() {
    super.onCancelDialog(this.editForm);
  }

  onChangefieldsEdit(fieldEdit: object) {
    this.editForm.get('newValue').enable();
    this.editForm.get('reasonCode').enable();
    this.editForm.get('effectiveDate').enable();
    this.editForm.get('expirationDate').enable();
    if (this.editForm.get('fieldToEdit').value === 'None') {
      this.editForm.get('newValue').disable();
    } else if (this.editForm.get('fieldToEdit').value === 'MassExpire') {
      this.editForm.get('newValue').disable();
      this.editForm.get('effectiveDate').disable();
    } else if (this.editForm.get('fieldToEdit').value === 'MassRevert') {
      this.editForm.get('newValue').disable();
      this.editForm.get('reasonCode').disable();
      this.editForm.get('effectiveDate').disable();
      this.editForm.get('expirationDate').disable();
    }
  }
  onChangeReasonCodes(reasonCode: object) {

  }
  onSubmit() {
    if (this.editForm.invalid) {
      return;
    }

    const dialogConfirmRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        dialogType: 'warning',
        title: 'Large Record Set Warning',
        message: 'Warning: you are about to modify ' + this.rowData.length + ' records.  Continue?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });
    dialogConfirmRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.isAlertSuccess = false;
        this.isLoading = true;
        this.blockUI.noOpen = true;
        const sendData = {
          'Ids': this.getTableDataIds(),
          'FieldName': this.editForm.get('fieldToEdit').value,
          'FieldValue': this.editForm.get('newValue').value ? this.editForm.get('newValue').value : '',
          'ReasonCode': this.editForm.get('reasonCode').value,
          'EffectiveDate': this.datePipe.transform(this.editForm.get('effectiveDate').value, 'yyyy-MM-dd'),
          'ExpirationDate': this.datePipe.transform(this.editForm.get('expirationDate').value, 'yyyy-MM-dd')
        };
        this.dataManagerService.massUpdate(this.tableConfig, sendData).subscribe (
            data => {
              this.handleMassUpdateRespond(data);
            },
            error => {
              console.log('Error', error);
            }
        );
      }
    });
  }

  handleMassUpdateRespond(data) {
    this.isAlertSuccess = true;
    this.isLoading = false;
    const errorArray = [];
    let numResults = 0;
    if (data && data.RecordContainer) {
      data.RecordContainer.forEach(recordContainer => {
        if ('Errors' in recordContainer && recordContainer.Errors != null) {
          recordContainer.Errors.Error.forEach(error => {
            error.ErrorDescription = recordContainer.Record.Id + ': ' + error.ErrorDescription;
            errorArray.push(error);
          });
        }
        numResults++;
      });
    }

    this.mainResult = numResults + ' record' + (numResults == 1 ? ' has' : 's have' ) + ' been modified.';
    this.errorText = (errorArray.length > 0 ? errorArray.length : 'No') + ' validation error' +
        (errorArray.length === 1 ? ' was found:' : 's were found.') ;
    this.errorMessages = errorArray as ErrorMessages[];

  }

  onCancel() {
    this.dialogRef.close();
  }
  getTableDataIds() {
    return this.rowData.map(rowItem => {
       return rowItem['Id'];
    });
  }
}
