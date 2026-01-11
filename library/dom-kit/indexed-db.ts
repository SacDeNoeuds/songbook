export interface OpenObjectDatabaseOptions {
  database: string
  store: string
  version?: number
}

export function openObjectDatabase<Key extends IDBValidKey, Value>(
  databaseOptions: OpenObjectDatabaseOptions,
) {
  return {
    async find(
      key: Key,
      options: IDBTransactionOptions = {},
    ): Promise<Value | undefined> {
      let value: Value | undefined
      await transaction({
        mode: 'readonly',
        options,
        request: (store) => store.get(key),
        onSucceeded: (resolve, result) => {
          value = result
          resolve()
        },
      })
      return value
    },
    async remove(key: Key, options: IDBTransactionOptions = {}): Promise<void> {
      return transaction({
        mode: 'readwrite',
        options,
        request: (store) => store.delete(key),
      })
    },
    async set(
      key: Key,
      value: Value,
      options: IDBTransactionOptions = {},
    ): Promise<void> {
      await transaction({
        mode: 'readwrite',
        options,
        request: (store) => store.put(value, key),
      })
    },
    async list(
      query?: IDBValidKey | IDBKeyRange,
      options: IDBTransactionOptions & { direction?: IDBCursorDirection } = {},
    ) {
      const values: Value[] = []
      await transaction({
        mode: 'readonly',
        options,
        request: (store) => store.openCursor(query),
        onSucceeded: (resolve, result) => {
          if (!result?.value) return resolve()
          values.push(result.value)
          result.continue()
        },
      })
      return values
    },
  }

  function openDatabase() {
    const request = indexedDB.open(
      databaseOptions.database,
      databaseOptions.version,
    )
    request.onupgradeneeded = (event) => {
      const db = request.result
      if (db.objectStoreNames.contains(databaseOptions.store)) return
      db.createObjectStore(databaseOptions.store)
    }
    return new Promise<IDBDatabase>((resolve, reject) => {
      request.onblocked = (event) =>
        reject(
          new Error('db blocked', {
            cause: {
              requestError: request.error,
              oldVersion: event.oldVersion,
              newVersion: event.newVersion,
            },
          }),
        )
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  async function transaction<T>(params: {
    mode: IDBTransactionMode
    options: IDBTransactionOptions
    request: (store: IDBObjectStore) => IDBRequest<T>
    onSucceeded?: (resolve: () => void, result: T) => void
  }) {
    const { request: buildRequest, mode, options } = params
    const onSucceeded = params.onSucceeded ?? ((resolve) => resolve)
    const db = await openDatabase()
    try {
      const tx = db.transaction(databaseOptions.store, mode, options)
      const store = tx.objectStore(databaseOptions.store)
      const request = buildRequest(store)
      const result = await new Promise<void>((resolve, reject) => {
        request.onerror = () => reject(request.error)
        request.onsuccess = () => {
          onSucceeded(resolve, request.result)
          resolve()
        }
      })
      await new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
        tx.onabort = () => reject(tx.error)
      })
      return result
    } catch (error) {
      throw error
    } finally {
      db.close()
    }
  }
}
