import {useState, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode} from 'react';

import {iconVars} from '../../utils/icons';
import {TUI_VERSION} from '../../version';
import {join, TuiButton, TuiIconButton} from '../button/TuiButton';
import {TuiIcon} from '../icon/TuiIcon';
import type {CSSProperties} from 'react';

/** Степпер — порт tui-stepper: горизонтальные шаги с аватарами-номерами. */
export function TuiStepper({
    activeIndex = 0,
    onActiveIndexChange,
    size = 'm',
    children,
    ...rest
}: HTMLAttributes<HTMLElement> & {
    activeIndex?: number;
    onActiveIndexChange?: (index: number) => void;
    size?: 's' | 'm';
    children?: ReactNode;
}) {
    return (
        <tui-stepper data-tui-version={TUI_VERSION} data-size={size} {...rest}>
            {children}
        </tui-stepper>
    );
}

export function TuiStep({
    active,
    index,
    onClick,
    children,
    ...rest
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
    active?: boolean;
    /** Номер шага (контент аватара). */
    index?: number;
    className?: string;
}) {
    return (
        <button
            tuistep=""
            type="button"
            data-tui-version={TUI_VERSION}
            className={join(active && '_active')}
            {...rest}
            onClick={onClick}
        >
            <div tuiavatar={String((index ?? 0) + 1)} />
            {children}
        </button>
    );
}

/** Счётчик — порт tui-counter: кнопки −/+ со значением между ними. */
export function TuiCounter({
    value = 0,
    onValueChange,
    min = 0,
    max = 99,
    step = 1,
    size = 'm',
    appearance = 'secondary',
    className,
    ...rest
}: HTMLAttributes<HTMLElement> & {
    value?: number;
    onValueChange?: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    size?: 's' | 'm' | 'l';
    appearance?: 'secondary' | 'secondary-grayscale' | 'flat-grayscale' | 'outline' | 'primary';
}) {
    const clamp = (next: number) => Math.min(max, Math.max(min, next));

    return (
        <tui-counter data-tui-version={TUI_VERSION} data-size={size} className={className} {...rest}>
            <TuiIconButton
                appearance={appearance}
                size={size}
                iconStart="@tui.minus"
                disabled={value <= min}
                aria-label="Уменьшить"
                onClick={() => onValueChange?.(clamp(value - step))}
                style={{...iconVars({start: '@tui.minus'})} as CSSProperties}
            >
                Уменьшить
            </TuiIconButton>
            <output tuifade="" className="t-content">
                {value}
            </output>
            <TuiIconButton
                appearance={appearance}
                size={size}
                iconStart="@tui.plus"
                disabled={value >= max}
                aria-label="Увеличить"
                onClick={() => onValueChange?.(clamp(value + step))}
                style={{...iconVars({start: '@tui.plus'})} as CSSProperties}
            >
                Увеличить
            </TuiIconButton>
        </tui-counter>
    );
}

/** Копирование в буфер — порт [tuiCopy]: клик копирует текст, галочка-фидбек. */
export function TuiCopy({
    text,
    successDuration = 1500,
    size = 's',
    children,
    className,
    ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
    text: string;
    successDuration?: number;
    size?: 'xs' | 's' | 'm' | 'l';
    children?: ReactNode;
}) {
    const [copied, setCopied] = useState(false);

    return (
        <button
            tuicopy=""
            tuiiconbutton=""
            tuiappearance=""
            tuiicons=""
            data-tui-version={TUI_VERSION}
            data-appearance="icon"
            data-size={size}
            data-state={copied ? 'hover' : undefined}
            className={join('tui-interactive', className)}
            aria-label="Копировать"
            onClick={(event) => {
                // clipboard API может зависать без разрешения (headless): гонка с таймаутом
                void Promise.race([
                    navigator.clipboard?.writeText(text) ?? Promise.reject(new Error('no clipboard')),
                    new Promise((resolve) => setTimeout(resolve, 150)),
                ]).catch(() => {
                    const area = document.createElement('textarea');

                    area.value = text;
                    area.style.position = 'fixed';
                    area.style.opacity = '0';
                    document.body.append(area);
                    area.select();

                    try {
                        document.execCommand('copy');
                    } catch {
                        // буфер недоступен — событие всё равно сигнализирует попытку
                    } finally {
                        area.remove();
                    }
                });

                setCopied(true);
                setTimeout(() => setCopied(false), successDuration);

                event.currentTarget.dispatchEvent(new CustomEvent('tui-copied', {detail: text, bubbles: true}));
            }}
            {...rest}
        >
            {children ?? (
                <TuiIcon icon={copied ? '@tui.check' : '@tui.copy'} />
            )}
        </button>
    );
}

