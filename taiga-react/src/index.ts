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
export {TuiTextarea, type TuiTextareaProps} from './components/textfield/TuiTextarea';
export {TuiInputNumber, type TuiInputNumberProps} from './components/input-number/TuiInputNumber';
export {TuiCheckbox, TuiSwitch, type TuiCheckboxProps} from './components/form/TuiCheckbox';
export {TuiRadio, TuiChip, type TuiRadioProps, type TuiChipProps} from './components/form/TuiRadio';
export {TuiSegmented, type TuiSegmentedProps} from './components/form/TuiSegmented';
export {TuiSkeleton, type TuiSkeletonProps} from './components/display/TuiSkeleton';
export {TuiSlider, type TuiSliderProps} from './components/form/TuiSlider';

// Календарь и расширенные селекты
export {TuiCalendar, formatTuiDate, isTuiToday, toIso, fromIso, type TuiDate, type TuiCalendarProps} from './components/calendar/TuiCalendar';
export {
    TuiInputDate,
    TuiComboBox,
    TuiMultiSelect,
    type TuiInputDateProps,
    type TuiComboBoxProps,
    type TuiMultiSelectProps,
} from './components/select/TuiSelectExtensions';

// Разное: шаги, счётчики, статусы, рейтинги
export {
    TuiStepper,
    TuiStep,
    TuiCounter,
    TuiCopy,
    TuiStatus,
    TuiRating,
    TuiBadgeNotification,
    TuiBadgedContent,
    TuiAvatarStack,
    TuiLegendItem,
    TuiLineClamp,
} from './components/misc/TuiMisc';

export {
    TuiFilter,
    TuiTiles,
    TuiTile,
    TuiTimeline,
    TuiTimelineItem,
    TuiArcChart,
    TuiList,
    TuiItemGroup,
    TuiForm,
    TuiBlockDetails,
} from './components/misc/TuiMisc2';

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
export {TuiBlockStatus, type TuiBlockStatusProps} from './components/layout/TuiBlockStatus';
export {
    TuiTable,
    TuiTbody,
    TuiTh,
    TuiTd,
    TuiTablePagination,
    type TuiTablePaginationProps,
} from './components/table/TuiTable';
export {TuiProgressBar} from './components/progress/TuiProgressBar';

// Структура и навигация
export {TuiTabs, TuiTab, type TuiTabsProps, type TuiTabProps} from './components/tabs/TuiTabs';
export {TuiExpand, type TuiExpandProps} from './components/expand/TuiExpand';
export {
    TuiAccordion,
    TuiAccordionItem,
    type TuiAccordionProps,
    type TuiAccordionItemProps,
} from './components/accordion/TuiAccordion';
export {
    TuiBreadcrumbs,
    TuiBreadcrumbItem,
    type TuiBreadcrumbsProps,
} from './components/breadcrumbs/TuiBreadcrumbs';
export {TuiPagination, type TuiPaginationProps} from './components/pagination/TuiPagination';
export {
    TuiNavigationAside,
    TuiNavigationHeader,
    TuiNavigationMain,
    TuiNavigationNav,
    TuiNavigationLogo,
    TuiNavigationSegments,
    TuiAsideItemLink,
    TuiAsideItemButton,
    TuiFade,
    type TuiNavigationAsideProps,
    type TuiAsideItemLinkProps,
    type TuiAsideItemButtonProps,
} from './components/navigation/TuiNavigation';

// Графики
export {
    TuiAxes,
    TuiBarChart,
    TuiLineChart,
    type TuiBarChartProps,
    type TuiLineChartProps,
} from './components/charts/TuiCharts';
export {
    TuiPieChart,
    TuiRingChart,
    type TuiPieChartProps,
    type TuiRingChartProps,
} from './components/charts/TuiPieChart';

export type TuiAxesProps = React.HTMLAttributes<HTMLElement> & {
    axisYLabels?: readonly string[];
    axisXLabels?: readonly string[];
    horizontalLines?: number;
    verticalLines?: number;
    axisYInset?: boolean;
};
