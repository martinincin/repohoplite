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
        tuiheader?: string;
        tuilabel?: string;
        tuilink?: string;
        tuiinput?: string;
        tuicheckbox?: string;
        tuiswitch?: string;
        tuiradio?: string;
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
        tuitab?: string;
        tuiaccordion?: string;
        tuitextarea?: string;
        tuichip?: string;
        tuiskeleton?: string;
        tuichevron?: string;
        tuinavigationaside?: string;
        tuinavigationheader?: string;
        tuinavigationmain?: string;
        tuinavigationnav?: string;
        tuinavigationlogo?: string;
        tuinavigationsegments?: string;
        tuiasideitem?: string;
        tuifade?: string;
        tuislider?: string;
        tuistep?: string;
        tuicopy?: string;
        tuistatus?: string;
        tuirating?: string;
        tuibadgenotification?: string;
        tuibadgedcontent?: string;
        tuibadge?: string;
        tuifilter?: string;
        tuilist?: string;
        tuitemgroup?: string;
        tuiform?: string;
        tuiblockdetails?: string;
        tuiblock?: string;
        tuilegenditem?: string;
        tuilineclamp?: string;
        tuiavatarstack?: string;
        tuifade2?: string;
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
            'tui-tabs': TuiElement;
            'tui-accordion': TuiElement;
            'tui-breadcrumbs': TuiElement;
            'tui-block-status': TuiElement;
            'tui-pagination': TuiElement;
            'tui-axes': TuiElement;
            'tui-bar-chart': TuiElement;
            'tui-line-chart': TuiElement;
            'tui-bar': TuiElement;
            'portal-slot': TuiElement;
            'tui-pie-chart': TuiElement;
            'tui-ring-chart': TuiElement;
            'tui-calendar': TuiElement;
            'tui-calendar-sheet': TuiElement;
            'tui-calendar-spin': TuiElement;
            'tui-calendar-year': TuiElement;
            'tui-stepper': TuiElement;
            'tui-counter': TuiElement;
            'tui-rating': TuiElement;
            'tui-tiles': TuiElement;
            'tui-tile': TuiElement;
            'tui-timeline': TuiElement;
            'tui-timeline-item': TuiElement;
            'tui-arc-chart': TuiElement;
            'tui-input-date': TuiElement;
            'tui-combo-box': TuiElement;
            'tui-multi-select': TuiElement;
        }
    }
}
