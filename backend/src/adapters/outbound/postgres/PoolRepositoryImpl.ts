import { PrismaClient } from "@prisma/client";
import { PoolRepository } from "../../../core/ports/PoolRepository";
import { Pool } from "../../../core/domain/Pool";

export class PoolRepositoryImpl implements PoolRepository {
  constructor(private prisma: PrismaClient) {}

  async create(pool: Omit<Pool, "id">): Promise<Pool> {
    const created = await this.prisma.pool.create({
      data: {
        year: pool.year,
        members: {
          create: pool.members.map((m) => ({
            shipId: m.shipId,
            cbBefore: m.cbBefore,
            cbAfter: m.cbAfter,
          })),
        },
      },
      include: {
        members: true,
      },
    });

    return {
      id: created.id,
      year: created.year,
      members: created.members.map((m) => ({
        shipId: m.shipId,
        cbBefore: m.cbBefore,
        cbAfter: m.cbAfter,
      })),
      totalCbBefore: pool.totalCbBefore,
      totalCbAfter: pool.totalCbAfter,
      valid: pool.valid,
    };
  }

  async findById(id: string): Promise<Pool | null> {
    const pool = await this.prisma.pool.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!pool) return null;

    const totalCbBefore = pool.members.reduce((sum, m) => sum + m.cbBefore, 0);
    const totalCbAfter = pool.members.reduce((sum, m) => sum + m.cbAfter, 0);
    return {
      id: pool.id,
      year: pool.year,
      members: pool.members.map((m) => ({
        shipId: m.shipId,
        cbBefore: m.cbBefore,
        cbAfter: m.cbAfter,
      })),
      totalCbBefore,
      totalCbAfter,
      valid: totalCbBefore >= 0,
    };
  }
  async findByYear(year: number): Promise<Pool[]> {
    const pools = await this.prisma.pool.findMany({
      where: { year },
      include: { members: true },
      orderBy: { createdAt: "desc" },
    });
    return pools.map((pool) => {
      const totalCbBefore = pool.members.reduce(
        (sum, m) => sum + m.cbBefore,
        0
      );
      const totalCbAfter = pool.members.reduce((sum, m) => sum + m.cbAfter, 0);

      return {
        id: pool.id,
        year: pool.year,
        members: pool.members.map((m) => ({
          shipId: m.shipId,
          cbBefore: m.cbBefore,
          cbAfter: m.cbAfter,
        })),
        totalCbBefore,
        totalCbAfter,
        valid: totalCbBefore >= 0,
      };
    });
  }
}
