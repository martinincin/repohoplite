import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterLink, RouterOutlet} from '@angular/router';
import {
    TuiButton,
    TuiDataList,
    TuiDialogService,
    TuiIcon,
    TuiLink,
    TuiNotificationService,
    TuiOption,
    TuiRoot,
} from '@taiga-ui/core';
import {TuiAmountPipe} from '@taiga-ui/addon-commerce';
import {TuiAvatar, TuiBadge, TuiBadgeNotification, TuiChevron, TuiSwitch} from '@taiga-ui/kit';
import {TuiFade} from '@taiga-ui/kit/directives/fade';
import {TuiNavigation, TuiSurface} from '@taiga-ui/layout';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {take} from 'rxjs';

import {CloudStore} from './core/cloud-store';
import {Theme} from './core/theme';
import type {Project} from './core/models';
import {TopUpDialog, type TopUpResult} from './dialogs/top-up-dialog';
import {
    TuiDropdownDirective,
    TuiDropdownOpen,
} from '@taiga-ui/core/portals/dropdown';

@Component({
    selector: 'app-root',
    imports: [
        DatePipe,
        FormsModule,
        RouterLink,
        RouterOutlet,
        TuiRoot,
        ...TuiNavigation,
        TuiButton,
        TuiIcon,
        TuiLink,
        TuiAmountPipe,
        TuiAvatar,
        TuiBadge,
        TuiBadgeNotification,
        TuiChevron,
        TuiDataList,
        TuiOption,
        TuiSwitch,
        TuiSurface,
        TuiFade,
        TuiDropdownDirective,
        TuiDropdownOpen,
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
    protected readonly store = inject(CloudStore);
    protected readonly theme = inject(Theme);
    private readonly dialogs = inject(TuiDialogService);
    private readonly alerts = inject(TuiNotificationService);

    protected readonly projectsOpen = signal(false);
    protected readonly alertsOpen = signal(false);
    protected readonly userOpen = signal(false);

    protected selectProject(project: Project): void {
        this.store.switchProject(project.id);
        this.projectsOpen.set(false);
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
