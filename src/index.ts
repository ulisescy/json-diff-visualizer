export type DiffType = 'added' | 'removed' | 'modified' | 'equal';

export interface DiffEntry {
  path: string;
  type: DiffType;
  oldValue?: unknown;
  newValue?: unknown;
}

export function diffJson(objA: any, objB: any, prefix = ''): DiffEntry[] {
  const diffs: DiffEntry[] = [];
  const keys = Array.from(new Set([...Object.keys(objA || {}), ...Object.keys(objB || {})]));

  for (const key of keys) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (!(key in objA)) {
      diffs.push({ path, type: 'added', newValue: objB[key] });
    } else if (!(key in objB)) {
      diffs.push({ path, type: 'removed', oldValue: objA[key] });
    } else if (typeof objA[key] === 'object' && typeof objB[key] === 'object' && objA[key] !== null && objB[key] !== null) {
      diffs.push(...diffJson(objA[key], objB[key], path));
    } else if (objA[key] !== objB[key]) {
      diffs.push({ path, type: 'modified', oldValue: objA[key], newValue: objB[key] });
    }
  }

  return diffs;
}