/** Статус-строка — порт [tuiStatus]: цветной индикатор + текст. */
export function TuiStatus({
    color = 'var(--tui-status-neutral)',
    children,
    className,
    ...rest
}: HTMLAttributes<HTMLSpanElement> & {color?: string}) {
    return (
        <span tuistatus="" style={{color}} className={className} {...rest}>
            {children}
        </span>
    );
}

/** Рейтинг — порт tui-rating: звёзды, управляемые кликом. */
export function TuiRating({
    value = 0,
    onValueChange,
    max = 5,
    disabled,
    readOnly,
    className,
    ...rest
}: Omit<HTMLAttributes<HTMLElement>, 'onChange'> & {
    value?: number;
    onValueChange?: (value: number) => void;
    max?: number;
    disabled?: boolean;
    readOnly?: boolean;
}) {
    return (
        <tui-rating data-tui-version={TUI_VERSION} className={className} {...rest}>
            <span className="t-items">
                {Array.from({length: max}, (_, index) => {
                    const star = index + 1;

                    return (
                        <button
                            key={star}
                            type="button"
                            className="t-item"
                            disabled={disabled || readOnly}
                            aria-label={`${star} из ${max}`}
                            onClick={() => onValueChange?.(star)}
                        >
                            <TuiIcon icon={star <= value ? '@tui.star-filled' : '@tui.star'} />
                        </button>
                    );
                })}
            </span>
        </tui-rating>
    );
}

/** Бейдж-уведомление — порт [tuiBadgeNotification]: маленький счётчик. */
export function TuiBadgeNotification({
    children,
    size = 'm',
    className,
    ...rest
}: HTMLAttributes<HTMLDivElement> & {size?: 'xs' | 's' | 'm'}) {
    return (
        <div tuibadgenotification="" data-tui-version={TUI_VERSION} data-size={size} className={className} {...rest}>
            {children}
        </div>
    );
}

/** Контент с бейджем в углу — порт [tuiBadgedContent]. */
export function TuiBadgedContent({
    badge,
    children,
    className,
    ...rest
}: HTMLAttributes<HTMLDivElement> & {badge?: ReactNode}) {
    return (
        <div tuibadgedcontent="" data-tui-version={TUI_VERSION} className={className} {...rest}>
            {children}
            {badge ? <div className="t-badge">{badge}</div> : null}
        </div>
    );
}

/** Стек аватаров — порт tui-avatar-stack. */
export function TuiAvatarStack({
    items,
    size = 'm',
    max = 3,
    className,
    ...rest
}: HTMLAttributes<HTMLDivElement> & {
    items: ReadonlyArray<{content: string}>;
    size?: 'xs' | 's' | 'm' | 'l';
    max?: number;
}) {
    const visible = items.slice(0, max);
    const rest2 = items.length - visible.length;

    return (
        <div tuiavatarstack="" data-tui-version={TUI_VERSION} className={className} {...rest}>
            {visible.map((item, index) => (
                <div key={index} tuiavatar={item.content} data-size={size} style={{zIndex: max - index}} />
            ))}
            {rest2 > 0 ? <div tuiavatar={`+${rest2}`} data-size={size} /> : null}
        </div>
    );
}

/** Легенда графика — порт tui-legend-item. */
export function TuiLegendItem({
    color,
    active,
    disabled,
    onClick,
    children,
    className,
    ...rest
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
    color: string;
    active?: boolean;
    disabled?: boolean;
    className?: string;
}) {
    return (
        <button
            tuilegenditem=""
            type="button"
            data-tui-version={TUI_VERSION}
          data-size="m"
            className={join(disabled && '_disabled', className)}
            aria-pressed={active}
            onClick={onClick}
            {...rest}
        >
            <span className="t-wrapper">
                <span className="t-dot" style={{background: color}} />
                {children}
            </span>
        </button>
    );
}

/** Line-clamp — порт [tuiLineClamp]: обрезка текста с кнопкой «ещё». */
export function TuiLineClamp({
    lines = 2,
    expandable = true,
    children,
    className,
    ...rest
}: HTMLAttributes<HTMLDivElement> & {
    lines?: number;
    expandable?: boolean;
}) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            tuilineclamp=""
            data-tui-version={TUI_VERSION}
            className={className}
            style={{'--t-lines': lines} as CSSProperties}
            {...rest}
        >
            <div className="t-clamp" style={{WebkitLineClamp: expanded ? 'unset' : lines, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                {children}
            </div>
            {expandable ? (
                <TuiButton
                    appearance="flat"
                    size="xs"
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? 'Свернуть' : 'Ещё'}
                </TuiButton>
            ) : null}
        </div>
    );
}
