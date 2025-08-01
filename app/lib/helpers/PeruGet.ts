import { Peru } from "@/services/data/Peru";

export const PeruGet = (code: string) => {
    for (const [departamento, provincias] of Object.entries(Peru)) {
        for (const [provincia, distritos] of Object.entries(provincias)) {
            for (const [distrito, codigoActual] of Object.entries(distritos)) {
                if (codigoActual === code) {
                    return { departamento, provincia, distrito };
                }
            }
        }
    }
    return { departamento: "", provincia: "", distrito: "" };
}