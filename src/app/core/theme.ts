import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'polus.theme';

@Injectable({providedIn: 'root'})
export class Theme {
    readonly dark = signal(localStorage.getItem(STORAGE_KEY) === 'dark');

    toggle(): void {
        this.dark.update((dark) => !dark);
        localStorage.setItem(STORAGE_KEY, this.dark() ? 'dark' : 'light');
    }
}
