import type { Document, WithId } from 'mongodb';
import { ObjectId } from 'mongodb';
import { xpToLevel } from '@/lib/session';
import type { ScenarioKey } from '@/types';

function toIso(value: unknown): string | undefined {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string') return value;
  return undefined;
}

export function parseObjectId(id: string): ObjectId | null {
  if (!ObjectId.isValid(id)) return null;
  return new ObjectId(id);
}

export function studentDefaults() {
  const now = new Date();
  return {
    xp: 0,
    score: 0,
    level: xpToLevel(0),
    created_at: now,
    last_active_at: now,
  };
}

export function toStudentApi(doc: (WithId<Document> | Document) | null): Record<string, unknown> | null {
  if (!doc || !('_id' in doc) || doc._id == null) return null;
  const { _id, ...rest } = doc as WithId<Document>;
  return {
    id: _id.toString(),
    ...rest,
    created_at: toIso(rest.created_at) ?? rest.created_at,
    last_active_at: toIso(rest.last_active_at) ?? rest.last_active_at,
  };
}

export function toSessionApi(doc: (WithId<Document> | Document) | null): Record<string, unknown> | null {
  if (!doc || !('_id' in doc) || doc._id == null) return null;
  const { _id, ...rest } = doc as WithId<Document>;
  return {
    id: _id.toString(),
    ...rest,
    started_at: toIso(rest.started_at) ?? rest.started_at,
    ended_at: rest.ended_at != null ? toIso(rest.ended_at) ?? rest.ended_at : rest.ended_at,
  };
}

export function isScenarioKey(v: unknown): v is ScenarioKey {
  return v === 'interview' || v === 'friends' || v === 'workplace';
}
