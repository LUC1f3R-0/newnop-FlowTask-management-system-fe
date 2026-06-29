import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infastructure/database/prisma.service.js';
import { TaskPriority, TaskStatus } from '../../../generated/prisma/enums.js';

type CreateTaskData = {
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: Date | null;
  createdById: bigint;
  assignedToId?: bigint | null;
};

type UpdateTaskData = {
  title?: string;
  description?: string | null;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: Date | null;
  assignedToId?: bigint | null;
};

type FindTasksParams = {
  page: number;
  limit: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
};

@Injectable()
class TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserIdByUuid(uuid: string) {
    const user = await this.prisma.users.findUnique({
      where: { uuid },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createTask(data: CreateTaskData) {
    const task = await this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        priority: data.priority ?? TaskPriority.MEDIUM,
        status: data.status ?? TaskStatus.TODO,
        dueDate: data.dueDate ?? null,
        createdById: data.createdById,
        assignedToId: data.assignedToId ?? null,
      },
      select: this.taskSelect(),
    });

    return this.toTaskResponse(task);
  }

  async findAll(params: FindTasksParams) {
    const skip = (params.page - 1) * params.limit;
    const where: any = {
      AND: this.taskFilters(params, false),
    };

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: params.limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: this.taskSelect(),
      }),

      this.prisma.task.count({
        where,
      }),
    ]);

    return this.toPaginatedTasks(tasks, params, total);
  }

  async findDeleted(params: FindTasksParams) {
    const skip = (params.page - 1) * params.limit;
    const where: any = {
      AND: this.taskFilters(params, true),
    };

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: params.limit,
        orderBy: {
          deletedAt: 'desc',
        },
        select: this.taskSelect(),
      }),

      this.prisma.task.count({
        where,
      }),
    ]);

    return this.toPaginatedTasks(tasks, params, total);
  }

  async findVisibleToUser(
    params: FindTasksParams & {
      userId: bigint;
    },
  ) {
    const skip = (params.page - 1) * params.limit;
    const where: any = {
      AND: [
        ...this.taskFilters(params, false),
        {
          OR: [
            {
              createdById: params.userId,
            },
            {
              assignedToId: params.userId,
            },
          ],
        },
      ],
    };

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: params.limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: this.taskSelect(),
      }),

      this.prisma.task.count({
        where,
      }),
    ]);

    return this.toPaginatedTasks(tasks, params, total);
  }

  async findTaskByUuid(uuid: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        uuid,
        deletedAt: null,
      },
      select: this.taskSelect(),
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.toTaskResponse(task);
  }

  async findAnyTaskByUuid(uuid: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        uuid,
      },
      select: {
        id: true,
        uuid: true,
        deletedAt: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async findDeletedTaskByUuid(uuid: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        uuid,
        deletedAt: {
          not: null,
        },
      },
      select: {
        id: true,
        uuid: true,
        deletedAt: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Deleted task not found');
    }

    return task;
  }

  async findVisibleTaskDetailsByUuid(params: { uuid: string; userId: bigint }) {
    const task = await this.prisma.task.findFirst({
      where: {
        uuid: params.uuid,
        deletedAt: null,
        OR: [{ createdById: params.userId }, { assignedToId: params.userId }],
      },
      select: this.taskSelect(),
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.toTaskResponse(task);
  }

  async findActiveTaskByUuid(uuid: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        uuid,
        deletedAt: null,
      },
      select: {
        id: true,
        uuid: true,
        createdById: true,
        assignedToId: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async findVisibleTaskByUuid(params: { uuid: string; userId: bigint }) {
    const task = await this.prisma.task.findFirst({
      where: {
        uuid: params.uuid,
        deletedAt: null,
        OR: [{ createdById: params.userId }, { assignedToId: params.userId }],
      },
      select: {
        id: true,
        uuid: true,
        createdById: true,
        assignedToId: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async updateTaskByUuid(uuid: string, data: UpdateTaskData) {
    const task = await this.prisma.task.update({
      where: {
        uuid,
      },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
        ...(data.priority !== undefined ? { priority: data.priority } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.dueDate !== undefined ? { dueDate: data.dueDate } : {}),
        ...(data.assignedToId !== undefined
          ? { assignedToId: data.assignedToId }
          : {}),
      },
      select: this.taskSelect(),
    });

    return this.toTaskResponse(task);
  }

  async restoreTaskByUuid(uuid: string) {
    const task = await this.prisma.task.update({
      where: {
        uuid,
      },
      data: {
        deletedAt: null,
      },
      select: this.taskSelect(),
    });

    return this.toTaskResponse(task);
  }

  async softDeleteTaskByUuid(uuid: string) {
    const existingTask = await this.prisma.task.findFirst({
      where: {
        uuid,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (!existingTask) {
      throw new NotFoundException('Task not found');
    }

    const task = await this.prisma.task.update({
      where: {
        uuid,
      },
      data: {
        deletedAt: new Date(),
      },
      select: this.taskSelect(),
    });

    return this.toTaskResponse(task);
  }

  private taskFilters(params: FindTasksParams, deletedOnly: boolean) {
    const filters: any[] = [
      deletedOnly
        ? {
            deletedAt: {
              not: null,
            },
          }
        : {
            deletedAt: null,
          },
    ];

    if (params.status) {
      filters.push({
        status: params.status,
      });
    }

    if (params.priority) {
      filters.push({
        priority: params.priority,
      });
    }

    if (params.search) {
      filters.push({
        OR: [
          {
            title: {
              contains: params.search,
            },
          },
          {
            description: {
              contains: params.search,
            },
          },
        ],
      });
    }

    return filters;
  }

  private toPaginatedTasks(tasks: any[], params: FindTasksParams, total: number) {
    return {
      tasks: tasks.map((task) => this.toTaskResponse(task)),
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.max(Math.ceil(total / params.limit), 1),
      },
    };
  }

  private taskSelect() {
    return {
      uuid: true,
      title: true,
      description: true,
      priority: true,
      status: true,
      dueDate: true,
      deletedAt: true,
      createdAt: true,
      updatedAt: true,
      createdBy: {
        select: {
          uuid: true,
          name: true,
          email: true,
        },
      },
      assignedTo: {
        select: {
          uuid: true,
          name: true,
          email: true,
        },
      },
    };
  }

  private toTaskResponse(task: any) {
    return {
      id: task.uuid,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      deletedAt: task.deletedAt ?? null,
      createdBy: {
        id: task.createdBy.uuid,
        name: task.createdBy.name,
        email: task.createdBy.email,
      },
      assignedTo: task.assignedTo
        ? {
            id: task.assignedTo.uuid,
            name: task.assignedTo.name,
            email: task.assignedTo.email,
          }
        : null,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}

export { TasksRepository };
