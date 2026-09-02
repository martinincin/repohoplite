import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {DatePipe} from '@angular/common';
import {TuiAmountPipe} from '@taiga-ui/addon-commerce';
import {TuiAxes, TuiBarChart} from '@taiga-ui/addon-charts';
import {TuiTable, TuiTableTd, TuiTableTh} from '@taiga-ui/addon-table';
import {TuiButton, TuiDialogService, TuiNotificationService, TuiTitle} from '@taiga-ui/core';
import {TuiCardLarge, TuiHeader} from '@taiga-ui/layout';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {take} from 'rxjs';

import {CloudStore} from '../../core/cloud-store';
import {TopUpDialog, type TopUpResult} from '../../dialogs/top-up-dialog';

@Component({
    selector: 'app-billing',
    imports: [
        DatePipe,
        TuiAmountPipe,
        TuiAxes,
        TuiBarChart,
        TuiTable,
        TuiTableTd,
        TuiTableTh,
        TuiButton,
        TuiTitle,
        TuiCardLarge,
        TuiHeader,
    ],
    templateUrl: './billing.html',
    styleUrl: './billing.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Billing {
    protected readonly store = inject(CloudStore);
    private readonly dialogs = inject(TuiDialogService);
    private readonly alerts = inject(TuiNotificationService);

    protected readonly months = computed(() => this.store.spendSeries().map((s) => s.month));
    protected readonly bars = computed(() => this.store.spendSeries().map((s) => [s.amount]));
    protected readonly chartMax = computed(() => {
        const max = Math.max(...this.store.spendSeries().map((s) => s.amount));

        return Math.ceil(max / 25000) * 25000;
    });

    protected readonly axisY = computed(() => {
        const max = this.chartMax();

        return ['0', `${(max / 2000).toLocaleString("ru-RU")} тыс ₽`, `${max / 1000} тыс ₽`];
    });

    protected openTopUp(): void {
        this.dialogs
            .open<TopUpResult>(new PolymorpheusComponent(TopUpDialog), {label: 'Пополнение лицевого счёта', size: 's'})
            .pipe(take(1))
            .subscribe((result) => {
                if (!result) {
                    return;
                }

                const method = result.method.startsWith('Счёт') ? 'счёт' : 'карта';

                this.store.topUp(result.amount, method);
                this.alerts.open(`Счёт пополнен на ${result.amount.toLocaleString('ru-RU')} ₽`, {
                    appearance: 'positive',
                    label: 'Платёж принят',
                });
            });
    }
}
