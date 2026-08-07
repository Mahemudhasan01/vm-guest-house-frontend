import {Routes} from '@angular/router';
import {Dashboard} from './components/dashboard/dashboard';
import { CheckOutList } from './components/check-out-list/check-out-list';

export const routes: Routes = [
  {path: '', component: Dashboard},
  {path: 'checkout', component: CheckOutList},
  {path: '**', redirectTo: ''}
];
