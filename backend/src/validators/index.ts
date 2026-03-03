import { z } from 'zod';

export const CreatePowerCutSchema = z.object({
    body: z.object({
        area: z.string().min(2, "Area is required"),
        date: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format" }),
        start_time: z.string(),
        end_time: z.string(),
        reason: z.string().optional(),
    }),
});

export const UpdatePowerCutSchema = z.object({
    body: z.object({
        area: z.string().min(2).optional(),
        date: z.string().refine((date) => !isNaN(Date.parse(date))).optional(),
        start_time: z.string().optional(),
        end_time: z.string().optional(),
        reason: z.string().optional(),
    }),
    params: z.object({
        id: z.string().uuid(),
    })
});

export const SubscribeSchema = z.object({
    body: z.object({
        area: z.string().min(2, "Area is required"),
    }),
});
