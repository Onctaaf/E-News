
export class QrCodeGeneratorService {
    
    generateQrCode(url: string): Promise<string> {
        return new Promise((resolve, reject) => {

            try {
                new URL(url);
            } catch {
                throw new Error('Invalid URL');
            }

            try {
                const qrCode = require('qrcode');
                qrCode.toDataURL(url, { width: 200 }, (err: any, dataUrl: string) => {
                    if (err) {
                        reject(err);
                    } else {
                        const imgTag = `<img class="qrCode" src="${dataUrl}" alt="qrcode for ${url}"/>`;
                        resolve(imgTag);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}