import { PermissionList, RoleList } from '@prisma/client';

export interface ClientUser {
  email: string;
  userId: string;
  roles: RoleList[];
  permissions: PermissionList[];
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface JWTPayload extends ClientUser {
  iat: number;
  exp: number;
}

export enum Models {
  GEMINI = 'gemini',
  CLAUDE = 'claude',
  CHATGPT = 'chatgpt',
}

export interface AIModelSelect {
  label: string;
  value: Models;
}

export interface ParsedJson {
  name?: string;
  summary?: string;
  skills?: string[];
  education?: { school: string; degree: string }[];
  workHistory?: {
    company?: string;
    startDate?: string;
    endDate?: string;
    title?: string;
    duties?: string[];
  };
}

export type PermissionMap = Record<RoleList, PermissionList[]>;
