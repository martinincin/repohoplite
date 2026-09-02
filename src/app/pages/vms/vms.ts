import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TuiAmountPipe} from '@taiga-ui/addon-commerce';
import {
    TuiTable,
    TuiTablePagination,
    TuiTableTd,
    TuiTableTh,
    type TuiTablePaginationEvent,
} from '@taiga-ui/addon-table';
import {
    TuiButton,
    TuiDataList,
    TuiDialogService,
    TuiIcon,
    TuiInput,
    TuiNotificationService,
    TuiOption,
    TuiTextfield,
    TuiTitle,
} from '@taiga-ui/core';
import {TUI_CONFIRM, TuiSelect, TuiDataListWrapper, TuiSegmented} from '@taiga-ui/kit';
import {TuiHeader} from '@taiga-ui/layout';
import {TuiDropdownDirective, TuiDropdownOpen} from '@taiga-ui/core/portals/dropdown';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {take} from 'rxjs';

import {CloudStore} from '../../core/cloud-store';
import type {NewVm, Vm} from '../../core/models';
import {CreateVmDialog} from '../../dialogs/create-vm-dialog';
import {StatusBadge} from '../../ui/status-badge';

type StatusFilter = 'all' | 'active' | 'stopped' | 'error';

const STATUS_FILTERS: readonly StatusFilter[] = ['all', 'active', 'stopped', 'error'];

@Component({
    selector: 'app-vms',
    imports: [
        FormsModule,
        TuiAmountPipe,
        TuiTable,
        TuiTablePagination,
        TuiTableTd,
        TuiTableTh,
        TuiButton,
        TuiDataList,
        TuiIcon,
        TuiInput,
        TuiOption,
        TuiTextfield,
        TuiTitle,
        TuiSelect,
        TuiDataListWrapper,
        TuiSegmented,
        TuiHeader,
        TuiDropdownDirective,
        TuiDropdownOpen,
        StatusBadge,
    ],
    templateUrl: './vms.html',
    styleUrl: './vms.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Vms {
    protected readonly store = inject(CloudStore);
    private readonly dialogs = inject(TuiDialogService);
    private readonly alerts = inject(TuiNotificationService);

    protected readonly statusIndex = signal(0);
    protected readonly search = signal('');
    protected readonly region = signal('Все регионы');
    protected readonly regions = ['Все регионы', 'msk-1 · Москва', 'spb-1 · Санкт-Петербург'];

    protected readonly page = signal(0);
    protected readonly pageSize = signal(8);

    protected readonly filtered = computed(() => {
        const filter = STATUS_FILTERS[this.statusIndex()];
        const query = this.search().trim().toLowerCase();
        const region = this.region();

        return this.store.projectVms().filter((vm) => {
            const byStatus =
                filter === 'all' ||
                (filter === 'active' && (vm.status === 'running' || vm.status === 'starting' || vm.status === 'restarting')) ||
                (filter === 'stopped' && (vm.status === 'stopped' || vm.status === 'stopping')) ||
                (filter === 'error' && vm.status === 'error');
            const byRegion = region === 'Все регионы' || vm.region === region.slice(0, 5);
            const bySearch =
                !query ||
                vm.name.includes(query) ||
                vm.ipInternal.includes(query) ||
                (vm.ipPublic ?? '').includes(query);

            return byStatus && byRegion && bySearch;
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

    protected onRegion(value: string): void {
        this.region.set(value);
        this.page.set(0);
    }

    protected resetFilters(): void {
        this.search.set('');
        this.statusIndex.set(0);
        this.region.set('Все регионы');
        this.page.set(0);
    }

    protected openCreate(): void {
        this.dialogs
            .open<NewVm>(new PolymorpheusComponent(CreateVmDialog), {label: 'Новая виртуальная машина', size: 's'})
            .pipe(take(1))
            .subscribe((vm) => {
                if (!vm) {
                    return;
                }

                this.store.createVm(vm);
                this.alerts.open(`ВМ «${vm.name}» создаётся`, {appearance: 'info', label: 'Запрос принят'});
            });
    }

    protected start(vm: Vm): void {
        this.store.startVm(vm.id);
        this.alerts.open(`ВМ «${vm.name}» запускается`, {appearance: 'info', label: 'Операция'});
    }

    protected stop(vm: Vm): void {
        this.store.stopVm(vm.id);
        this.alerts.open(`ВМ «${vm.name}» останавливается`, {appearance: 'info', label: 'Операция'});
    }

    protected restart(vm: Vm): void {
        this.store.restartVm(vm.id);
        this.alerts.open(`ВМ «${vm.name}» перезапускается`, {appearance: 'info', label: 'Операция'});
    }

    protected remove(vm: Vm): void {
        this.dialogs
            .open<boolean>(TUI_CONFIRM, {
                label: 'Удалить ВМ?',
                size: 's',
                data: {
                    content: `ВМ «${vm.name}» и диск ${vm.diskGb} ГБ будут удалены безвозвратно.`,
                    yes: 'Удалить',
                    no: 'Отмена',
                },
            })
            .pipe(take(1))
            .subscribe((confirmed) => {
                if (confirmed) {
                    this.store.deleteVm(vm.id);
                    this.alerts.open(`ВМ «${vm.name}» удалена`, {appearance: 'negative', label: 'Удалено'});
                }
            });
    }
}
