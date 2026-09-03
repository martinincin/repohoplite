// DOM-типы для кастомных элементов и атрибутов Taiga (та же разметка, что в Angular-версии).
import type {DetailedHTMLProps, DOMAttributes, HTMLAttributes} from 'react';

type TuiElement = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

declare module 'react' {
    // Атрибуты-селекторы дизайн-системы Taiga (рендерятся как есть)
    interface HTMLAttributes<T> extends DOMAttributes<T> {
        tuiappearance?: string;
        tuibutton?: string;
        tuiiconbutton?: string;
        tuibuttonx?: string;
        tuiicons?: string;
        tuibadge?: string;
        tuiavatar?: string;
        tuititle?: string;
        tuisubtitle?: string;
        tuilabel?: string;
        tuilink?: string;
        tuiheader?: string;
        tuiinput?: string;
        tuicheckbox?: string;
        tuiswitch?: string;
        tuioption?: string;
        tuicell?: string;
        tuisurface?: string;
        tuicardlarge?: string;
        tuicardmedium?: string;
        tuicardrow?: string;
        tuicardcollapsed?: string;
        tuitable?: string;
        tuitbody?: string;
        tuith?: string;
        tuitd?: string;
        tuiprogressbar?: string;
        tuialert?: string;
        tuinotification?: string;
        label?: string;
    }

    namespace JSX {
        interface IntrinsicElements {
            'tui-root': TuiElement;
            'tui-popups': TuiElement;
            'tui-popups-dialogs': TuiElement;
            'tui-alert-host': TuiElement;
            'tui-select': TuiElement;
            'tui-dropdown': TuiElement;
            'tui-hint': TuiElement;
            'tui-dialog': TuiElement;
            'tui-modal': TuiElement;
            'tui-alert': TuiElement;
            'tui-notification': TuiElement;
            'tui-icon': TuiElement;
            'tui-textfield': TuiElement;
            'tui-data-list': TuiElement;
            'tui-opt-group': TuiElement;
            'tui-error': TuiElement;
            'tui-loader': TuiElement;
            'tui-scrollbar': TuiElement;
            'tui-table-pagination': TuiElement;
            'tui-segmented': TuiElement;
            'tui-expand': TuiElement;
            'portal-slot': TuiElement;
        }
    }
}
