import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TuiTable, TuiTablePagination, TuiTableTd, TuiTableTh, type TuiTablePaginationEvent} from '@taiga-ui/addon-table';
import {TuiButton, TuiIcon, TuiInput, TuiTextfield, TuiTitle} from '@taiga-ui/core';
import {TuiBadge, TuiSegmented} from '@taiga-ui/kit';
import {TuiHeader} from '@taiga-ui/layout';

import {CloudStore} from '../../core/cloud-store';
import type {Severity} from '../../core/models';

const SEVERITIES: readonly Severity[] = ['info', 'warning', 'error'];
const SEVERITY_LABELS: Readonly<Record<Severity, string>> = {
    info: 'Инфо',
    warning: 'Предупреждение',
    error: 'Ошибка',
};
const SEVERITY_APPEARANCES: Readonly<Record<Severity, string>> = {
    info: 'neutral',
    warning: 'warning',
    error: 'negative',
};

@Component({
    selector: 'app-audit',
    imports: [
        DatePipe,
        FormsModule,
        TuiTable,
        TuiTablePagination,
        TuiTableTd,
        TuiTableTh,
        TuiIcon,
        TuiTextfield,
        TuiTitle,
        TuiBadge,
        TuiInput,
        TuiSegmented,
        TuiHeader,
    ],
    templateUrl: './audit.html',
    styleUrl: './audit.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Audit {
    protected readonly store = inject(CloudStore);

    protected readonly severityIndex = signal(0);
    protected readonly search = signal('');

    protected readonly page = signal(0);
    protected readonly pageSize = signal(10);

    protected readonly filtered = computed(() => {
        const severity = SEVERITIES[this.severityIndex() - 1] ?? null;
        const query = this.search().trim().toLowerCase();

        return this.store.events().filter((event) => {
            const bySeverity = !severity || event.severity === severity;
            const bySearch =
                !query ||
                event.action.toLowerCase().includes(query) ||
                event.target.toLowerCase().includes(query) ||
                event.actor.toLowerCase().includes(query);

            return bySeverity && bySearch;
        });
    });

    protected readonly paged = computed(() => {
        const start = this.page() * this.pageSize();

        return this.filtered().slice(start, start + this.pageSize());
    });

    protected onPagination(event: TuiTablePaginationEvent): void {
        this.page.set(event.page);
        this.pageSize.set(event.size);
    }

    protected onSearch(value: string): void {
        this.search.set(value);
        this.page.set(0);
    }

    protected label(severity: Severity): string {
        return SEVERITY_LABELS[severity];
    }

    protected appearance(severity: Severity): string {
        return SEVERITY_APPEARANCES[severity];
    }
}
