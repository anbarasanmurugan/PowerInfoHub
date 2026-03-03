"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscribeSchema = exports.UpdatePowerCutSchema = exports.CreatePowerCutSchema = void 0;
const zod_1 = require("zod");
exports.CreatePowerCutSchema = zod_1.z.object({
    body: zod_1.z.object({
        area: zod_1.z.string().min(2, "Area is required"),
        date: zod_1.z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format" }),
        start_time: zod_1.z.string(),
        end_time: zod_1.z.string(),
        reason: zod_1.z.string().optional(),
    }),
});
exports.UpdatePowerCutSchema = zod_1.z.object({
    body: zod_1.z.object({
        area: zod_1.z.string().min(2).optional(),
        date: zod_1.z.string().refine((date) => !isNaN(Date.parse(date))).optional(),
        start_time: zod_1.z.string().optional(),
        end_time: zod_1.z.string().optional(),
        reason: zod_1.z.string().optional(),
    }),
    params: zod_1.z.object({
        id: zod_1.z.string().uuid(),
    })
});
exports.SubscribeSchema = zod_1.z.object({
    body: zod_1.z.object({
        area: zod_1.z.string().min(2, "Area is required"),
    }),
});
