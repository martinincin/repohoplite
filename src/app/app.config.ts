import {registerLocaleData} from '@angular/common';
import {LOCALE_ID} from '@angular/core';
import {
    ApplicationConfig,
    inject,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
    signal,
} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideTaiga, tuiValidationErrorsProvider, TUI_DARK_MODE} from '@taiga-ui/core';
import {tuiAmountOptionsProvider} from '@taiga-ui/addon-commerce';
import {TUI_LANGUAGE, TUI_RUSSIAN_LANGUAGE} from '@taiga-ui/i18n';

import {routes} from './app.routes';
import {Theme} from './core/theme';

import localeRu from '@angular/common/locales/ru';

registerLocaleData(localeRu);

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes),
        provideTaiga(),
        {provide: LOCALE_ID, useValue: 'ru'},
        {provide: TUI_DARK_MODE, useFactory: () => inject(Theme).dark},
        {provide: TUI_LANGUAGE, useFactory: () => signal(TUI_RUSSIAN_LANGUAGE)},
        tuiAmountOptionsProvider({currency: 'RUB'}),
        tuiValidationErrorsProvider({
            required: 'Обязательное поле',
            email: 'Некорректный e-mail',
            pattern: 'Допустимы только строчные латинские буквы, цифры и дефисы',
            min: ({min}: {min: number}) => `Минимум — ${min}`,
            max: ({max}: {max: number}) => `Максимум — ${max}`,
        }),
    ],
};
