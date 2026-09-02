import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {TuiAmountPipe} from '@taiga-ui/addon-commerce';
import {TuiTable, TuiTablePagination, TuiTableTd, TuiTableTh} from '@taiga-ui/addon-table';
import {TuiButton, TuiDialogService, TuiIcon, TuiNotificationService, TuiTitle} from '@taiga-ui/core';
import {TUI_CONFIRM, TuiBadge} from '@taiga-ui/kit';
import {TuiHeader} from '@taiga-ui/layout';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {take} from 'rxjs';

import {CloudStore} from '../../core/cloud-store';
import type {Bucket, NewBucket} from '../../core/models';
import {CreateBucketDialog} from '../../dialogs/create-bucket-dialog';

@Component({
    selector: 'app-storage',
    imports: [
        DecimalPipe,
        TuiAmountPipe,
        TuiTable,
        TuiTablePagination,
        TuiTableTd,
        TuiTableTh,
        TuiButton,
        TuiIcon,
        TuiTitle,
        TuiBadge,
        TuiHeader,
    ],
    templateUrl: './storage.html',
    styleUrl: './storage.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Storage {
    protected readonly store = inject(CloudStore);
    private readonly dialogs = inject(TuiDialogService);
    private readonly alerts = inject(TuiNotificationService);

    protected readonly typeLabels: Readonly<Record<Bucket['type'], string>> = {
        ssd: 'SSD',
        standard: 'Standard',
        cold: 'Cold',
    };

    protected readonly usedTotalGb = computed(() =>
        this.store.projectBuckets().reduce((total, bucket) => total + bucket.usedGb, 0),
    );

    protected openCreate(): void {
        this.dialogs
            .open<NewBucket>(new PolymorpheusComponent(CreateBucketDialog), {label: 'Новый бакет', size: 's'})
            .pipe(take(1))
            .subscribe((bucket) => {
                if (!bucket) {
                    return;
                }

                this.store.createBucket(bucket);
                this.alerts.open(`Бакет «${bucket.name}» создан`, {
                    appearance: 'positive',
                    label: 'Готово',
                });
            });
    }

    protected remove(bucket: Bucket): void {
        this.dialogs
            .open<boolean>(TUI_CONFIRM, {
                label: 'Удалить бакет?',
                size: 's',
                data: {
                    content: `Бакет «${bucket.name}» и все данные (${this.gb(bucket.usedGb)}) будут удалены безвозвратно.`,
                    yes: 'Удалить',
                    no: 'Отмена',
                },
            })
            .pipe(take(1))
            .subscribe((confirmed) => {
                if (confirmed) {
                    this.store.deleteBucket(bucket.id);
                    this.alerts.open(`Бакет «${bucket.name}» удалён`, {
                        appearance: 'negative',
                        label: 'Удалено',
                    });
                }
            });
    }

    protected gb(value: number): string {
        return `${value.toLocaleString('ru-RU')} ГБ`;
    }

    protected percent(bucket: Bucket): number {
        return Math.round((bucket.usedGb / bucket.quotaGb) * 100);
    }

    protected pricePerGb(bucket: Bucket): number {
        return this.store.bucketTypePrice(bucket.type);
    }
}
