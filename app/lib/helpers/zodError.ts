import { z } from "zod";
import type { SchemaError } from "../types/global/Global";


export const validateData = <T>(schema: any, data: T): SchemaError<T> => {
    const result = schema.safeParse(data);

    if (!result.success) {
        return { success: false, data: errorMap(result.error.issues) as T };
    }

    return { success: true, data: {} }
};

const errorMap = (array: z.ZodIssue[]) => {
    return array.reduce<Record<string, any>>((acc, value) => {
        let current = acc;
        const path = value.path as string[];

        path.forEach((key, index) => {
            if (index === path.length - 1) {
                // Último nivel: asignar el mensaje de error
                current[key] = value.message;
            } else {
                // Si no existe, crear el objeto anidado
                current[key] = current[key] || {};
                current = current[key];
            }
        });

        return acc;
    }, {});
};