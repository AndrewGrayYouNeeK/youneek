const STORAGE_KEY = 'youneek.local-data';

const emptyStore = () => ({
  vetApplications: [],
  stakingPositions: [],
  walletTransactions: [],
});

function readStore() {
  if (typeof localStorage === 'undefined') {
    return emptyStore();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw);
    return {
      ...emptyStore(),
      ...parsed,
      vetApplications: Array.isArray(parsed.vetApplications) ? parsed.vetApplications : [],
      stakingPositions: Array.isArray(parsed.stakingPositions) ? parsed.stakingPositions : [],
      walletTransactions: Array.isArray(parsed.walletTransactions) ? parsed.walletTransactions : [],
    };
  } catch {
    return emptyStore();
  }
}

function writeStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function compareValues(left, right) {
  if (left == null && right == null) return 0;
  if (left == null) return -1;
  if (right == null) return 1;
  if (typeof left === 'number' && typeof right === 'number') return left - right;
  return String(left).localeCompare(String(right));
}

function sortRecords(records, sort) {
  if (!sort) return [...records];
  const descending = sort.startsWith('-');
  const field = descending ? sort.slice(1) : sort;
  return [...records].sort((a, b) => {
    const result = compareValues(a[field], b[field]);
    return descending ? -result : result;
  });
}

function matchesFilter(record, filter = {}) {
  return Object.entries(filter).every(([key, value]) => record[key] === value);
}

function createCollection(key) {
  return {
    async list(sort, limit) {
      const items = sortRecords(readStore()[key], sort);
      return typeof limit === 'number' ? items.slice(0, limit) : items;
    },
    async filter(filter, sort, limit) {
      const items = sortRecords(
        readStore()[key].filter((record) => matchesFilter(record, filter)),
        sort,
      );
      return typeof limit === 'number' ? items.slice(0, limit) : items;
    },
    async create(data) {
      const store = readStore();
      const now = new Date().toISOString();
      const record = {
        id: crypto.randomUUID(),
        created_date: now,
        updated_date: now,
        ...data,
      };
      store[key] = [record, ...store[key]];
      writeStore(store);
      return record;
    },
    async update(id, data) {
      const store = readStore();
      const index = store[key].findIndex((record) => record.id === id);
      if (index === -1) {
        throw new Error(`Record not found: ${id}`);
      }
      const updated = {
        ...store[key][index],
        ...data,
        updated_date: new Date().toISOString(),
      };
      store[key][index] = updated;
      writeStore(store);
      return updated;
    },
  };
}

export const vetApplications = createCollection('vetApplications');
export const stakingPositions = createCollection('stakingPositions');
export const walletTransactions = createCollection('walletTransactions');
