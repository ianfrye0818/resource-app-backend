import { PermissionList, RoleList } from '@prisma/client';
import * as z from 'zod';
export const CreateUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  roles: z.array(z.nativeEnum(RoleList)).optional(),
  isActive: z.boolean().optional(),
  firstLogin: z.boolean().optional(),
  permissions: z.array(z.nativeEnum(PermissionList)).optional(),
});

export const UpdateUserSchema = CreateUserSchema.partial().extend({
  deletedAt: z.date().optional(),
});
