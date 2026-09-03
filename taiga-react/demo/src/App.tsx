import {useState} from 'react';

import {
    TuiAccordion,
    TuiAccordionItem,
    TuiAvatar,
    TuiAxes,
    TuiBadge,
    TuiBarChart,
    TuiBlockStatus,
    TuiBreadcrumbItem,
    TuiBreadcrumbs,
    TuiButton,
    TuiCard,
    TuiCheckbox,
    TuiChip,
    TuiConfirmContent,
    TuiDataList,
    TuiDialogsProvider,
    TuiDropdown,
    TuiHeader,
    TuiHint,
    TuiIcon,
    TuiIconButton,
    TuiInput,
    TuiInputNumber,
    TuiLabel,
    TuiLineChart,
    TuiLink,
    TuiLoader,
    TuiNotification,
    TuiNotificationsProvider,
    TuiOptGroup,
    TuiOption,
    TuiPagination,
    TuiProgressBar,
    TuiRadio,
    TuiRoot,
    TuiSegmented,
    TuiSelect,
    TuiSkeleton,
    TuiSubtitle,
    TuiSurface,
    TuiSwitch,
    TuiTab,
    TuiTable,
    TuiTablePagination,
    TuiTabs,
    TuiTd,
    TuiTextfield,
    TuiTextarea,
    TuiThemeProvider,
    TuiTh,
    TuiTitle,
    TuiTbody,
    useTuiDialogs,
    useTuiNotifications,
    useTuiTheme,
} from 'taiga-ui-react';

const REGIONS = ['msk-1 · Москва', 'spb-1 · Санкт-Петербург', 'kzn-1 · Казань'];

const VMS = [
    {name: 'api-gateway-prod', preset: 'Standard 4·8', ip: '10.10.1.10', cpu: 41, price: '4 420 ₽'},
    {name: 'pg-primary', preset: 'Memory 16·32', ip: '10.10.3.11', cpu: 47, price: '16 780 ₽'},
    {name: 'redis-cache', preset: 'Standard 4·8', ip: '10.10.2.5', cpu: 12, price: '3 940 ₽'},
    {name: 'ci-runner-1', preset: 'General 8·16', ip: '10.10.6.3', cpu: 67, price: '8 540 ₽'},
    {name: 'backup-vault', preset: 'Standard 4·8', ip: '10.20.7.9', cpu: 8, price: '9 700 ₽'},
];

const SPEND: ReadonlyArray<readonly [string, number]> = [
    ['окт', 89], ['ноя', 90], ['дек', 93], ['янв', 93], ['фев', 95], ['мар', 95],
    ['апр', 96], ['май', 98], ['июн', 98], ['июл', 99], ['авг', 101], ['сен', 103],
];

const CPU = [62, 58, 64, 71, 69, 75, 80, 78, 82, 77, 73, 68, 66, 70, 74, 79, 81, 76, 72, 69, 67, 71, 74, 67];

const ICONS = [
    'search', 'plus', 'bell', 'check', 'x', 'settings', 'user-round', 'credit-card',
    'database', 'server', 'users', 'terminal', 'wallet', 'info', 'circle-alert',
    'chevron-down', 'chevron-left', 'chevron-right', 'sun', 'moon', 'trash-2', 'power',
];

export function App() {
    return (
        <TuiRoot>
            <TuiThemeProvider>
                <TuiNotificationsProvider>
                    <TuiDialogsProvider>
                        <Gallery />
                    </TuiDialogsProvider>
                </TuiNotificationsProvider>
            </TuiThemeProvider>
        </TuiRoot>
    );
}

