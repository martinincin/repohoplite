import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {DecimalPipe} from '@angular/common';
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
import type {NewVm, Region} from '../core/models';

@Component({
    selector: 'app-create-vm-dialog',
    imports: [
        DecimalPipe,
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
                Имя машины
                <tui-textfield>
                    <input
                        formControlName="name"
                        placeholder="app-server-1"
                        tuiInput
                    />
                </tui-textfield>
                <tui-error formControlName="name" />
                <span class="t-hint">строчные латинские буквы, цифры и дефисы, 3–40 символов</span>
            </label>

            <label tuiLabel>
                Регион
                <tui-textfield
                    tuiChevron
                    [tuiTextfieldCleaner]="false"
                >
                    <input
                        formControlName="region"
                        placeholder="Выберите регион"
                        tuiSelect
                    />
                    <tui-data-list-wrapper
                        *tuiDropdown
                        [items]="regions"
                    />
                </tui-textfield>
            </label>

            <label tuiLabel>
                Пресет
                <tui-textfield
                    tuiChevron
                    [tuiTextfieldCleaner]="false"
                >
                    <input
                        formControlName="preset"
                        placeholder="Выберите пресет"
                        tuiSelect
                    />
                    <tui-data-list-wrapper
                        *tuiDropdown
                        [items]="presetOptions"
                    />
                </tui-textfield>
            </label>

            <label tuiLabel>
                Диск, ГБ
                <tui-textfield>
                    <input
                        formControlName="disk"
                        tuiInputNumber
                        [max]="500"
                        [min]="10"
                        [step]="10"
                    />
                </tui-textfield>
                <tui-error formControlName="disk" />
            </label>

            <div class="t-cost">
                Стоимость:
                <strong>{{ cost() | number: '1.0-0' }} ₽/мес</strong>
                <span class="t-dim">· {{ quotaNote() }}</span>
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

        .t-cost {
            color: var(--tui-text-secondary);
        }

        .t-dim {
            color: var(--tui-text-tertiary);
        }

        footer {
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
        }
    `,
})
export class CreateVmDialog {
    protected readonly regions = ['msk-1 · Москва', 'spb-1 · Санкт-Петербург'];

    private readonly context = injectContext<TuiDialogContext<NewVm>>();
    private readonly fb = inject(NonNullableFormBuilder);
    private readonly store = inject(CloudStore);

    protected readonly presetOptions = this.store.presets.map((p) => this.presetLabel(p));

    protected readonly form = this.fb.group({
        name: ['', [Validators.required, Validators.pattern(/^[a-z0-9][a-z0-9-]{2,39}$/)]],
        region: ['msk-1 · Москва', Validators.required],
        preset: [this.presetOptions[1], Validators.required],
        disk: [40, [Validators.required, Validators.min(10), Validators.max(500)]],
    });

    // valueChanges — не сигнал, поэтому прокидываем его через toSignal для computed
    private readonly formValue = toSignal(this.form.valueChanges, {
        initialValue: this.form.getRawValue(),
    });

    protected readonly cost = computed(() => {
        const {preset, disk} = this.formValue();
        const selected = this.store.presets.find((p) => this.presetLabel(p) === preset);
        const price = selected?.pricePerMonth ?? 0;

        return price + (disk ?? 0) * 12;
    });

    protected readonly quotaNote = computed(() => {
        const {vcpu, ramGb} = this.store.quotaUsage();

        return `сейчас занято ${vcpu.used} из ${vcpu.quota} vCPU и ${ramGb.used} из ${ramGb.quota} ГБ RAM`;
    });

    protected cancel(): void {
        this.context.$implicit.complete();
    }

    protected submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const {name, region, preset, disk} = this.form.getRawValue();
        const presetId = this.store.presets.find((p) => this.presetLabel(p) === preset)?.id ?? '';
        const regionId = region.startsWith('msk') ? 'msk-1' : 'spb-1';

        this.context.completeWith({
            name,
            region: regionId as Region,
            presetId,
            diskGb: disk,
            projectId: this.store.project(),
        });
    }

    private presetLabel(p: {name: string; vcpu: number; ramGb: number; pricePerMonth: number}): string {
        return `${p.name} · ${p.vcpu} vCPU · ${p.ramGb} ГБ · ${p.pricePerMonth.toLocaleString('ru-RU')} ₽/мес`;
    }
}
