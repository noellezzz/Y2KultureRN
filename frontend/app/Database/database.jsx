// Replace your current import with this
import { openDatabase } from 'react-native-sqlite-storage'
import { Platform } from 'react-native'

// Initialize the database with more options
const getDBConnection = async () => {
  try {
    // More detailed initialization with fallback options
    const db = await openDatabase({
      name: 'cart.db',
      location: 'default',
      androidDatabaseProvider: 'system',
      createFromLocation: '~cart.db',
      enablePromise: true, // Move this here instead of SQLite.enablePromise
    })

    console.log(
      'Database connection successful:',
      db ? 'Connection exists' : 'No connection',
    )
    return db
  } catch (error) {
    console.error('Database connection error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code || 'unknown',
      timestamp: new Date().toISOString(),
      dbName: 'cart.db',
      platform: Platform.OS,
    })

    // Try alternative approach if primary fails
    try {
      console.log('Attempting alternative connection method...')
      return openDatabase('cart.db', '1.0', 'Cart Database', 200000)
    } catch (fallbackError) {
      console.error('Alternative connection also failed:', fallbackError)
      return null
    }
  }
}

export const initDatabase = async () => {
  try {
    const dbConnection = await getDBConnection()
    if (!dbConnection) {
      console.error('Failed to get database connection during initialization')
      return false
    }

    await dbConnection.executeSql(
      'CREATE TABLE IF NOT EXISTS cart (id TEXT PRIMARY KEY, name TEXT, price REAL, quantity INTEGER, image TEXT)',
    )
    return true
  } catch (error) {
    console.error('Database initialization error:', error)
    return false // Return false instead of throwing
  }
}

export const getCartItems = async () => {
  try {
    const db = await getDBConnection()
    if (!db) return []

    const [results] = await db.executeSql('SELECT * FROM cart')

    if (!results || !results.rows) return []

    const items = []
    for (let i = 0; i < results.rows.length; i++) {
      items.push(results.rows.item(i))
    }

    return items
  } catch (error) {
    console.error('Get cart items error:', error)
    return []
  }
}

export const addItemToDb = async item => {
  try {
    const dbConnection = await getDBConnection()
    if (!dbConnection) {
      console.error('No database connection for addItemToDb')
      return 0
    }

    const [results] = await dbConnection.executeSql(
      'INSERT OR REPLACE INTO cart (id, name, price, quantity, image) VALUES (?, ?, ?, ?, ?)',
      [item.id, item.name, item.price, item.quantity, item.image || ''],
    )

    return results.rowsAffected
  } catch (error) {
    console.error('Add item to db error:', error)
    return 0
  }
}

export const updateQuantityInDb = async (id, quantity) => {
  try {
    const dbConnection = await getDBConnection()
    const [results] = await dbConnection.executeSql(
      'UPDATE cart SET quantity = ? WHERE id = ?',
      [quantity, id],
    )

    return results.rowsAffected
  } catch (error) {
    console.error('Update quantity error:', error)
    throw error
  }
}

export const removeItemFromDb = async id => {
  try {
    const dbConnection = await getDBConnection()
    const [results] = await dbConnection.executeSql(
      'DELETE FROM cart WHERE id = ?',
      [id],
    )

    return results.rowsAffected
  } catch (error) {
    console.error('Remove item error:', error)
    throw error
  }
}

export const clearCartFromDb = async () => {
  try {
    const dbConnection = await getDBConnection()
    const [results] = await dbConnection.executeSql('DELETE FROM cart')

    return results.rowsAffected
  } catch (error) {
    console.error('Clear cart error:', error)
    throw error
  }
}
