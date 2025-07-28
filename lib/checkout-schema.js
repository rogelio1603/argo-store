import { z } from 'zod'
import { isValidMexicanPostalCode, isValidMexicanPhone } from './mexico-locations'

export const checkoutSchema = z.object({
  // Personal Information
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre debe tener máximo 50 caracteres')
    .regex(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/, 'El nombre solo debe contener letras'),
  
  lastName: z
    .string()
    .min(2, 'El apellido paterno debe tener al menos 2 caracteres')
    .max(50, 'El apellido paterno debe tener máximo 50 caracteres')
    .regex(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/, 'El apellido solo debe contener letras'),
  
  motherLastName: z
    .string()
    .min(2, 'El apellido materno debe tener al menos 2 caracteres')
    .max(50, 'El apellido materno debe tener máximo 50 caracteres')
    .regex(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/, 'El apellido solo debe contener letras'),
  
  email: z
    .string()
    .email('Por favor ingresa un email válido')
    .min(5, 'El email debe tener al menos 5 caracteres')
    .max(100, 'El email debe tener máximo 100 caracteres'),
  
  confirmEmail: z
    .string()
    .email('Por favor ingresa un email válido'),
  
  phone: z
    .string()
    .min(10, 'El teléfono debe tener 10 dígitos')
    .max(10, 'El teléfono debe tener 10 dígitos')
    .refine(isValidMexicanPhone, 'Por favor ingresa un número de teléfono mexicano válido (10 dígitos)'),
  
  // Shipping Address Information
  address: z
    .string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(200, 'La dirección debe tener máximo 200 caracteres'),
  
  state: z
    .string()
    .min(1, 'Por favor selecciona un estado'),
  
  city: z
    .string()
    .min(1, 'Por favor selecciona una ciudad'),
  
  postalCode: z
    .string()
    .length(5, 'El código postal debe tener exactamente 5 dígitos')
    .refine(isValidMexicanPostalCode, 'Por favor ingresa un código postal mexicano válido')
}).refine((data) => data.email === data.confirmEmail, {
  message: "Los emails no coinciden",
  path: ["confirmEmail"]
})

// Type definition for TypeScript (can be used in .ts files)
// export type CheckoutFormData = z.infer<typeof checkoutSchema> 