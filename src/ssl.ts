import fs from 'fs';
import { SslCertificate } from './types';

export const tryGetSslCertificate = (
	sslLocationPrivateKey: string,
	sslLocationPublicCert: string,
	encoding: BufferEncoding,
): SslCertificate => {
	try {
		const privateKey = fs.readFileSync(sslLocationPrivateKey, encoding);
		const publicCert = fs.readFileSync(sslLocationPublicCert, encoding);

		return new SslCertificate(privateKey, publicCert);
	} catch (e) {
		return new SslCertificate();
	}
};
