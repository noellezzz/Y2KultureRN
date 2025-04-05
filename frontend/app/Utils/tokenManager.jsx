import * as SecureStore from 'expo-secure-store'

const TOKEN_KEY =
  'ca9aebc5cdb7d732986fd26c80aa29b4c73a8be303d9f60d65a619b2ef7fcb0e8bf0e875e57b191a7e5b1416312ca4ce108c95faae3d3d1544217328bca095d7'

export const saveToken = async token => {
  await SecureStore.setItemAsync(TOKEN_KEY, token)
}

export const getToken = async () => {
  return await SecureStore.getItemAsync(TOKEN_KEY)
}

export const removeToken = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY)
}
