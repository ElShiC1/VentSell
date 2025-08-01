export type NumberFormat = '%' | 'S/' | '';


export const NumberLenght = (
    _format: unknown, // Ya no se usa, puedes quitar este parámetro si quieres
    valObject: Record<string, string>,
    length: number,
    callback: (val: Record<string, string>) => void
): void => {
    const keys = Object.keys(valObject);
    if (keys.length !== 1) return;

    const key = keys[0];
    const value = valObject[key] ?? '';

    // Solo permitir números con longitud exacta
    const regex = new RegExp(`^[0-9+]*$`)
    if (!regex.test(value)) return;

    callback({ [key]: value });
};


export const NumberVal = (
    format: NumberFormat,
    valObject: Record<string, string>,
    callback: (val: Record<string, string>) => void
): void => {
    // Solo procesar si valObject tiene exactamente una clave
    const keys = Object.keys(valObject);
    if (keys.length !== 1) return;

    const key = keys[0];
    const value = valObject[key] ?? '';
    const rawValue = value.replace(format, '');

    // Permitir solo números con hasta 2 decimales
    if (!/^\d*(\.\d{0,2})?$/.test(rawValue)) return;

    let processedValue = rawValue;

    // Eliminar ceros a la izquierda (excepto "0." o "0")
    if (processedValue.startsWith('0') && processedValue.length > 1 && !processedValue.startsWith('0.')) {
        processedValue = processedValue.replace(/^0+/, '') || '0';
    }

    // Si el campo está vacío, poner "0"
    if (processedValue === '') {
        processedValue = '0';
    }

    callback({ [key]: `${processedValue}` });
};


export const ConverNum = (string: string | number | undefined): number => {
    if (string === undefined || string === null) {
        return 0;
    }

    if (typeof string === 'number') {
        return string;
    }

    const rawValue = string.replace('S/', '').replace('%', '');
    return parseFloat(rawValue) || 0;
} 