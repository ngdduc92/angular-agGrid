import { IMenuItem } from '@railinc/rl-common-ui-lib/';
import { roles } from 'src/app/shared/roles';

export const MENU_OPTIONS: IMenuItem[] = [
  { label: 'Home', link: '/home' },
  { label: 'Data Manager', link: '/data-manager' },
  { label: 'Reports', link: '/reports' },
  { label: 'Admin', link: '/admin', roles: [roles.SCO90APPADM] },
  { label: 'Subscriptions', link: '/subscriptions', roles: [roles.SCO90COMPADM] },
  {
    label: 'User Guide',
    link: 'https://www.railinc.com/rportal/documents/18/512314/UG_SCO90.pdf',
    target: '_blank'
  }
];
