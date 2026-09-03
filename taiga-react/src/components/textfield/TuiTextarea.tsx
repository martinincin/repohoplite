import {useContext, type TextareaHTMLAttributes} from 'react';

import {TUI_VERSION} from '../../version';
import {join} from '../button/TuiButton';
import {TextfieldContext} from '../textfield/TuiTextfield';

export type TuiTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    /** Показать счётчик символов (требует maxLength). */
    counter?: boolean;
};

/** Многострочное поле — порт [tuiTextarea], вкладывается в TuiTextfield. */
export function TuiTextarea({value, maxLength, counter, className, ...rest}: TuiTextareaProps) {
    const {size} = useContext(TextfieldContext);
    const empty = value === '' || value === undefined || value === null;
    const length = typeof value === 'string' ? value.length : 0;

    return (
        <>
            <textarea
                tuitextarea=""
                data-tui-version={TUI_VERSION}
                data-size={size}
                maxLength={maxLength}
                className={join(empty ? '_empty' : null, className)}
                value={value}
                onInput={(event) => {
                    const target = event.currentTarget;
                    const field = target.closest('tui-textfield');

                    target.classList.toggle('_empty', target.value === '');

                    if (field) {
                        field.classList.toggle('_empty', target.value === '');
                    }
                }}
                {...rest}
            />
            {counter && maxLength ? (
                <span className="t-counter" aria-hidden="true">
                    {length}/{maxLength}
                </span>
            ) : null}
        </>
    );
}
