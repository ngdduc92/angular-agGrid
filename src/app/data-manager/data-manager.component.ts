import {Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { MasterEditComponent } from './master/master-edit.component';
import { DataManagerService } from './data-manager.service';
import {MasterModel} from '../models/master.model';
import {DATA_MANAGER_MESSAGES, PAGINATION_CONFIGS, REASON_CODES} from './data-manager.enum';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Observable, forkJoin} from 'rxjs';
import {CarmarkModel} from '../models/carmark.model';
import {JointIndustryPairModel} from '../models/joint-industry-pair.model';
import {ExceptionPoolModel} from '../models/exception-pool.model';
import {FamilyRoadModel} from '../models/family-road.model';
import {CtnComboModel} from '../models/ctn-combo.model';
import {ConnectModel} from '../models/connect.model';
import {NetworkIDModel} from '../models/network-id.model';
import {NoInterchangeReportingRoadModel} from '../models/no-interchange-reporting-road.model';
import {NoReleaseReportingRoad} from '../models/no-release-reporting-road.model';
import {ParticipantsModel} from '../models/participants.model';
import {RateModel} from '../models/rate.model';
import {HomeRoadModel} from '../models/home-road.model';
import {TableConfigModel} from '../models/table-config.model';
import {DatePipe} from '@angular/common';
import {JointIndustryPairEditComponent} from './joint-industry-pair-edit/joint-industry-pair-edit.component';
import {ExceptionPoolEditComponent} from './exception-pool-edit/exception-pool-edit.component';
import {CarmarkEditComponent} from './carmark-edit/carmark-edit.component';
import {FamilyRoadEditComponent} from './family-road-edit/family-road-edit.component';
import {CtnComboEditComponent} from './ctn-combo-edit/ctn-combo-edit.component';
import {ConnectEditComponent} from './connect-edit/connect-edit.component';
import {NetworkIdEditComponent} from './network-id-edit/network-id-edit.component';
import {NoInterchangeReportingRoadEditComponent} from './no-interchange-reporting-road-edit/no-interchange-reporting-road-edit.component';
import {NoReleaseReportingRoadEditComponent} from './no-release-reporting-road-edit/no-release-reporting-road-edit.component';
import {ParticipantsEditComponent} from './participants-edit/participants-edit.component';
import {RateEditComponent} from './rate-edit/rate-edit.component';
import {HomeRoadEditComponent} from './home-road-edit/home-road-edit.component';
import {ConfirmationDialogComponent} from '../shared/confirmation-dialog/confirmation-dialog.component';
import {MasterDraftMassEditComponent} from './master-draft-mass-edit/master-draft-mass-edit.component';
import {MasterDraftValidationResultComponent} from './master-draft-validation-result/master-draft-validation-result.component';
import {MasterDraftRefreshDataComponent} from './master-draft-refresh-data/master-draft-refresh-data.component';
import {IGetRowsParams} from 'ag-grid-community';