function Gallery() {
    const {dark, toggle} = useTuiTheme();
    const dialogs = useTuiDialogs();
    const notifications = useTuiNotifications();

    const [name, setName] = useState('');
    const [disk, setDisk] = useState<number | null>(40);
    const [region, setRegion] = useState<string | null>(REGIONS[0]);
    const [preset, setPreset] = useState<string | null>('Standard 4·8 · 4 vCPU · 8 ГБ');
    const [filter, setFilter] = useState(0);
    const [agreed, setAgreed] = useState(true);
    const [autostart, setAutostart] = useState(false);
    const [tls, setTls] = useState('strict');
    const [page, setPage] = useState(0);
    const [tab, setTab] = useState(0);
    const [notes, setNotes] = useState('Заметка о сервере');
    const [accordion, setAccordion] = useState(0);
    const [pagerIndex, setPagerIndex] = useState(3);

    return (
        <div className="page">
            <TuiHeader>
                <TuiTitle>
                    taiga-ui-react
                    <TuiSubtitle>порт дизайн-системы Taiga UI · те же токены, стили и анимации</TuiSubtitle>
                </TuiTitle>
                <span className="header-side">
                    <TuiBadge appearance="accent" size="s">0.2.0</TuiBadge>
                    <TuiSwitch checked={dark} onCheckedChange={toggle} aria-label="Тёмная тема" />
                </span>
            </TuiHeader>

            <div className="grid">
                <Section title="Кнопки" subtitle="размеры s и m — как в реальных интерфейсах">
                    <TuiButton size="m">Primary m</TuiButton>
                    <TuiButton size="s">Primary s</TuiButton>
                    <TuiButton appearance="secondary" size="s">Secondary</TuiButton>
                    <TuiButton appearance="secondary-grayscale" size="s">Grayscale</TuiButton>
                    <TuiButton appearance="flat-grayscale" size="s">Flat</TuiButton>
                    <TuiButton appearance="outline" size="s">Outline</TuiButton>
                    <TuiButton size="s" iconStart="@tui.plus">С иконкой</TuiButton>
                    <TuiButton size="s" iconEnd="@tui.chevron-down" appearance="secondary">С шевроном</TuiButton>
                    <TuiButton size="s" loading>Загрузка</TuiButton>
                    <TuiIconButton iconStart="@tui.settings" size="s" title="Настройки" />
                    <TuiIconButton iconStart="@tui.bell" size="s" title="Уведомления" />
                </Section>

                <Section title="Бейджи, чипы, аватары">
                    <span className="row">
                        <TuiBadge size="s">Default</TuiBadge>
                        <TuiBadge appearance="primary" size="s">Primary</TuiBadge>
                        <TuiBadge appearance="accent" size="s">Accent</TuiBadge>
                        <TuiBadge appearance="positive" size="s">Success</TuiBadge>
                        <TuiBadge appearance="warning" size="s">Warning</TuiBadge>
                        <TuiBadge appearance="negative" size="s">Error</TuiBadge>
                    </span>
                    <span className="row">
                        <TuiChip size="s">Чип</TuiChip>
                        <TuiChip size="s" iconStart="@tui.check">Выбран</TuiChip>
                        <TuiChip size="s" appearance="accent" iconEnd="@tui.x">Удаляемый</TuiChip>
                    </span>
                    <span className="row">
                        <TuiAvatar content="МИ" size="s" />
                        <TuiAvatar content="АК" size="s" />
                        <TuiAvatar content="ДО" size="s" />
                        <TuiAvatar content="@tui.user-round" size="s" />
                    </span>
                </Section>

                <Section title="Поля ввода" subtitle="размеры m/s">
                    <TuiTextfield size="l" iconStart="@tui.search" cleaner onClear={() => setName('')}>
                        <TuiInput
                            placeholder="Имя машины"
                            value={name}
                            onInput={(event) => setName(event.currentTarget.value)}
                        />
                    </TuiTextfield>

                    <TuiLabel>
                        Регион
                        <TuiSelect items={REGIONS} value={region} onValueChange={setRegion} size="s" />
                    </TuiLabel>

                    <TuiLabel>
                        Пресет
                        <TuiSelect items={['Standard 2·4', 'Standard 4·8 · 4 vCPU · 8 ГБ', 'General 8·16']} value={preset} onValueChange={setPreset} size="m" />
                    </TuiLabel>

                    <TuiTextfield size="s">
                        <TuiLabel>
                            Диск, ГБ
                            <TuiInputNumber value={disk} onValueChange={setDisk} min={10} max={500} step={10} size="s" />
                        </TuiLabel>
                    </TuiTextfield>

                    <TuiTextfield size="m">
                        <TuiLabel>
                            Заметка
                            <TuiTextarea rows={3} value={notes} onInput={(e) => setNotes(e.currentTarget.value)} />
                        </TuiLabel>
                    </TuiTextfield>

                    <span className="row">
                        <TuiSegmented
                            items={['Все', 'Работают', 'Остановлены', 'Ошибки']}
                            activeIndex={filter}
                            onActiveIndexChange={setFilter}
                        />
                    </span>

                    <label className="row option">
                        <TuiCheckbox size="s" checked={agreed} onCheckedChange={setAgreed} />
                        Согласен с условиями
                    </label>
                    <label className="row option">
                        <TuiSwitch size="s" checked={autostart} onCheckedChange={setAutostart} />
                        Автозапуск
                    </label>
                    <span className="row option">
                        <TuiRadio name="tls" checked={tls === 'strict'} onChange={() => setTls('strict')} />
                        Strict TLS
                        <TuiRadio name="tls" checked={tls === 'auto'} onChange={() => setTls('auto')} />
                        Auto
                    </span>
                </Section>

                <Section title="Оверлеи" subtitle="дропдауны, хинты, диалоги, уведомления">
                    <TuiDropdown
                        content={
                            <TuiDataList>
                                <TuiOptGroup label="Действия">
                                    <TuiOption onClick={() => notifications.notify('Перезапуск запущен', {appearance: 'info', label: 'Операция'})}>
                                        Перезапустить
                                    </TuiOption>
                                    <TuiOption onClick={() => notifications.notify('ВМ остановлена', {appearance: 'warning', label: 'Внимание'})}>
                                        Остановить
                                    </TuiOption>
                                </TuiOptGroup>
                                <TuiOption disabled>Заблокировано</TuiOption>
                            </TuiDataList>
                        }
                    >
                        <TuiButton appearance="secondary" size="s" iconEnd="@tui.chevron-down">Меню действий</TuiButton>
                    </TuiDropdown>

                    <TuiHint content="Хинт появляется при наведении — как в Angular-версии">
                        <TuiButton appearance="secondary" size="s">Наведи на меня</TuiButton>
                    </TuiHint>

                    <TuiButton
                        size="s"
                        onClick={() =>
                            dialogs.open<number>((handle) => (
                                <TuiConfirmContent
                                    content="Удалить ВМ api-gateway-prod? Действие необратимо."
                                    yes="Удалить"
                                    no="Отмена"
                                    onYes={() => {
                                        handle.resolve(1);
                                        notifications.notify('ВМ удалена', {appearance: 'negative', label: 'Удалено'});
                                    }}
                                    onNo={handle.dismiss}
                                />
                            ), {label: 'Удалить ВМ?', size: 's'})
                        }
                    >
                        Подтверждение…
                    </TuiButton>

                    <TuiButton size="s" onClick={() => notifications.notify('Платёж принят: 50 000 ₽', {appearance: 'positive', label: 'Готово'})}>
                        Уведомление
                    </TuiButton>

                    <TuiButton
                        appearance="secondary"
                        size="s"
                        onClick={() =>
                            dialogs.open((handle) => (
                                <div className="dialog-body">
                                    <TuiTextfield size="s">
                                        <TuiLabel>
                                            Название
                                            <TuiInput placeholder="app-server-1" />
                                        </TuiLabel>
                                    </TuiTextfield>
                                    <div className="dialog-footer">
                                        <TuiButton appearance="secondary" size="s" onClick={handle.dismiss}>Закрыть</TuiButton>
                                    </div>
                                </div>
                            ), {label: 'Диалог', size: 's'})
                        }
                    >
                        Открыть диалог
                    </TuiButton>
                </Section>

                <Section title="Табы и аккордеон">
                    <TuiTabs activeIndex={tab} onActiveIndexChange={setTab}>
                        <TuiTab active={tab === 0}>Обзор</TuiTab>
                        <TuiTab active={tab === 1}>Мониторинг</TuiTab>
                        <TuiTab active={tab === 2}>Настройки</TuiTab>
                    </TuiTabs>
                    <TuiAccordion>
                        <TuiAccordionItem
                            content="Панель управления, консоли, ключи доступа и сеть."
                            open={accordion === 0}
                            onOpenChange={(open) => setAccordion(open ? 0 : -1)}
                        >
                            Инфраструктура
                        </TuiAccordionItem>
                        <TuiAccordionItem
                            content="Пользователи, роли и приглашения."
                            open={accordion === 1}
                            onOpenChange={(open) => setAccordion(open ? 1 : -1)}
                        >
                            Доступы
                        </TuiAccordionItem>
                    </TuiAccordion>
                </Section>

                <Section title="Навигация">
                    <TuiBreadcrumbs>
                        <TuiBreadcrumbItem href="#">Проект</TuiBreadcrumbItem>
                        <TuiBreadcrumbItem href="#">Виртуальные машины</TuiBreadcrumbItem>
                        <TuiBreadcrumbItem href="#" aria-current="page">pg-primary</TuiBreadcrumbItem>
                    </TuiBreadcrumbs>
                    <TuiPagination length={12} index={pagerIndex} onIndexChange={setPagerIndex} texts={{previous: 'Предыдущий', next: 'Следующий'}} />
                </Section>

                <Section title="Таблица" subtitle="[tuiTable] + пагинация строк">
                    <TuiTable>
                        <thead>
                            <tr>
                                <TuiTh>Имя</TuiTh>
                                <TuiTh>Пресет</TuiTh>
                                <TuiTh>Сеть</TuiTh>
                                <TuiTh>CPU</TuiTh>
                                <TuiTh>Цена/мес</TuiTh>
                            </tr>
                        </thead>
                        <TuiTbody>
                            {VMS.slice(page * 2, page * 2 + 2).map((vm) => (
                                <tr key={vm.name}>
                                    <TuiTd>
                                        <strong>{vm.name}</strong>
                                    </TuiTd>
                                    <TuiTd>{vm.preset}</TuiTd>
                                    <TuiTd className="mono">{vm.ip}</TuiTd>
                                    <TuiTd>
                                        <span className="cpu">
                                            <TuiProgressBar value={vm.cpu} />
                                            <span className="dim">{vm.cpu}%</span>
                                        </span>
                                    </TuiTd>
                                    <TuiTd>{vm.price}</TuiTd>
                                </tr>
                            ))}
                        </TuiTbody>
                    </TuiTable>
                    <TuiTablePagination
                        total={VMS.length}
                        page={page}
                        size={2}
                        items={[2, 5]}
                        onPageChange={setPage}
                        texts={{pages: 'Страниц', linesPerPage: 'Строк на страницу', of: 'из', previous: 'Предыдущий', next: 'Следующий'}}
                    />
                </Section>

                <Section title="Графики" subtitle="tui-axes + tui-bar-chart / tui-line-chart">
                    <TuiAxes
                        className="chart chart-bar"
                        axisYLabels={['0', '50', '100']}
                        axisXLabels={SPEND.map(([month]) => month)}
                        horizontalLines={2}
                    >
                        <TuiBarChart value={SPEND.map(([, amount]) => [amount])} max={100} />
                    </TuiAxes>
                    <TuiAxes
                        className="chart chart-line"
                        axisYLabels={['0%', '50%', '100%']}
                        horizontalLines={2}
                    >
                        <TuiLineChart
                            value={CPU.map((y, x) => [x, y] as [number, number])}
                            x={0}
                            y={0}
                            width={23}
                            height={100}
                            dots
                        />
                    </TuiAxes>
                </Section>

                <Section title="Состояния">
                    <TuiNotification appearance="info" label="Совет">
                        Уведомление в статичном виде
                    </TuiNotification>
                    <span className="row">
                        <TuiProgressBar value={67} />
                        <span className="dim">67%</span>
                        <TuiLoader size="1.25rem" />
                        <TuiLink href="https://taiga-ui.dev">Ссылка</TuiLink>
                    </span>
                    <TuiBlockStatus
                        icon="@tui.search"
                        title="Ничего не найдено"
                        subtitle="Попробуйте изменить условия поиска"
                        actions={<TuiButton appearance="secondary" size="s">Сбросить фильтры</TuiButton>}
                    />
                    <span className="row">
                        <TuiSkeleton style={{inlineSize: '10rem', blockSize: '1rem'}} />
                        <TuiSkeleton style={{inlineSize: '6rem', blockSize: '1rem'}} />
                    </span>
                </Section>

                <Section title="Иконки" subtitle="подмножество @taiga-ui/icons (весь набор — 4000+ SVG)">
                    <span className="icons">
                        {ICONS.map((icon) => (
                            <TuiHint key={icon} content={`@tui.${icon}`}>
                                <span className="icon-cell">
                                    <TuiIcon icon={`@tui.${icon}`} />
                                </span>
                            </TuiHint>
                        ))}
                    </span>
                </Section>
            </div>
        </div>
    );
}

function Section({title, subtitle, children}: {title: string; subtitle?: string; children: React.ReactNode}) {
    return (
        <TuiSurface appearance="outline-grayscale" className="section">
            <TuiTitle>
                {title}
                {subtitle ? <TuiSubtitle>{subtitle}</TuiSubtitle> : null}
            </TuiTitle>
            <div className="section-body">{children}</div>
        </TuiSurface>
    );
}
