import * as SQLite from 'expo-sqlite'
import * as FileSystem from 'expo-file-system'

export const initilizeDatabase = async () => {
  try {
    const dbPath = `${FileSystem.documentDirectory}databaseName.db`

    // const dbInfo = await FileSystem.getInfoAsync(dbPath)
    // if (dbInfo.exists) {
    //   await FileSystem.deleteAsync(dbPath)
    //   console.log('Existing database deleted.')
    // }

    const db = await SQLite.openDatabaseAsync(dbPath)
    // await db.execAsync(`PRAGMA journal_mode = WAL;`)
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS cart (
            dateAdded TEXT DEFAULT (datetime('now')),
            product TEXT,
            image TEXT,
            color TEXT,
            size TEXT,
            productId INTEGER,
            quantity INTEGER,
            price FLOAT
          );
        `)
    console.log('Database initialized successfully')
  } catch (e) {
    console.error('Error initializing database:', e)
    throw e
  }
}

export const createCartItem = async item => {
  try {
    // initilizeDatabase()
    console.log('Creating cart item:', item)
    const {
      product,
      image,
      productId,
      quantity,
      selectedColor,
      selectedSize,
      price,
    } = item
    const dbPath = `${FileSystem.documentDirectory}databaseName.db`
    const db = await SQLite.openDatabaseAsync(dbPath)
    // await db.execAsync(`PRAGMA journal_mode = WAL;`)
    const dateAdded = new Date().toISOString()
    const statement = await db.prepareAsync(
      'INSERT INTO cart (dateAdded, product, image, color, size, productId, quantity, price) VALUES ($dateAdded, $product, $image, $color, $size, $productId, $quantity, $price)',
    )
    let result = await statement.executeAsync({
      $dateAdded: dateAdded,
      $product: product,
      $image: image,
      $color: selectedColor,
      $size: selectedSize,
      $productId: productId,
      $quantity: quantity,
      $price: price,
    })
    // console.log('bbb and 101:', result.lastInsertRowId, result.changes)
    // await db.execAsync(
    //   `INSERT INTO cart (dateAdded, color, size, productId, quantity) VALUES (?, ?, ?, ?, ?)`,
    //   [dateAdded, selectedColor, selectedSize, productId, quantity],
    // )

    console.log('Records inserted successfully.')
  } catch (e) {
    console.error('Error creating cart item:', e)
    throw e
  }
}

export const getCartItems = async () => {
  try {
    const dbPath = `${FileSystem.documentDirectory}databaseName.db`
    const db = await SQLite.openDatabaseAsync(dbPath)
    // await db.execAsync(`PRAGMA journal_mode = WAL;`)
    const result = await db.getAllAsync('SELECT * FROM cart')
    console.log(result)
    // console.log('Records selected successfully.')
    return result
  } catch (e) {
    console.error('Error getting cart items:', e)
    throw e
  }
}

export const clearCart = async () => {
  try {
    const dbPath = `${FileSystem.documentDirectory}databaseName.db`
    const db = await SQLite.openDatabaseAsync(dbPath)
    // await db.execAsync(`PRAGMA journal_mode = WAL;`)
    await db.execAsync(`DELETE FROM cart;`)
    console.log('All rows deleted from the cart table.')
  } catch (e) {
    console.error('Error clearing cart:', e)
    throw e
  }
}
