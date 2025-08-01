import { z } from "zod";

export const SchemaProduct = z.object({
    id: z.number().optional(),
    name: z.string({ required_error: "El nombre es obligatorio" }).min(1, "El nombre es obligatorio"),
    category: z.string({ required_error: "La categoria es obligatorio" }).min(3, "Minimo 3 caracteres."),
    cost: z.union([
        z.string().regex(/^\d+(\.\d+)?$/, "Debe ser un número").transform(Number).refine(val => val >= 0, "Costo invalido"),
        z.number().min(0, "Cantidad invalidad"),
    ]),
    description: z.string().optional(),
    salePrice: z.union([
        z.string().regex(/^\d+(\.\d+)?$/, "Debe ser un número").transform(Number).refine(val => val >= 0.10, "Mayor a 0.10"),
        z.number().min(0, "Cantidad invalidad"),
    ]),
    quantity: z.union([
        z.number().min(0, "Cantidad invalidad"),
        z.string().regex(/^\d+$/, "Debe ser un número").transform(Number).refine(val => val >= 0, "Cantidad invalidad")
    ]).default(0),
    status: z.number().optional(),
    createAt: z.string().datetime().optional(),
    updateAt: z.string().datetime().optional(),
    img: z.union([
        z.instanceof(File).optional(),
        z.string().url("Debe ser una URL valida").optional()
    ]),
    imgthumb:z.union([
        z.instanceof(File).optional(),
        z.string().url("Debe ser una URL valida").optional()
    ]),
})
    .refine(
        (data) => Number(data.cost) <= Number(data.salePrice),
        {
            message: "Costo debe ser menor al precio",
            path: ["cost"]
        }
    )
    .refine(
        (data) => Number(data.cost) !== Number(data.salePrice),
        {
            message: "Costo y Precio no deben ser iguales",
            path: ["cost"]
        }
    )