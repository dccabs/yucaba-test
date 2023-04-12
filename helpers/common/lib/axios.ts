import axios, { AxiosRequestConfig } from 'axios'

export const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await axios<T>(config)
    return response.data
  } catch (error) {
    throw error
  }
}
