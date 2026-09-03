import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import 'taiga-ui-react/taiga-ui.css';
import 'taiga-ui-react/taiga-ui-fonts.css';

import {App} from './App';
import './demo.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
