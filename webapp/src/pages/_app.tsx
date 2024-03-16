import '../styles/globals.css';

import type { AppProps } from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';

import { UserContextProvider } from '../contexts/userContext';
import { store } from '../store/store';
import { ModalProvider } from 'src/contexts/modalContext';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Provider store={store}>
				<UserContextProvider>
					<ModalProvider>
						<Component {...pageProps} />
					</ModalProvider>
				</UserContextProvider>
			</Provider>
		</>
	);
}

export default MyApp;