@Component({
  selector: 'app-data-manager',
  templateUrl: './data-manager.component.html',
  styleUrls: ['./data-manager.component.scss'],
  providers: [DatePipe]
})
export class DataManagerComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  tableConfig = new FormGroup({
    tableConfigName: new FormControl()
  });
  tableConfigNames: any = [];
  selectedConfigTable;

  @ViewChild('my-grid') agGrid;
  private gridApi: any;
  private gridColumnApi: any;

  gridOptions = {
    defaultColDef: {
      sortable: true,
      filter: true,
      resizable: true,
      enableTooltip : true,
      width: 260,
      tooltipFieldContainsDots: true,
      //tooltipValueGetter: (params) => params.value,
    },
    getRowClass : function(params) {
      if (params.node.rowIndex % 2 === 0) {
        return 'grid-row-alternate';
      }
    },
    animateRows: true,
    rowSelection: 'single',
    suppressAutoSize: true,
    pagination: true,
    paginationPageSize: PAGINATION_CONFIGS.pageSize,
    paginationAutoPageSize: PAGINATION_CONFIGS.paginationAutoPageSize
  };

  columnDefs = [];

  rowData: any = [];

  printData: any = [];
  headerPrintData: any = [];
  isPrinting: boolean = false;

  style = {
    width: '100%',
    height: '100%',
    boxSizing: 'border-box'
  };
  isFresh = false;
  filterModel = null;
  rowsCountString = '';
  public messageEnum = DATA_MANAGER_MESSAGES;

  constructor(
      private dataManagerService: DataManagerService,
      public dialog: MatDialog,
      private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.dataManagerService.getAppConfigs().subscribe((data) => {
      let appConfig = data as TableConfigModel[];
      // Replace for new context, this will delete after
      appConfig = appConfig.map(configItem => {
        if (configItem.UrlView) configItem.UrlView = configItem.UrlView.replace('/sco90/services', this.dataManagerService.SERVER_CONTEXT_PATH);
        if (configItem.UrlAdd) configItem.UrlAdd = configItem.UrlAdd.replace('/sco90/services', this.dataManagerService.SERVER_CONTEXT_PATH);
        if (configItem.UrlUpdate) configItem.UrlUpdate = configItem.UrlUpdate.replace('/sco90/services', this.dataManagerService.SERVER_CONTEXT_PATH);
        if (configItem.UrlExpire) configItem.UrlExpire = configItem.UrlExpire.replace('/sco90/services', this.dataManagerService.SERVER_CONTEXT_PATH);
        return configItem;
      });
      this.tableConfigNames = appConfig.sort((a, b) => a.DisplayOrder - b.DisplayOrder);
    });
  }

  onChangeTableConfigName(tableConfig: TableConfigModel, isFresh= false) {
    if (this.selectedConfigTable && this.selectedConfigTable.DbTableName === tableConfig.DbTableName && !isFresh) {
      return;
    }
    this.selectedConfigTable = tableConfig;
    this.rowData = null;
    this.columnDefs = this.getTableColumnDef(tableConfig);

    switch (this.selectedConfigTable.DbTableName) {
      case 'SCO_MASTER':
        this.getMasterData(tableConfig);
        break;
      case 'SCO_MASTER_DRAFT':
        this.getMasterData(tableConfig);
        break;
      case 'SCO_JOINT_INDPAIRS':
        this.dataManagerService.getTableData(tableConfig).subscribe((data: JointIndustryPairModel[]) => {
          this.rowData = data;
        });
        break;
      case 'SCO_EXCEPTION_POOL':
        this.dataManagerService.getTableData(tableConfig).subscribe((data: ExceptionPoolModel[]) => {
          this.rowData = this.applyTypeCodeDisplay(data);
        });
        break;
      case 'SCO_CARMARKS':
        this.dataManagerService.getTableData(tableConfig).subscribe((data: CarmarkModel[]) => {
          this.rowData = data;
        });
        break;
      case 'SCO_FAMILY_ROADS':
        this.dataManagerService.getTableData(tableConfig).subscribe((data: FamilyRoadModel[]) => {
          this.rowData = data;
        });
        break;
      case 'SCO_CTN_COMBO':
        this.dataManagerService.getTableData(tableConfig).subscribe((data: CtnComboModel[]) => {
          this.rowData = data;
        });
        break;
      case 'SCO_CONNECTS':
        this.dataManagerService.getTableData(tableConfig).subscribe((data: ConnectModel[]) => {
          this.rowData = data;
        });
        break;
      case 'SCO_NETWORK_ID':
        this.dataManagerService.getTableData(tableConfig).subscribe((data: NetworkIDModel[]) => {
          this.rowData = data;
        });
        break;
      case 'SCO_NOINCH_REPT':
        this.dataManagerService.getTableData(tableConfig).subscribe((data: NoInterchangeReportingRoadModel[]) => {
          this.rowData = data;
        });
        break;
      case 'SCO_NORLSE_REPT':
        this.dataManagerService.getTableData(tableConfig).subscribe((data: NoReleaseReportingRoad[]) => {
          this.rowData = data;
        });
        break;
      case 'SCO_PARTICIPANT':
        this.dataManagerService.getTableData(tableConfig).subscribe((data: ParticipantsModel[]) => {
          this.rowData = data;
        });
        break;
      case 'SCO_RATE':
        this.dataManagerService.getTableData(tableConfig).subscribe((data: RateModel[]) => {
          this.rowData = data;
        });
        break;
      case 'SCO_HOME_ROAD':
        this.dataManagerService.getTableData(tableConfig).subscribe((data: HomeRoadModel[]) => {
          this.rowData = data;
        });
        break;
      default:
        break;
    }
  }

  getMasterData(tableConfig) {
    const masterReasonCodes = this.dataManagerService.getMasterReasonCodes();
    const masterData = this.dataManagerService.getTableData(tableConfig);
    forkJoin([masterReasonCodes, masterData]).subscribe(results => {
      // results[0] is our masterReasonCodes
      // results[1] is our masterData
      this.rowData = (results[1] as MasterModel[]).map(masterItem => {
        masterItem.ChangeReason = results[0] [masterItem.ReasonCode];
        return masterItem;
      });
    });
  }

  getTableColumnDef(tableConfig) {
    let columnDefs = [];
    switch (tableConfig.DbTableName) {
      case 'SCO_MASTER':
        columnDefs = [
          {headerName: 'Equipment Mark', field: 'MarkInit', colId: 'MarkInit', width: 136},
          {headerName: 'Delivery Carrier', field: 'DeliveringRoad', colId: 'DeliveringRoad', width: 133},
          {headerName: 'Receiving Carrier', field: 'ReceivingRoad', colId: 'ReceivingRoad', width: 139},
          {headerName: 'I/C Type', field: 'InterchangeType', colId: 'InterchangeType', width: 87},
          {headerName: 'Outlet SPLC', field: 'Splc', colId: 'Splc', width: 112},
          {headerName: 'Outlet City', field: 'City', colId: 'City', width: 158},
          {headerName: 'Outlet State', field: 'State', colId: 'State', width: 112},
          {headerName: 'Effective Date', field: 'EffectiveDate', colId: 'EffectiveDate', width: 123},
          {headerName: 'Expiration Date', field: 'ExpirationDate', colId: 'ExpirationDate', width: 131},
          {headerName: 'Last Modified Date', field: 'UpdateTimestamp', colId: 'UpdateTimestamp', width: 150},
          {headerName: 'Reason Code', field: 'ReasonCode', hide : true},
          {headerName: 'Change Reason', field: 'ChangeReason', colId: 'ChangeReason', width: 480}
        ];
        break;
      case 'SCO_MASTER_DRAFT':
        columnDefs = [
          {headerName: 'Id', field: 'Id', colId: 'Id', width: 90},
          {headerName: 'Equipment Mark', field: 'MarkInit', colId: 'MarkInit', width: 136},
          {headerName: 'Delivery Carrier', field: 'DeliveringRoad', colId: 'DeliveringRoad', width: 133},
          {headerName: 'Receiving Carrier', field: 'ReceivingRoad', colId: 'ReceivingRoad', width: 139},
          {headerName: 'I/C Type', field: 'InterchangeType', colId: 'InterchangeType', width: 87},
          {headerName: 'Outlet SPLC', field: 'Splc', colId: 'Splc', width: 112},
          {headerName: 'Outlet City', field: 'City', colId: 'City', width: 158},
          {headerName: 'Outlet State', field: 'State', colId: 'State', width: 112},
          {headerName: 'Effective Date', field: 'EffectiveDate', colId: 'EffectiveDate', width: 123},
          {headerName: 'Expiration Date', field: 'ExpirationDate', colId: 'ExpirationDate', width: 131},
          {headerName: 'Last Modified Date', field: 'UpdateTimestamp', colId: 'UpdateTimestamp', width: 150},
          {headerName: 'Reason Code', field: 'ReasonCode', colId: 'ReasonCode', hide : true},
          {headerName: 'Change Reason', field: 'ChangeReason', colId: 'ChangeReason', width: 480}
        ];
        break;
      case 'SCO_JOINT_INDPAIRS':
        columnDefs = [
          {headerName: 'Carrier 1', field: 'JointRoad1', colId: 'JointRoad1', width: 130},
          {headerName: 'Joint SPLC', field: 'JointSplc', colId: 'JointSplc', width: 180},
          {headerName: 'Carrier 2', field: 'JointRoad2', colId: 'JointRoad2', width: 150},
          {headerName: 'Effective Date', field: 'EffectiveDate', colId: 'EffectiveDate', width: 200},
          {headerName: 'Expiration Date', field: 'ExpirationDate', colId: 'ExpirationDate', width: 200},
          {headerName: 'Last Modified Date', field: 'UpdateTimestamp', colId: 'UpdateTimestamp', width: 200},
        ];
        break;
      case 'SCO_EXCEPTION_POOL':
        columnDefs = [
          {headerName: 'Exception Pool', field: 'ExceptionPool', colId: 'ExceptionPool', width: 130},
          {headerName: 'Operator', field: 'Owner', colId: 'Owner', width: 115},
          {headerName: 'Pool Type', field: 'TypeCode', colId: 'TypeCode', width: 120},
          {headerName: 'Description', field: 'Description', colId: 'Description', width: 200},
          {headerName: 'Effective Date', field: 'EffectiveDate', colId: 'EffectiveDate', width: 160},
          {headerName: 'Expiration Date', field: 'ExpirationDate', colId: 'ExpirationDate', width: 160},
          {headerName: 'Last Modified Date', field: 'UpdateTimestamp', colId: 'UpdateTimestamp', width: 160},
        ];
        break;
      case 'SCO_CARMARKS':
        columnDefs = [
          {headerName: 'Road Mark', field: 'MarkInit', colId: 'MarkInit', width: 220},
          {headerName: 'Owner Mark', field: 'MarkFamily', colId: 'MarkFamily', width: 220},
          {headerName: 'Effective Date', field: 'EffectiveDate', colId: 'EffectiveDate', width: 200},
          {headerName: 'Expiration Date', field: 'ExpirationDate', colId: 'ExpirationDate', width: 200},
          {headerName: 'Last Modified Date', field: 'UpdateTimestamp', colId: 'UpdateTimestamp', width: 200},
        ];
        break;
      case 'SCO_FAMILY_ROADS':
        columnDefs = [
          {headerName: 'Equipment Mark', field: 'RoadMark', colId: 'RoadMark', width: 220},
          {headerName: 'Owner Mark', field: 'OwnerIdentifier', colId: 'OwnerIdentifier', width: 220},
          {headerName: 'Effective Date', field: 'EffectiveDate', colId: 'EffectiveDate', width: 200},
          {headerName: 'Expiration Date', field: 'ExpirationDate', colId: 'ExpirationDate', width: 200},
          {headerName: 'Last Modified Date', field: 'UpdateTimestamp', colId: 'UpdateTimestamp', width: 200},
        ];
        break;
      case 'SCO_CTN_COMBO':
        columnDefs = [
          {headerName: 'Road Mark', field: 'MarkInit', colId: 'MarkInit', width: 150},
          {headerName: 'Owner Mark', field: 'MarkFamily', colId: 'MarkFamily', width: 150},
          {headerName: 'Trade Name / Home Road', field: 'OwnerIdentifier', colId: 'OwnerIdentifier', width: 200},
          {headerName: 'Effective Date', field: 'EffectiveDate', colId: 'EffectiveDate', width: 180},
          {headerName: 'Expiration Date', field: 'ExpirationDate', colId: 'ExpirationDate', width: 180},
          {headerName: 'Last Modified Date', field: 'UpdateTimestamp', colId: 'UpdateTimestamp', width: 180},
        ];
        break;
      case 'SCO_CONNECTS':
        columnDefs = [
          {headerName: 'Connecting Carrier 1', field: 'Carrier1', colId: 'Carrier1', width: 220},
          {headerName: 'Connecting Carrier 2', field: 'Carrier2', colId: 'Carrier2', width: 220},
          {headerName: 'Effective Date', field: 'EffectiveDate', colId: 'EffectiveDate', width: 200},
          {headerName: 'Expiration Date', field: 'ExpirationDate', colId: 'ExpirationDate', width: 200},
          {headerName: 'Last Modified Date', field: 'UpdateTimestamp', colId: 'UpdateTimestamp', width: 200},
        ];
        break;
      case 'SCO_NETWORK_ID':
        columnDefs = [
          {headerName: 'Network ID', field: 'NetworkId', colId: 'NetworkId'},
          {headerName: 'Effective Date', field: 'EffectiveDate', colId: 'EffectiveDate'},
          {headerName: 'Expiration Date', field: 'ExpirationDate', colId: 'ExpirationDate'},
          {headerName: 'Last Modified Date', field: 'UpdateTimestamp', colId: 'UpdateTimestamp'},
        ];
        break;
      case 'SCO_NOINCH_REPT':
        columnDefs = [
          {headerName: 'Equipment Mark', field: 'Mark', colId: 'Mark', width: 220},
          {headerName: 'Interchange Carrier', field: 'InterchangeRoad', colId: 'InterchangeRoad', width: 220},
          {headerName: 'Effective Date', field: 'EffectiveDate', colId: 'EffectiveDate', width: 200},
          {headerName: 'Expiration Date', field: 'ExpirationDate', colId: 'ExpirationDate', width: 200},
          {headerName: 'Last Modified Date', field: 'UpdateTimestamp', colId: 'UpdateTimestamp', width: 200},
        ];
        break;
      case 'SCO_NORLSE_REPT':
        columnDefs = [
          {headerName: 'Short Line Carrier', field: 'ShortLine', colId: 'ShortLine', width: 220},
          {headerName: 'Linehaul Carrier', field: 'TrunkLine', colId: 'TrunkLine', width: 220},
          {headerName: 'Effective Date', field: 'EffectiveDate', colId: 'EffectiveDate', width: 200},
          {headerName: 'Expiration Date', field: 'ExpirationDate', colId: 'ExpirationDate', width: 200},
          {headerName: 'Last Modified Date', field: 'UpdateTimestamp', colId: 'UpdateTimestamp', width: 200},
        ];
        break;
      case 'SCO_PARTICIPANT':
        columnDefs = [
          {headerName: 'Participant Carrier', field: 'Participant', colId: 'Participant'},
          {headerName: 'Effective Date', field: 'EffectiveDate', colId: 'EffectiveDate'},
          {headerName: 'Expiration Date', field: 'ExpirationDate', colId: 'ExpirationDate'},
          {headerName: 'Last Modified Date', field: 'UpdateTimestamp', colId: 'UpdateTimestamp'},
        ];
        break;
      case 'SCO_RATE':
        columnDefs = [
          {headerName: 'Quarterly Rate', field: 'Rate', colId: 'Rate'},
          {headerName: 'Effective Date', field: 'EffectiveDate', colId: 'EffectiveDate'},
          {headerName: 'Expiration Date', field: 'ExpirationDate', colId: 'ExpirationDate'},
          {headerName: 'Last Modified Date', field: 'UpdateTimestamp', colId: 'UpdateTimestamp'},
        ];
        break;
      case 'SCO_HOME_ROAD':
        columnDefs = [
          {headerName: 'Equipment Mark', field: 'MarkInit', colId: 'MarkInit', width: 220},
          {headerName: 'Home Road', field: 'HomeRoadMark', colId: 'HomeRoadMark', width: 220},
          {headerName: 'Effective Date', field: 'EffectiveDate', colId: 'EffectiveDate', width: 200},
          {headerName: 'Expiration Date', field: 'ExpirationDate', colId: 'ExpirationDate', width: 200},
          {headerName: 'Last Modified Date', field: 'UpdateTimestamp', colId: 'UpdateTimestamp', width: 200},
        ];
        break;
      default:
        break;
    }
    return columnDefs;
  }

  onRowClicked(event) {
    if (this.hasUpdate()) {
      this.openFormDialog({
        id: this.selectedConfigTable.DbTableName + "_UPDATE",
        width: '1024px',
        disableClose: true,
        data: {
          editType: 'Update',
          tableData: event.data,
          tableConfig: this.selectedConfigTable
        }
      });
    }
  }

  addNewRecord() {
    if (this.hasAdd()) {
      this.openFormDialog({
        id: this.selectedConfigTable.DbTableName + "_ADD",
        width: '1024px',
        disableClose: true,
        hasBackdrop: true,
        data: {
          editType: 'Add',
          tableConfig: this.selectedConfigTable
        }
      });
    }
  }
  openFormDialog(dialogConfig) {
    let dialogRef;
    switch (this.selectedConfigTable.DbTableName) {
      case 'SCO_MASTER':
        dialogRef = this.dialog.open(MasterEditComponent, dialogConfig);
        break;
      case 'SCO_MASTER_DRAFT':
        dialogRef = this.dialog.open(MasterEditComponent, dialogConfig);
        break;
      case 'SCO_JOINT_INDPAIRS':
        dialogRef = this.dialog.open(JointIndustryPairEditComponent, dialogConfig);
        break;
      case 'SCO_EXCEPTION_POOL':
        dialogRef = this.dialog.open(ExceptionPoolEditComponent, dialogConfig);
        break;
      case 'SCO_CARMARKS':
        dialogRef = this.dialog.open(CarmarkEditComponent, dialogConfig);
        break;
      case 'SCO_FAMILY_ROADS':
        dialogRef = this.dialog.open(FamilyRoadEditComponent, dialogConfig);
        break;
      case 'SCO_CTN_COMBO':
        dialogRef = this.dialog.open(CtnComboEditComponent, dialogConfig);
        break;
      case 'SCO_CONNECTS':
        dialogRef = this.dialog.open(ConnectEditComponent, dialogConfig);
        break;
      case 'SCO_NETWORK_ID':
        dialogRef = this.dialog.open(NetworkIdEditComponent, dialogConfig);
        break;
      case 'SCO_NOINCH_REPT':
        dialogRef = this.dialog.open(NoInterchangeReportingRoadEditComponent, dialogConfig);
        break;
      case 'SCO_NORLSE_REPT':
        dialogRef = this.dialog.open(NoReleaseReportingRoadEditComponent, dialogConfig);
        break;
      case 'SCO_PARTICIPANT':
        dialogRef = this.dialog.open(ParticipantsEditComponent, dialogConfig);
        break;
      case 'SCO_RATE':
        dialogRef = this.dialog.open(RateEditComponent, dialogConfig);
        break;
      case 'SCO_HOME_ROAD':
        dialogRef = this.dialog.open(HomeRoadEditComponent, dialogConfig);
        break;
      default:
        break;
    }
    const sub = dialogRef.componentInstance.onSuccessEvent.subscribe(() => {
      this.isFresh = true;
      this.onChangeTableConfigName(this.selectedConfigTable, true);
    });
  }

  exportXLS() {
    if (this.rowData && this.selectedConfigTable){
      const filename = this.selectedConfigTable.DisplayName.replace(/ /g, '-') + '-'
          + this.datePipe.transform(new Date(), 'yyyy-MM-dd') + '.xls';
      const params = {
        allColumns : true,
        fileName: filename,
        columnSeparator: ',',
      };
      this.gridApi.exportDataAsCsv(params);
    }

  }

  printDataTable () {
    let that = this;
    that.isPrinting = true;
    setTimeout(function() {
      print();
    }, 0);

    setTimeout(function() {
      that.isPrinting = false;
    }, 0);
  }
  
  refreshAllData() {
    const dialogRef = this.dialog.open(MasterDraftRefreshDataComponent, {
      id:  'MASTER_DRADT_MASS_EDIT',
      width: '600px',
      disableClose: true,
      hasBackdrop: true,
      data: {
        tableConfig: this.selectedConfigTable
      }
    });
    const sub = dialogRef.componentInstance.onSuccessEvent.subscribe(() => {
      this.isFresh = true;
      this.onChangeTableConfigName(this.selectedConfigTable, true);
    });
  }

  massUpdate() {
    const dialogRef = this.dialog.open(MasterDraftMassEditComponent, {
      id:  'MASTER_DRADT_MASS_EDIT',
      width: '500px',
      disableClose: true,
      hasBackdrop: true,
      data: {
        tableConfig: this.selectedConfigTable,
        rowData: this.rowData
      }
    });
  }

  validateChanges() {
    const dialogRef = this.dialog.open(MasterDraftValidationResultComponent, {
      id:  'MASTER_DRADT_VALIDATION_RESULT',
      width: '700px',
      disableClose: true,
      hasBackdrop: true,
      data: {
        tableConfig: this.selectedConfigTable
      }
    });
  }
  
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    //this.autoSizeAll();
  }

  onRowDataChanged(params) {
    this.rowsCountString = this.getRowCountString();

    this.setPrintData();
    if (this.isFresh === true ) {
      let that = this;
      setTimeout(function () {
        that.restoreFilterModel();
      }, 500);
    }
  }
  restoreFilterModel() {
    this.gridApi.setFilterModel(this.filterModel);
    this.gridApi.onFilterChanged();
    this.isFresh = false;
  }
  
  onSortChanged(params) {
    let selectedRow = this.gridApi.getSelectedRows();
    this.gridApi.forEachNode((item: any) => {
      if (item.data === selectedRow[0]) {
        this.gridApi.ensureIndexVisible(item.rowIndex, 'middle');
      }
    });

    this.setPrintData();
  }

  onColumnMoved (params) {
    this.setPrintData();
  }

  setPrintData () {
    let printData = [];
    this.headerPrintData = [];
    let getAllGridColumns = this.gridColumnApi.getAllGridColumns();

    let totalWidth = 0;
    getAllGridColumns.forEach((column, index) => {
      if (!column.colDef.hide) {
        if (index === getAllGridColumns.length - 1){ 
          this.headerPrintData.push({headerName: column.colDef.headerName, width: (1024 - totalWidth)});
        } else {
          let columnWidth = 0;
          if (getAllGridColumns.length >= 10) {
            if (column.colDef.field == 'Id' || column.colDef.field == 'Splc') {
              columnWidth = (column.colDef.width - 20);
              this.headerPrintData.push({headerName: column.colDef.headerName, width: columnWidth});
            } else {
              columnWidth = (2*column.colDef.width/3 - 20);
              this.headerPrintData.push({headerName: column.colDef.headerName, width: columnWidth});
            }
          } else {
            columnWidth = (2*column.colDef.width/3);
            this.headerPrintData.push({headerName: column.colDef.headerName, width: columnWidth});
          }

          totalWidth = totalWidth + columnWidth;
        }
      }
    });

    this.gridApi.forEachNodeAfterFilterAndSort( function(rowNode, index) {
      let arrayRowData = [];
      getAllGridColumns.forEach(column => {
        if (!column.colDef.hide) {
          arrayRowData.push(rowNode.data[column.colDef.field]);
        }
      });

      printData.push(arrayRowData);
    });

    this.printData = printData;
  }

  onFilterChanged (params) {
    this.rowsCountString = this.getRowCountString();
    this.setPrintData();
    this.filterModel = this.gridApi.getFilterModel();
  }

  clearFilters() {
    this.filterModel = null;
    this.gridApi.setFilterModel(null);
    this.gridApi.onFilterChanged();
    this.setPrintData();
  }
  
  autoSizeAll() {
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }

  getRowCountString() {
    if (!this.gridApi) { return  'Number of records:'; }
    let rowCount = this.gridApi.getDisplayedRowCount();
    if (rowCount > 1) {
      return 'Number of records: ' + rowCount;
    } else {
      return 'Number of record: ' + rowCount;
    }
  }

  hasAdd() {
    return this.selectedConfigTable && this.selectedConfigTable.UrlAdd;
  }

  hasUpdate() {
    return this.selectedConfigTable && this.selectedConfigTable.UrlUpdate;
  }
  applyTypeCodeDisplay(tableData) {
    return (tableData as ExceptionPoolModel[]).map(item => {
      item.TypeCode = this.getTypeCodeDisplay(item);
      return item;
    });
  }
  getTypeCodeDisplay(item) {
    let typeCode = ''
    switch (item.TypeCode) {
      case 'C':
        typeCode = 'C - Shipper';
        break;
      case 'G':
        typeCode = 'G - Contaminated';
        break;
      case 'J':
        typeCode = 'J - Agent';
        break;
      case 'N':
        typeCode = 'N - National';
        break;
      case 'P':
        typeCode = 'P - Commodity';
        break;
      case 'R':
        typeCode = 'R - Agent';
        break;
      case 'T':
        typeCode = 'T - Agent';
        break;
      case 'W':
        typeCode = 'W - Unassigned';
        break;
      default:
        typeCode = item.TypeCode + ' - Unknown'
        break;
    }
    return typeCode;
  }
}
