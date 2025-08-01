import { z } from "zod";

export const SchemaClient = z.object({
  fullname: z.string({ required_error: "Cliente requerido" })
    .min(3, { message: 'Mínimo 3 caracteres' }),
  phone: z.string()
    .regex(/^[0-9+]*$/, { message: 'Celular inválido' })
    .optional(),
  tipoID: z.string().regex(/(DNI|CE)/).optional(),
  dni: z.string().regex(/^[0-9]*$/, { message: 'DNI o CE' }).optional(),
})
  .superRefine((data, ctx) => {
    if (data === undefined) return; // Si es undefined, no validar
    
    if ((data.dni && !data.tipoID) || (data.tipoID && !data.dni)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "tipoID y dni deben ir juntos",
        path: ["dni"],
      });
    }
  })
  .optional();