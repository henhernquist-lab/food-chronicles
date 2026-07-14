import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppThemeProvider } from './components/theme-provider';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<AppThemeProvider>
				<App />
			</AppThemeProvider>
		</BrowserRouter>
	</StrictMode>,
);