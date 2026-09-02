import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {
    TuiButton,
    TuiError,
    TuiInput,
    TuiTextfield,
    type TuiDialogContext,
} from '@taiga-ui/core';
import {TuiDataListWrapper, TuiInputNumber, TuiSelect} from '@taiga-ui/kit';
import {injectContext} from '@taiga-ui/polymorpheus';

import {CloudStore} from '../core/cloud-store';
import type {BucketType, NewBucket} from '../core/models';

@Component({
    selector: 'app-create-bucket-dialog',
    imports: [
        ReactiveFormsModule,
        TuiButton,
        TuiError,
        TuiInput,
        TuiTextfield,
        TuiSelect,
        TuiInputNumber,
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
                Имя бакета
                <tui-textfield iconStart="@tui.database">
                    <input
                        formControlName="name"
                        placeholder="polus-data"
                        tuiInput
                    />
                </tui-textfield>
                <tui-error formControlName="name" />
                <span class="t-hint">3–63 символа: строчные буквы, цифры, дефисы; имя S3-совместимое</span>
            </label>

            <label tuiLabel>
                Класс хранения
                <tui-textfield
                    tuiChevron
                    [tuiTextfieldCleaner]="false"
                >
                    <input
                        formControlName="type"
                        placeholder="Выберите класс"
                        tuiSelect
                    />
                    <tui-data-list-wrapper
                        *tuiDropdown
                        [items]="typeOptions"
                    />
                </tui-textfield>
                <tui-error formControlName="type" />
            </label>

            <label tuiLabel>
                Квота, ГБ
                <tui-textfield>
                    <input
                        formControlName="quota"
                        tuiInputNumber
                        [max]="8192"
                        [min]="16"
                        [step]="16"
                    />
                </tui-textfield>
                <tui-error formControlName="quota" />
            </label>

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
                    Создать
                </button>
            </footer>
        </form>
    `,
    styles: `
        .t-form {
            display: grid;
            gap: 1rem;
        }

        .t-hint {
            display: block;
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
export class CreateBucketDialog {
    protected readonly typeOptions = ['SSD — горячие данные', 'Standard', 'Cold — архив'];

    private readonly context = injectContext<TuiDialogContext<NewBucket>>();
    private readonly fb = inject(NonNullableFormBuilder);
    private readonly store = inject(CloudStore);

    protected readonly form = this.fb.group({
        name: ['', [Validators.required, Validators.pattern(/^[a-z0-9][a-z0-9-]{2,62}$/)]],
        type: ['Standard', Validators.required],
        quota: [256, [Validators.required, Validators.min(16), Validators.max(8192)]],
    });

    protected cancel(): void {
        this.context.$implicit.complete();
    }

    protected submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const {name, type, quota} = this.form.getRawValue();
        const typeId: BucketType = type.startsWith('SSD') ? 'ssd' : type.startsWith('Cold') ? 'cold' : 'standard';

        this.context.completeWith({
            name,
            type: typeId,
            quotaGb: quota,
            projectId: this.store.project(),
        });
    }
}
