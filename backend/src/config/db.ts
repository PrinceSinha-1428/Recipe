import { neon } from '@neondatabase/serverless'
import { ENV } from './env';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema';

const sql = neon(ENV.DATABASE_URL!);
export const db = drizzle(sql, { schema })