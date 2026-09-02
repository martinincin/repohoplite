import {Routes} from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./pages/overview/overview').then((m) => m.Overview),
    },
    {
        path: 'vms',
        loadComponent: () => import('./pages/vms/vms').then((m) => m.Vms),
    },
    {
        path: 'storage',
        loadComponent: () => import('./pages/storage/storage').then((m) => m.Storage),
    },
    {
        path: 'billing',
        loadComponent: () => import('./pages/billing/billing').then((m) => m.Billing),
    },
    {
        path: 'access',
        loadComponent: () => import('./pages/access/access').then((m) => m.Access),
    },
    {
        path: 'audit',
        loadComponent: () => import('./pages/audit/audit').then((m) => m.Audit),
    },
    {path: '**', redirectTo: ''},
];
