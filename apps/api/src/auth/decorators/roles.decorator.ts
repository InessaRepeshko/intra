import { IdentityRole } from '@intra/shared-kernel';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: IdentityRole[]) => SetMetadata('roles', roles);
