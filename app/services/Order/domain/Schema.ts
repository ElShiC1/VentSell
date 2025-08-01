import { SchemaClient } from "@/services/Client/domain/Schema";
import { SchemaProduct } from "@/services/Products/domain/Schema";
import { z } from "zod";

export const OrderSchema = z.object({
  order: z.object({
    payment: z.string({
      required_error: "Metodo de pago requerido",
      invalid_type_error: "El método de pago debe ser un texto",
    }).min(1, { message: "El método de pago no puede estar vacío" }),

    ubigeoCode: z.string().regex(/^\d+(\.\d+)?$/, "Debe ser un número").optional(),
    idCl: z.number({required_error: "Cliente Requerido"}).min(0),
    shipPrice: z.union([
      z.string().regex(/^\d+(\.\d+)?$/, "Debe ser un número").transform(Number).refine(val => val >= 0, "Valor Invalido"),
      z.number().min(0, "Cantidad invalidad"),
    ], {
      required_error: "Requerido",
      invalid_type_error: "Requerido",
    }).optional(),

    shiptype: z.string({
      required_error: "El tipo de envío es requerido",
      invalid_type_error: "El tipo de envío debe ser un texto",
    }).min(1, { message: "El tipo de envío no puede estar vacío" }).optional(),

    address: z.string({
      required_error: "La dirección es requerida",
      invalid_type_error: "La dirección debe ser un texto",
    }).min(5, { message: "La dirección debe tener al menos 5 caracteres" }).optional(),

    note: z.string().optional(),

    igv: z.union([
      z.string().regex(/^\d+(\.\d+)?$/, "Debe ser un número").transform(Number).refine(val => val >= 0, "Valor Invalido"),
      z.number().min(0, "Cantidad invalidad"),
    ], {
      required_error: "Requerido",
      invalid_type_error: "Requerido",
    }).optional(),
  }),

  products: z.array(z.any()).min(1, { message: "Debe haber al menos un producto" }),
})