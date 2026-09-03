// taiga-ui-react — порт дизайн-системы Taiga UI на React.
// Публичный API; всё остальное — внутренняя реализация.

export {TUI_VERSION} from './version';

// Корень и тема
export {TuiRoot} from './root/TuiRoot';
export {TuiThemeProvider, useTuiTheme} from './root/TuiThemeProvider';
export {setTuiIconsBase} from './utils/icons';

// Базовые компоненты
export {TuiButton, TuiIconButton, type TuiButtonProps, type TuiButtonAppearance, type TuiSize} from './components/button/TuiButton';
export {TuiIcon, type TuiIconProps} from './components/icon/TuiIcon';
export {TuiBadge, TuiAvatar, type TuiBadgeProps, type TuiAvatarProps} from './components/display/TuiBadge';
export {
    TuiTitle,
    TuiSubtitle,
    TuiLabel,
    TuiLink,
    TuiError,
    TuiLoader,
} from './components/display/TuiTypography';

// Поля ввода
export {TuiTextfield, TuiInput, type TuiTextfieldProps, type TuiInputProps} from './components/textfield/TuiTextfield';
export {TuiInputNumber, type TuiInputNumberProps} from './components/input-number/TuiInputNumber';
export {TuiCheckbox, TuiSwitch, type TuiCheckboxProps} from './components/form/TuiCheckbox';
export {TuiSegmented, type TuiSegmentedProps} from './components/form/TuiSegmented';

// Списки и оверлеи
export {
    TuiDataList,
    TuiOption,
    TuiOptGroup,
    TuiSelect,
    type TuiDataListProps,
    type TuiOptionProps,
    type TuiSelectProps,
} from './components/data-list/TuiDataList';
export {
    TuiDropdown,
    type TuiDropdownProps,
    type TuiDropdownAlign,
} from './components/dropdown/TuiDropdown';
export {TuiHint, type TuiHintDirection} from './components/hint/TuiHint';
export {
    TuiDialogsProvider,
    useTuiDialogs,
    TuiConfirmContent,
    type TuiDialogOptions,
    type TuiDialogHandle,
} from './components/dialog/TuiDialogs';
export {
    TuiNotificationsProvider,
    useTuiNotifications,
    TuiNotification,
    type TuiNotificationOptions,
} from './components/notification/TuiNotifications';

// Layout и данные
export {
    TuiSurface,
    TuiCard,
    TuiHeader,
    TuiCell,
    type TuiSurfaceAppearance,
    type TuiCardSize,
    type TuiCellProps,
} from './components/layout/TuiSurface';
export {
    TuiTable,
    TuiTbody,
    TuiTh,
    TuiTd,
    TuiTablePagination,
    type TuiTablePaginationProps,
} from './components/table/TuiTable';
export {TuiProgressBar} from './components/progress/TuiProgressBar';
