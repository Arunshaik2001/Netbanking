import z from "zod";

export const userLoginScheme = z.object({
  userId: z.string(),
  password: z.string(),
});

export type userLoginType = z.infer<typeof userLoginScheme>;

export const debitTypeSchema = z.object({
  paymentAppToken: z.string(),
  paymentApp: z.string(),
  netbankApp: z.string(),
});

export type userDebitType = z.infer<typeof debitTypeSchema>;
