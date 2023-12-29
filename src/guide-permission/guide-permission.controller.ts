import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateGuidePermissionRequestDto } from './dto/create-guide-permission-request.dto';
import { GuidePermissionService } from './guide-permission.service';
import { GuidePermissionRequest } from '@prisma/client';
import { PaginationParams, Roles, SortingParams } from '../common/decorators';
import { Role } from '../common/enums';
import { AuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { UpdateGuidePermissionRequestStatusDto } from './dto/update-guide-permission-request-status.dto';
import {
  FilteringV2,
  PaginatedResource,
  Pagination,
  Sorting,
} from '../common/interfaces';
import { FilteringParamsV2 } from '../common/decorators/filtering-params-v2.decorator';

@Controller('guide-permission')
export class GuidePermissionController {
  constructor(
    private readonly guidePermissionService: GuidePermissionService,
  ) {}

  @Post()
  @HttpCode(200)
  getUserProfile(
    @Body() createGuidePermissionRequestDto: CreateGuidePermissionRequestDto,
  ): Promise<GuidePermissionRequest> {
    return this.guidePermissionService.createRequest(
      createGuidePermissionRequestDto,
    );
  }

  @Get()
  @Roles([Role.MODERATOR])
  @UseGuards(AuthGuard, RoleGuard)
  getAllGuidePermissionRequests(
    @PaginationParams() paginationParams: Pagination,
    @SortingParams(['createdAt']) sort?: Sorting,
    @FilteringParamsV2(['status']) filters?: FilteringV2,
  ): Promise<PaginatedResource<Partial<GuidePermissionRequest>>> {
    return this.guidePermissionService.getAll(paginationParams, sort, filters);
  }

  @Patch('/status')
  @Roles([Role.MODERATOR])
  @UseGuards(AuthGuard, RoleGuard)
  updateSupportMessageStatus(
    @Body()
    body: UpdateGuidePermissionRequestStatusDto,
  ) {
    return this.guidePermissionService.updateRequestStatus(body);
  }

  @Delete('/:requestId')
  @Roles([Role.MODERATOR])
  @UseGuards(AuthGuard, RoleGuard)
  deleteSupportMessage(@Param('requestId', ParseIntPipe) requestId: number) {
    return this.guidePermissionService.deleteRequest(requestId);
  }
}
