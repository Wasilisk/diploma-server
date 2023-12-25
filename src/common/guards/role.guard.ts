import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../enums';
import { Roles } from '../decorators';
import {AccessControlService} from "../../access-control/access-control.service";

export class TokenDto {
  id: number;
  role: Role;
}

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private accessControlService: AccessControlService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(Roles, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request['user'];

    for (let role of requiredRoles) {
      const result = this.accessControlService.isAuthorized({
        requiredRole: role,
        currentRole: user.role,
      });

      if (result) {
        return true;
      }
    }

    return false;
  }
}
