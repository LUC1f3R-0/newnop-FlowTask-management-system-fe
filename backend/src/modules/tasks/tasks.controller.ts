import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { CreateTaskDto, UpdateTaskDto } from './dto/tasks.dto.js';
import {
  AccessTokenCookieGuard,
  type AuthenticatedRequest,
} from '../../common/guards/access-token-cookie.guard.js';
import { ResponseMessage } from '../../common/decorators/response-message.decorator.js';

type TaskListQuery = {
  page?: string;
  limit?: string;
  status?: string;
  priority?: string;
  search?: string;
};

@Controller('tasks')
@UseGuards(AccessTokenCookieGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ResponseMessage('Tasks fetched successfully')
  findAllForLoggedInUser(
    @Req() request: AuthenticatedRequest,
    @Query() query: TaskListQuery,
  ) {
    return this.tasksService.findAllForLoggedInUser(request.auth, query);
  }

  @Get('deleted')
  @ResponseMessage('Deleted tasks fetched successfully')
  findDeletedTasks(
    @Req() request: AuthenticatedRequest,
    @Query() query: TaskListQuery,
  ) {
    return this.tasksService.findDeletedForAdmin(request.auth, query);
  }

  @Get(':id')
  @ResponseMessage('Task fetched successfully')
  findOne(
    @Param('id') taskUuid: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.tasksService.findOne(request.auth, taskUuid);
  }

  @Post('create')
  @ResponseMessage('Task created successfully')
  createTask(@Body() dto: CreateTaskDto, @Req() request: AuthenticatedRequest) {
    return this.tasksService.createTask(request.auth, dto);
  }

  @Patch(':id/restore')
  @ResponseMessage('Task restored successfully')
  restoreTask(
    @Param('id') taskUuid: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.tasksService.restoreDeletedTask(request.auth, taskUuid);
  }

  @Patch(':id')
  @ResponseMessage('Task updated successfully')
  updateTask(
    @Param('id') taskUuid: string,
    @Body() dto: UpdateTaskDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.tasksService.updateTask(request.auth, taskUuid, dto);
  }

  @Delete(':id')
  @ResponseMessage('Task deleted successfully')
  deleteTask(
    @Param('id') taskUuid: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.tasksService.deleteTask(request.auth, taskUuid);
  }
}
