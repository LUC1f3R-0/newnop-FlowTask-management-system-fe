import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  Role,
  TaskPriority,
  TaskStatus,
} from '../../../generated/prisma/enums.js';
import { TasksRepository } from './tasks.repository.js';
import { CreateTaskDto, UpdateTaskDto } from './dto/tasks.dto.js';

type AuthUser = {
  userUuid: string;
  role: Role;
};

type FindTasksQuery = {
  page?: string;
  limit?: string;
  status?: string;
  priority?: string;
  search?: string;
};

@Injectable()
class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async findAllForLoggedInUser(authUser: AuthUser, query: FindTasksQuery) {
    const page = this.parsePositiveInt(query.page, 1, 10_000);
    const limit = this.parsePositiveInt(query.limit, 10, 100);

    const status = this.parseTaskStatus(query.status);
    const priority = this.parseTaskPriority(query.priority);
    const search = this.parseSearch(query.search);

    if (authUser.role === Role.ADMIN) {
      return this.tasksRepository.findAll({
        page,
        limit,
        status,
        priority,
        search,
      });
    }

    const user = await this.tasksRepository.findUserIdByUuid(authUser.userUuid);

    return this.tasksRepository.findVisibleToUser({
      userId: user.id,
      page,
      limit,
      status,
      priority,
      search,
    });
  }

  async findDeletedForAdmin(authUser: AuthUser, query: FindTasksQuery) {
    this.ensureAdmin(authUser);

    const page = this.parsePositiveInt(query.page, 1, 10_000);
    const limit = this.parsePositiveInt(query.limit, 10, 100);

    return this.tasksRepository.findDeleted({
      page,
      limit,
      status: this.parseTaskStatus(query.status),
      priority: this.parseTaskPriority(query.priority),
      search: this.parseSearch(query.search),
    });
  }

  async findOne(authUser: AuthUser, taskUuid: string) {
    const loggedUser = await this.tasksRepository.findUserIdByUuid(
      authUser.userUuid,
    );

    const task =
      authUser.role === Role.ADMIN
        ? await this.tasksRepository.findTaskByUuid(taskUuid)
        : await this.tasksRepository.findVisibleTaskDetailsByUuid({
            uuid: taskUuid,
            userId: loggedUser.id,
          });

    return {
      task,
    };
  }

  async createTask(authUser: AuthUser, dto: CreateTaskDto) {
    const createdBy = await this.tasksRepository.findUserIdByUuid(
      authUser.userUuid,
    );

    const assignedTo = dto.assignedToId
      ? await this.tasksRepository.findUserIdByUuid(dto.assignedToId)
      : null;

    const task = await this.tasksRepository.createTask({
      title: dto.title,
      description: dto.description,
      priority: dto.priority,
      status: dto.status,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      createdById: createdBy.id,
      assignedToId: assignedTo?.id ?? null,
    });

    return {
      task,
    };
  }

  async updateTask(authUser: AuthUser, taskUuid: string, dto: UpdateTaskDto) {
    const loggedUser = await this.tasksRepository.findUserIdByUuid(
      authUser.userUuid,
    );

    if (authUser.role === Role.ADMIN) {
      // Admin can edit active tasks and soft-deleted tasks.
      await this.tasksRepository.findAnyTaskByUuid(taskUuid);
    } else {
      await this.tasksRepository.findVisibleTaskByUuid({
        uuid: taskUuid,
        userId: loggedUser.id,
      });
    }

    const assignedTo = dto.assignedToId
      ? await this.tasksRepository.findUserIdByUuid(dto.assignedToId)
      : undefined;

    const task = await this.tasksRepository.updateTaskByUuid(taskUuid, {
      title: dto.title,
      description: dto.description,
      priority: dto.priority,
      status: dto.status,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      assignedToId: assignedTo ? assignedTo.id : undefined,
    });

    return {
      task,
    };
  }

  async restoreDeletedTask(authUser: AuthUser, taskUuid: string) {
    this.ensureAdmin(authUser);

    await this.tasksRepository.findDeletedTaskByUuid(taskUuid);

    const task = await this.tasksRepository.restoreTaskByUuid(taskUuid);

    return {
      task,
    };
  }

  async deleteTask(authUser: AuthUser, taskUuid: string) {
    const loggedUser = await this.tasksRepository.findUserIdByUuid(
      authUser.userUuid,
    );

    if (authUser.role === Role.ADMIN) {
      await this.tasksRepository.findActiveTaskByUuid(taskUuid);
    } else {
      await this.tasksRepository.findVisibleTaskByUuid({
        uuid: taskUuid,
        userId: loggedUser.id,
      });
    }

    const task = await this.tasksRepository.softDeleteTaskByUuid(taskUuid);

    return {
      task,
    };
  }

  private ensureAdmin(authUser: AuthUser) {
    if (authUser.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can access deleted tasks');
    }
  }

  private parsePositiveInt(value: string | undefined, fallback: number, max: number) {
    const parsed = Number(value ?? fallback);

    if (!Number.isInteger(parsed) || parsed < 1) {
      return fallback;
    }

    return Math.min(parsed, max);
  }

  private parseSearch(search?: string) {
    const value = search?.trim();

    return value ? value : undefined;
  }

  private parseTaskStatus(status?: string) {
    if (!status) return undefined;

    if (!Object.values(TaskStatus).includes(status as TaskStatus)) {
      throw new BadRequestException(
        'Invalid status. Status must be Open, In Progress, or Done',
      );
    }

    return status as TaskStatus;
  }

  private parseTaskPriority(priority?: string) {
    if (!priority) return undefined;

    if (!Object.values(TaskPriority).includes(priority as TaskPriority)) {
      throw new BadRequestException(
        'Invalid priority. Priority must be Low, Medium, or High',
      );
    }

    return priority as TaskPriority;
  }
}

export { TasksService };
