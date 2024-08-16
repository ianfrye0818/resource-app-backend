import { PermissionList } from '@prisma/client';
import { PermissionMap } from './types.';

export const permissionMap: PermissionMap = {
  ADMIN: [
    PermissionList.CREATE_ROLE,
    PermissionList.CREATE_USER,
    PermissionList.CREATE_PERMISSION,
    PermissionList.GET_ROLES,
    PermissionList.GET_USERS,
    PermissionList.GET_PERMISSIONS,
    PermissionList.UPDATE_ROLE,
    PermissionList.UPDATE_USER,
    PermissionList.UPDATE_PERMISSION,
    PermissionList.DELETE_ROLE,
    PermissionList.DELETE_USER,
    PermissionList.DELETE_PERMISSION,
  ],
  USER: [
    PermissionList.GET_USER,
    PermissionList.UPDATE_USER,
    PermissionList.DELETE_USER,
  ],
  ECOLAB: [
    PermissionList.GET_ECOLAB_EMPLOYEES,
    PermissionList.CREATE_ECOLAB_EMPLOYEES,
    PermissionList.UPDATE_ECOLAB_EMPLOYEES,
    PermissionList.DELETE_ECOLAB_EMPLOYEES,
    PermissionList.CREATE_ECOLAB_ASSIGNEMNTS,
    PermissionList.GET_ECOLAB_ASSIGNMENTS,
    PermissionList.UPDATE_ECOLAB_ASSIGNMENTS,
    PermissionList.DELETE_ECOLAB_ASSIGNMENTS,
    PermissionList.GET_ECOLAB_MANAGERS,
    PermissionList.CREATE_ECOLAB_MANAGERS,
    PermissionList.UPDATE_ECOLAB_MANAGERS,
    PermissionList.DELETE_ECOLAB_MANAGERS,
  ],
};
