import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {TuiBadge} from '@taiga-ui/kit';

import type {VmStatus} from '../core/models';

const STATUS_META: Readonly<Record<VmStatus, {readonly appearance: string; readonly label: string}>> = {
    running: {appearance: 'positive', label: 'Работает'},
    stopped: {appearance: 'neutral', label: 'Остановлена'},
    starting: {appearance: 'info', label: 'Запускается'},
    stopping: {appearance: 'neutral', label: 'Останавливается'},
    restarting: {appearance: 'info', label: 'Перезапуск'},
    error: {appearance: 'negative', label: 'Ошибка'},
};

@Component({
    selector: 'app-status-badge',
    imports: [TuiBadge],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div
            [appearance]="meta().appearance"
            size="s"
            tuiBadge
            tuiStatus
        >
            {{ meta().label }}
        </div>
    `,
})
export class StatusBadge {
    public readonly status = input.required<VmStatus>();

    protected readonly meta = computed(() => STATUS_META[this.status()]);
}
