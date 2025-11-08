import { Pool } from '../domain/Pool';

export interface PoolRepository {
  create(pool: Omit<Pool, 'id'>): Promise<Pool>;
  findById(id: string): Promise<Pool | null>;
  findByYear(year: number): Promise<Pool[]>;
}