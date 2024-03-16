import { Buffer } from 'buffer';
import { decrypt, encrypt } from 'crypto-js/aes';
import * as cryptoUtf8 from 'crypto-js/enc-utf8';

export enum LocalStorageLabel {
	User = 'user',
}

const encryptData = (data: string) => {
	const secretKey = process.env.NEXT_PUBLIC_SAFE_STORAGE ?? 'abcde';
	if (!secretKey) throw new Error('No secret key defined');

	const encodedString = Buffer.from(data).toString('base64');
	const encryptedData = encrypt(encodedString, secretKey);
	return encryptedData.toString();
};
const decryptData = (encryptedData: string) => {
	const secretKey = process.env.NEXT_PUBLIC_SAFE_STORAGE ?? 'abcde';
	if (!secretKey) throw new Error('No secret key defined');

	const decryptedData = decrypt(encryptedData, secretKey);
	return JSON.parse(Buffer.from(cryptoUtf8.stringify(decryptedData), 'base64').toString());
};
const putToStorage = (label: LocalStorageLabel, data: unknown) => {
	const encryptedLabel = Buffer.from(label).toString('base64');
	const encryptedData = encryptData(JSON.stringify(data));
	localStorage.setItem(encryptedLabel, encryptedData);
};
const removeFromStorage = (label: LocalStorageLabel) => {
	const encryptedLabel = Buffer.from(label).toString('base64');

	localStorage.removeItem(encryptedLabel);
};
const getFromStorage = <T,>(label: LocalStorageLabel): T | undefined => {
	const encryptedLabel = Buffer.from(label).toString('base64');
	const encryptedData = localStorage.getItem(encryptedLabel);

	if (encryptedData) {
		return decryptData(encryptedData);
	}
	return undefined;
};

/**
 * Retrieve Local Storage Data
 */
// useEffect(() => {
// 	const fetched = async () => {
// 		const userFromLocalStorage = getFromStorage<UserType>(LocalStorageLabel.User);
// 		if (userFromLocalStorage && userFromLocalStorage.pseudo !== '' && userFromLocalStorage.email !== '')
// 			await setUser(userFromLocalStorage);
// 	};
//
// 	setLoading(true);
// 	fetched().then(() => {
// 		setLoading(false);
// 	});
// }, []);

export { getFromStorage, putToStorage, removeFromStorage };
