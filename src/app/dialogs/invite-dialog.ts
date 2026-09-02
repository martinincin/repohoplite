import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {
    TuiButton,
    TuiError,
    TuiInput,
    TuiTextfield,
    type TuiDialogContext,
} from '@taiga-ui/core';
import {TuiDataListWrapper, TuiSelect} from '@taiga-ui/kit';
import {injectContext} from '@taiga-ui/polymorpheus';

import type {UserRole} from '../core/models';

export interface InviteResult {
    readonly email: string;
    readonly role: UserRole;
}

@Component({
    selector: 'app-invite-dialog',
    imports: [
        ReactiveFormsModule,
        TuiButton,
        TuiError,
        TuiTextfield,
        TuiInput,
        TuiSelect,
        TuiDataListWrapper,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <form
            class="t-form"
            [formGroup]="form"
            (ngSubmit)="submit()"
        >
            <label tuiLabel>
                E-mail
                <tui-textfield iconStart="@tui.user-round">
                    <input
                        formControlName="email"
                        placeholder="name@company.io"
                        tuiInput
                    />
                </tui-textfield>
                <tui-error formControlName="email" />
            </label>

            <label tuiLabel>
                Роль
                <tui-textfield
                    tuiChevron
                    [tuiTextfieldCleaner]="false"
                >
                    <input
                        formControlName="role"
                        placeholder="Выберите роль"
                        tuiSelect
                    />
                    <tui-data-list-wrapper
                        *tuiDropdown
                        [items]="roleOptions"
                    />
                </tui-textfield>
                <tui-error formControlName="role" />
            </label>

            <div class="t-note">
                Приглашение действует 7 дней. Пользователь получит доступ к проекту после принятия.
            </div>

            <footer>
                <button
                    appearance="secondary"
                    size="s"
                    tuiButton
                    type="button"
                    (click)="cancel()"
                >
                    Отмена
                </button>
                <button
                    size="s"
                    tuiButton
                    type="submit"
                >
                    Отправить приглашение
                </button>
            </footer>
        </form>
    `,
    styles: `
        .t-form {
            display: grid;
            gap: 1rem;
        }

        .t-note {
            color: var(--tui-text-secondary);
            font-size: var(--tui-font-size-s);
        }

        footer {
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
        }
    `,
})
export class InviteDialog {
    protected readonly roleOptions: readonly string[] = [
        'admin — управление проектом',
        'developer — создание и изменение ресурсов',
        'billing — просмотр биллинга',
        'reader — только чтение',
    ];

    private readonly context = injectContext<TuiDialogContext<InviteResult>>();
    private readonly fb = inject(NonNullableFormBuilder);

    protected readonly form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        role: ['developer — создание и изменение ресурсов', Validators.required],
    });

    protected cancel(): void {
        this.context.$implicit.complete();
    }

    protected submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const {email, role} = this.form.getRawValue();
        const roleId = role.split(' — ')[0] as UserRole;

        this.context.completeWith({email, role: roleId});
    }
}
