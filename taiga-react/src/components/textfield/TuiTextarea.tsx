import {useContext, type TextareaHTMLAttributes} from 'react';

import {TUI_VERSION} from '../../version';
import {join} from '../button/TuiButton';
import {TextfieldContext} from '../textfield/TuiTextfield';

export type TuiTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

/** Многострочное поле — порт [tuiTextarea], вкладывается в TuiTextfield. */
export function TuiTextarea({value, className, ...rest}: TuiTextareaProps) {
    const {size} = useContext(TextfieldContext);
    const empty = value === '' || value === undefined || value === null;

    return (
        <textarea
            tuitextarea=""
            data-tui-version={TUI_VERSION}
            data-size={size}
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
    );
}
