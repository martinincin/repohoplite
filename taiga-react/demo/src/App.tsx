import {useState} from 'react';

import {
    TuiAvatar,
    TuiBadge,
    TuiButton,
    TuiCard,
    TuiCheckbox,
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
    TuiLink,
    TuiLoader,
    TuiNotificationsProvider,
    TuiOptGroup,
    TuiOption,
    TuiProgressBar,
    TuiRoot,
    TuiSegmented,
    TuiSelect,
    TuiSubtitle,
    TuiSurface,
    TuiSwitch,
    TuiTable,
    TuiTablePagination,
    TuiTd,
    TuiTextfield,
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
    const [filter, setFilter] = useState(0);
    const [agreed, setAgreed] = useState(true);
    const [autostart, setAutostart] = useState(false);
    const [page, setPage] = useState(0);

    return (
        <div className="page">
            <TuiHeader>
                <TuiTitle>
                    taiga-ui-react
                    <TuiSubtitle>порт дизайн-системы Taiga UI · те же токены, стили и анимации</TuiSubtitle>
                </TuiTitle>
                <span className="header-side">
                    <TuiBadge appearance="accent">0.1.0</TuiBadge>
                    <TuiSwitch checked={dark} onCheckedChange={toggle} aria-label="Тёмная тема" />
                </span>
            </TuiHeader>

            <div className="grid">
                <Section title="Кнопки" subtitle="все appearance и размеры">
                    <TuiButton>Primary</TuiButton>
                    <TuiButton appearance="secondary">Secondary</TuiButton>
                    <TuiButton appearance="secondary-grayscale">Secondary grayscale</TuiButton>
                    <TuiButton appearance="flat-grayscale">Flat grayscale</TuiButton>
                    <TuiButton appearance="outline">Outline</TuiButton>
                    <TuiButton iconStart="@tui.plus">С иконкой</TuiButton>
                    <TuiButton iconEnd="@tui.chevron-down" appearance="secondary">С шевроном</TuiButton>
                    <TuiButton size="s" appearance="secondary">Small</TuiButton>
                    <TuiButton size="xs" appearance="secondary">Extra small</TuiButton>
                    <TuiIconButton iconStart="@tui.settings" title="Настройки" />
                    <TuiIconButton iconStart="@tui.bell" title="Уведомления" appearance="secondary" />
                </Section>

                <Section title="Бейджи и аватары">
                    <span className="row">
                        <TuiBadge>Default</TuiBadge>
                        <TuiBadge appearance="primary">Primary</TuiBadge>
                        <TuiBadge appearance="accent">Accent</TuiBadge>
                        <TuiBadge appearance="positive">Success</TuiBadge>
                        <TuiBadge appearance="warning">Warning</TuiBadge>
                        <TuiBadge appearance="negative">Error</TuiBadge>
                        <TuiBadge appearance="neutral">Neutral</TuiBadge>
                    </span>
                    <span className="row">
                        <TuiAvatar content="МИ" />
                        <TuiAvatar content="АК" />
                        <TuiAvatar content="ДО" />
                        <TuiAvatar content="@tui.user-round" />
                    </span>
                </Section>

                <Section title="Поля ввода">
                    <TuiTextfield iconStart="@tui.search" cleaner onClear={() => setName('')}>
                        <TuiInput
                            placeholder="Имя машины"
                            value={name}
                            onInput={(event) => setName(event.currentTarget.value)}
                        />
                    </TuiTextfield>

                    <TuiTextfield size="s">
                        <TuiLabel>
                            Регион
                            <TuiSelect items={REGIONS} value={region} onValueChange={setRegion} />
                        </TuiLabel>
                    </TuiTextfield>

                    <TuiTextfield>
                        <TuiLabel>
                            Диск, ГБ
                            <TuiInputNumber value={disk} onValueChange={setDisk} min={10} max={500} step={10} />
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
                        <TuiCheckbox checked={agreed} onCheckedChange={setAgreed} />
                        Согласен с условиями
                    </label>
                    <label className="row option">
                        <TuiSwitch checked={autostart} onCheckedChange={setAutostart} />
                        Автозапуск при создании
                    </label>
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
                        <TuiButton appearance="secondary" iconEnd="@tui.chevron-down">Меню действий</TuiButton>
                    </TuiDropdown>

                    <TuiHint content="Хинт появляется при наведении — как в Angular-версии">
                        <TuiButton appearance="secondary">Наведи на меня</TuiButton>
                    </TuiHint>

                    <TuiButton
                        appearance="secondary"
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

                    <TuiButton onClick={() => notifications.notify('Платёж принят: 50 000 ₽', {appearance: 'positive', label: 'Готово'})}>
                        Положительное уведомление
                    </TuiButton>
                    <TuiButton
                        appearance="secondary"
                        onClick={() =>
                            dialogs.open((handle) => (
                                <div className="dialog-body">
                                    <p>Обычный диалог с формой и любым содержимым.</p>
                                    <div className="dialog-footer">
                                        <TuiButton appearance="secondary" onClick={handle.dismiss}>Закрыть</TuiButton>
                                    </div>
                                </div>
                            ), {label: 'Диалог', size: 'm'})
                        }
                    >
                        Открыть диалог
                    </TuiButton>
                </Section>

                <Section title="Таблица" subtitle="[tuiTable] + пагинация">
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

                <Section title="Индикаторы">
                    <span className="row">
                        <TuiProgressBar value={67} />
                        <span className="dim">67%</span>
                    </span>
                    <span className="row">
                        <TuiLoader />
                        <TuiLink href="https://taiga-ui.dev">Ссылка как [tuiLink]</TuiLink>
                        <TuiIcon icon="@tui.info" />
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
