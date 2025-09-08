import axios from 'axios'
import type { User } from '../types/user'
import type { ApiResponse } from '../../../shared/types'
import type {
  FlightSearchRequest,
  FlightSearchResponse,
  PriceVerifyRequest,
  PriceVerifyResponse,
  BaggageQueryRequest,
  SeatMapRequest,
  CreateOrderRequest,
  CreateOrderResponse,
  PaymentVerifyRequest,
  TicketIssueRequest,
  TicketIssueResponse
} from '../../../shared/supplier-types'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const apiService = {
  // Health check
  getHealth: () => api.get<{ status: string; message: string; timestamp: string }>('/health'),
  
  // Hello endpoint
  getHello: () => api.get<{ message: string; timestamp: string }>('/hello'),

  // User endpoints
  getUsers: () => api.get<{ success: boolean; data: User[]; count: number }>('/users'),
  getUserById: (id: number) => api.get<{ success: boolean; data: User }>(`/users/${id}`),
  createUser: (user: Omit<User, 'id'>) => api.post<{ success: boolean; data: User; message: string }>('/users', user),
  updateUser: (id: number, user: Partial<Omit<User, 'id'>>) => api.put<{ success: boolean; data: User; message: string }>(`/users/${id}`, user),
  deleteUser: (id: number) => api.delete<{ success: boolean; message: string }>(`/users/${id}`),

  // 供应商测试 API
  supplier: {
    // 搜索航班
    searchFlights: (request: FlightSearchRequest) => 
      api.post<ApiResponse<FlightSearchResponse>>('/supplier/search', request),
    
    // 验价
    verifyPrice: (request: PriceVerifyRequest) => 
      api.post<ApiResponse<PriceVerifyResponse>>('/supplier/price-verify', request),
    
    // 查询行李
    queryBaggage: (request: BaggageQueryRequest) => 
      api.post<ApiResponse<any>>('/supplier/baggage-query', request),
    
    // 查询选座
    querySeatMap: (request: SeatMapRequest) => 
      api.post<ApiResponse<any>>('/supplier/seat-map', request),
    
    // 创建订单
    createOrder: (request: CreateOrderRequest) => 
      api.post<ApiResponse<CreateOrderResponse>>('/supplier/create-order', request),
    
    // 支付校验
    verifyPayment: (request: PaymentVerifyRequest) => 
      api.post<ApiResponse<any>>('/supplier/payment-verify', request),
    
    // 出票
    issueTicket: (request: TicketIssueRequest) => 
      api.post<ApiResponse<TicketIssueResponse>>('/supplier/issue-ticket', request),
    
    // 获取票号
    getTicketNumbers: (request: { orderId: string; pnr: string }) => 
      api.post<ApiResponse<any>>('/supplier/get-ticket-numbers', request)
  }
}

export default api
