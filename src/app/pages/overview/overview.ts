import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {DatePipe, DecimalPipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TuiAmountPipe} from '@taiga-ui/addon-commerce';
import {TuiAxes, TuiBarChart, TuiLineChart} from '@taiga-ui/addon-charts';
import {
    TuiButton,
    TuiDialogService,
    TuiIcon,
    TuiLink,
    TuiNotificationService,
    TuiTitle,
} from '@taiga-ui/core';
import {TuiCardLarge, TuiHeader} from '@taiga-ui/layout';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {take} from 'rxjs';

import {CloudStore} from '../../core/cloud-store';
import {TopUpDialog, type TopUpResult} from '../../dialogs/top-up-dialog';

@Component({
    selector: 'app-overview',
    imports: [
        DatePipe,
        DecimalPipe,
        RouterLink,
        TuiAmountPipe,
        TuiAxes,
        TuiBarChart,
        TuiLineChart,
        TuiButton,
        TuiIcon,
        TuiLink,
        TuiTitle,
        TuiCardLarge,
        TuiHeader,
    ],
    templateUrl: './overview.html',
    styleUrl: './overview.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Overview {
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

    protected readonly cpuPoints = computed(() =>
        this.store.cpuHistory().map((y, x) => [x, y] as [number, number]),
    );

    protected readonly topVms = computed(() =>
        [...this.store.projectVms()]
            .filter((vm) => vm.status === 'running')
            .sort((a, b) => b.cpu - a.cpu)
            .slice(0, 5),
    );

    protected readonly quotaRows = computed(() => {
        const {vcpu, ramGb, diskGb, publicIp} = this.store.quotaUsage();

        return [
            {label: 'vCPU', used: vcpu.used, quota: vcpu.quota, unit: ''},
            {label: 'RAM', used: ramGb.used, quota: ramGb.quota, unit: ' ГБ'},
            {label: 'Диски', used: diskGb.used, quota: diskGb.quota, unit: ' ГБ'},
            {label: 'Внешние IP', used: publicIp.used, quota: publicIp.quota, unit: ''},
        ];
    });

    protected percent(used: number, quota: number): number {
        return Math.round((used / quota) * 100);
    }

    protected hourX(x: number): string {
        return `${String(x).padStart(2, '0')}:00`;
    }

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
