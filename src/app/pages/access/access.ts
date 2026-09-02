import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {TuiTable, TuiTableTd, TuiTableTh} from '@taiga-ui/addon-table';
import {TuiButton, TuiDialogService, TuiIcon, TuiNotificationService, TuiTitle} from '@taiga-ui/core';
import {TUI_CONFIRM, TuiAvatar, TuiBadge, TuiSegmented} from '@taiga-ui/kit';
import {TuiHeader} from '@taiga-ui/layout';
import {PolymorpheusComponent} from '@taiga-ui/polymorpheus';
import {take} from 'rxjs';

import {CloudStore} from '../../core/cloud-store';
import {InviteDialog, type InviteResult} from '../../dialogs/invite-dialog';

@Component({
    selector: 'app-access',
    imports: [
        DatePipe,
        TuiTable,
        TuiTableTd,
        TuiTableTh,
        TuiButton,
        TuiIcon,
        TuiTitle,
        TuiAvatar,
        TuiBadge,
        TuiSegmented,
        TuiHeader,
    ],
    templateUrl: './access.html',
    styleUrl: './access.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Access {
    protected readonly store = inject(CloudStore);
    private readonly dialogs = inject(TuiDialogService);
    private readonly alerts = inject(TuiNotificationService);

    protected readonly filterIndex = signal(0);

    protected readonly roleLabels: Readonly<Record<string, string>> = {
        owner: 'владелец',
        admin: 'администратор',
        developer: 'разработчик',
        billing: 'биллинг',
        reader: 'читатель',
    };

    protected readonly users = computed(() => {
        const showInvited = this.filterIndex() === 0;

        return this.store.users().filter((user) => showInvited || !user.invited);
    });

    protected initials(name: string): string {
        return name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2);
    }

    protected openInvite(): void {
        this.dialogs
            .open<InviteResult>(new PolymorpheusComponent(InviteDialog), {label: 'Приглашение в проект', size: 's'})
            .pipe(take(1))
            .subscribe((result) => {
                if (!result) {
                    return;
                }

                this.store.inviteUser(result.email, result.role);
                this.alerts.open(`Приглашение отправлено на ${result.email}`, {
                    appearance: 'positive',
                    label: 'Отправлено',
                });
            });
    }

    protected remove(id: string, email: string): void {
        this.dialogs
            .open<boolean>(TUI_CONFIRM, {
                label: 'Отозвать доступ?',
                size: 's',
                data: {
                    content: `Пользователь ${email} потеряет доступ ко всем проектам аккаунта.`,
                    yes: 'Отозвать',
                    no: 'Отмена',
                },
            })
            .pipe(take(1))
            .subscribe((confirmed) => {
                if (confirmed) {
                    this.store.removeUser(id);
                    this.alerts.open(`Доступ ${email} отозван`, {
                        appearance: 'negative',
                        label: 'Готово',
                    });
                }
            });
    }
}
