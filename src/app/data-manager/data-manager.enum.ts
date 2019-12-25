export const PAGINATION_CONFIGS = {
    pageSize : 100,
    paginationAutoPageSize: false
};

export const INTERCHAGE_TYPES = [
    { id: 'N', name: 'N - Normal' },
    { id: 'O', name: 'O - Operational' },
    { id: 'B', name: 'B - Bilateral' },
];

export const REASON_CODES = [
    { id: 0, name: '0 - INITIAL LOAD' },
    { id: 1, name: '1 - ADD MARK OR POOL' },
    { id: 2, name: '2 - DEL MARK OR POOL' },
    { id: 3, name: '3 - QUARTERLY CHANGE' },
    { id: 4, name: '4 - UPD MERGER' },
    { id: 5, name: '5 - UPD TRADE NAME' },
    { id: 6, name: '6 - ADD DELV ROAD' },
    { id: 7, name: '7 - ADD RECV ROAD' },
    { id: 8, name: '8 - ADD BOTH' },
    { id: 9, name: '9 - INTERCHANGE DEL' },
    { id: 10, name: '10 - CORRECTION TO 1' },
    { id: 11, name: '11 - CORRECTION TO 2' },
    { id: 12, name: '12 - CORRECTION TO 3' },
    { id: 13, name: '13 - CORRECTION TO 4' },
    { id: 14, name: '14 - CORRECTION TO 5' },
    { id: 15, name: '15 - CORRECTION TO 6' },
    { id: 16, name: '16 - CORRECTION TO 7' },
    { id: 17, name: '17 - CORRECTION TO 8' },
    { id: 18, name: '18 - CORRECTION TO 9' },
];

export const FIELD_TO_EDIT = [
    { data: 'None', label: '(None)' },
    { data: 'MassExpire', label: '(MassExpire)' },
    { data: 'MassRevert', label: '(MassRevert)' },
    { data: 'Mark', label: 'Equipment Mark' },
    { data: 'DeliveringRoad', label: 'Delivery Carrier' },
    { data: 'ReceivingRoad', label: 'Receiving Carrier' },
];

export const DATA_MANAGER_MESSAGES = {
    cancelFormConfirmMessage: 'Are you sure you want to discard the changes?',
    effectiveDateFormatErrAlert: 'Effective Date Invalid Date Format: Please enter a valid date in YYYY-MM-DD format.',
    expirationDateFormatErrAlert: 'Expiration Date Invalid Date Format: Please enter a valid date in YYYY-MM-DD format.',
    expireConfirmMessage: 'This action will set the expired date to today. Are you sure you want to continue?',
    invalidDate: 'Invalid Date Format.',
    // tslint:disable-next-line:max-line-length
    revertConfirmMessage: 'This action will replace this record with the original from the master table.  If there is no master record, this record will be deleted.  Continue?',
    pastDateError: 'Date cannot be in the past.',
    pastEffectiveDateError: 'Effective Date for an active record cannot be changed.',
    successMessage: 'Operation Completed Successfully',
    poolNumberError: 'Please enter a 7 digit pool number. Pool numbers are numeric and can be prefixed with zeroes.',
    requiredValue: 'Required value.',
    markError: 'Please enter a 2-4 character mark.',
    markTooltipError: 'This string is shorter than the minimum allowed length. This must be at least 2 characters long.',
    splcError: 'Please enter a 9 digit SPLC.',
    splcTooltipError: 'This string is shorter than the minimum allowed length. This must be at least 9 characters long.',
    cityError: 'Please enter a city.',
    stateError: 'Please enter a 2 character state.',
    stateExactlyError: 'State/Province name must be exactly 2 characters',
    milesError: 'Please enter a 1-4 digit mileage.',
    refreshAllDataConfirmMessage: 'This will load the contents of the Master table into the Draft Master.  Any data currently in the Draft Master will be overwritten.  This action cannot be undone.  Are you sure you wish to do this?',
    refreshAllDataSuccess: 'Successfully refreshed Master Draft Table data',
    refreshAllDataFailure: 'Failed to refresh Master Draft Table data. Please try again later.',
    minLengthError: 'This string is shorter than the minimum allowed length. This must be at least 2 characters long.',
    invalidDayError: 'Enter a valid day for the month',
    invalidMonthError: 'Enter a month between 1 and 12'
};

export interface ErrorMessages {
    ErrorCode: number;
    ErrorDescription: string;
}
export interface WarningMessages {
    WarningCode: number;
    WarningDescription: string;
}

