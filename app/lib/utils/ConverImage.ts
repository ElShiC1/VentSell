export async function resizeAndConvertToBase64High(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            if (!e.target?.result) return reject('No file data');
            img.src = e.target.result as string;
        };

        img.onload = () => {
            // Recortar la imagen a cuadrado centrado y limitar a 300x300px
            const maxDim = 300;
            const minSide = Math.min(img.width, img.height);
            // Coordenadas para recortar el centro
            const sx = (img.width - minSide) / 2;
            const sy = (img.height - minSide) / 2;

            const canvas = document.createElement('canvas');
            canvas.width = maxDim;
            canvas.height = maxDim;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject('No canvas context');
            // Dibuja el recorte cuadrado centrado y lo escala a 300x300
            ctx.drawImage(
                img,
                sx, sy, minSide, minSide, // origen y tamaño del recorte
                0, 0, maxDim, maxDim      // destino y tamaño final
            );

            // Ajusta la calidad para que pese al menos 15KB pero no mucho más de 40KB
            let quality = 0.92;
            let base64 = '';
            let sizeKB = 0;
            do {
                base64 = canvas.toDataURL('image/jpeg', quality);
                sizeKB = Math.round((base64.length * (3 / 4)) / 1024);
                if (sizeKB < 15) {
                    quality += 0.03; // Sube la calidad si pesa muy poco
                } else if (sizeKB > 40) {
                    quality -= 0.05; // Baja la calidad si pesa mucho
                }
            } while ((sizeKB < 15 || sizeKB > 40) && quality > 0.1 && quality <= 1);

            resolve(base64);
        };

        img.onerror = reject;
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export async function resizeAndConvertToBase64Low(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            if (!e.target?.result) return reject('No file data');
            img.src = e.target.result as string;
        };

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 100;
            canvas.height = 100;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject('No canvas context');
            ctx.drawImage(img, 0, 0, 100, 100);

            // Ajusta la calidad para reducir el peso de la imagen
            let quality = 0.7;
            let base64 = '';
            do {
                base64 = canvas.toDataURL('image/jpeg', quality);
                // Calcula el tamaño en KB
                const sizeKB = Math.round((base64.length * (3/4)) / 1024);
                if (sizeKB <= 8) break;
                quality -= 0.05;
            } while (quality > 0.1);
            resolve(base64);
        };

        img.onerror = reject;
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}