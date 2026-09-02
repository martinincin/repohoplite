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

export interface TopUpResult {
    readonly amount: number;
    readonly method: string;
}

@Component({
    selector: 'app-top-up-dialog',
    imports: [
        ReactiveFormsModule,
        TuiButton,
        TuiError,
        TuiTextfield,
        TuiInput,
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
                Сумма, ₽
                <tui-textfield>
                    <input
                        formControlName="amount"
                        tuiInputNumber
                        [max]="500000"
                        [min]="1000"
                    />
                </tui-textfield>
                <tui-error formControlName="amount" />
            </label>

            <label tuiLabel>
                Способ оплаты
                <tui-textfield
                    tuiChevron
                    [tuiTextfieldCleaner]="false"
                >
                    <input
                        formControlName="method"
                        placeholder="Выберите способ"
                        tuiSelect
                    />
                    <tui-data-list-wrapper
                        *tuiDropdown
                        [items]="methods"
                    />
                </tui-textfield>
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
                    Пополнить
                </button>
            </footer>
        </form>
    `,
    styles: `
        .t-form {
            display: grid;
            gap: 1rem;
        }

        footer {
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
        }
    `,
})
export class TopUpDialog {
    protected readonly methods = ['Банковская карта', 'Счёт на юридическое лицо'];

    private readonly context = injectContext<TuiDialogContext<TopUpResult>>();
    private readonly fb = inject(NonNullableFormBuilder);

    protected readonly form = this.fb.group({
        amount: [50000, [Validators.required, Validators.min(1000), Validators.max(500000)]],
        method: ['Банковская карта', Validators.required],
    });

    protected cancel(): void {
        this.context.$implicit.complete();
    }

    protected submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const {amount, method} = this.form.getRawValue();

        this.context.completeWith({amount, method});
    }
}
