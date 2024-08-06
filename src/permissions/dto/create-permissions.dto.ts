import { PermissionList } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';

export class CreatePermisssionsDTO {
  @IsEnum(PermissionList, { each: true })
  @Transform(({ value }: { value: string[] }) => {
    const permissions = value.reduce(
      (acc: PermissionList[], permission: string) => {
        if (
          isNaN(Number(permission)) &&
          permission.toUpperCase() in PermissionList
        ) {
          acc.push(permission.toUpperCase() as PermissionList);
        }

        return acc;
      },
      [],
    );

    return permissions;
  })
  permissions: PermissionList[];
}
