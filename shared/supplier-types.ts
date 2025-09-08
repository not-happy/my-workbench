// 供应商测试相关类型定义

// 搜索请求
export interface FlightSearchRequest {
  cid: string;
  adultNumber: number;
  childNumber: number;
  flightClass: string;
  fromCity: string;
  toCity: string;
  fromDate: string;
  ds: string;
  pcc: string;
  retDate?: string;
  tripType: string;
}

// 航班段信息
export interface FlightSegment {
  aircraftCode: string;
  arrAirport: string;
  arrCity: string;
  arrTime: string;
  brand: {
    code: string;
    name: string;
  };
  cabin: string;
  cabinGrade: string;
  carrier: string;
  codeShare: boolean;
  depAirport: string;
  depCity: string;
  depTime: string;
  eTicket: boolean;
  flightNumber: string;
  flightTime: string;
  fromTerminal?: string;
  toTerminal?: string;
  marketingCarrier: string;
  marriageGrp: string;
  meal: string;
  operatingCarrier: string;
  operatingFlightNumber: string;
  seatsRemain: string;
  segmentType: number;
  stayTime?: string;
  stopCities?: string;
  stopQuantity: number;
}

// 行李信息
export interface BaggageInfo {
  adultPieces: string;
  adultWeights: string;
  childPieces: string;
  childWeights: string;
  segmentNo: string;
}

// 手提行李信息
export interface CabinBaggageInfo {
  adultQuantity: string;
  adultWeight: string;
  childQuantity: string;
  childWeight: string;
  segmentNo: number;
}

// 退票规则
export interface RefundRule {
  refundType: number; // 0：客票全部未使用；1：客票部分使用；2：NoShow起飞前退票；3：NoShow起飞后退票
  refundFee?: number; // 退票费用，当refundStatus =H，必须赋值
  refundStatus: string; // T：不可退；H：有条件退；F：免费退；E：异常
  currency?: string; // 币种，支持CNY, USD, HKD, GBP, JPY 等等，默认为CNY
  remark?: string; // 退票说明
}

// 改期规则
export interface ChangeRule {
  changeType: number; // 0：起飞前改期；1：起飞后改期；2：NoShow起飞前改期；3：NoShow起飞后改期
  changeFee?: number; // 当changesStatus =H,必须赋值，改期费
  changeStatus: string; // T：不可改期；H：有条件改期；F：免费改期；E：异常
  currency?: string; // 币种，支持CNY, USD, HKD, GBP, JPY 等等，默认为CNY
  remark?: string; // 改期备注信息，字符不超过500
}

// 退改规则集合
export interface RuleInfo {
  refunds?: RefundRule[];
  changes?: ChangeRule[];
}

// 价格信息
export interface PriceInfo {
  baseFare: number;
  currency: string;
  passengerType: string;
  tax: number;
  taxYq: number;
  taxYr: number;
}

// 航线代码信息
export interface RouteCodes {
  airports: string;
  cabins: string;
  carriers: string;
  flightNumbers: string;
  flightTimes: string;
  marketingCarriers: string;
  operatingCarriers: string;
}

// 航线信息
export interface FlightRoute {
  baggage: BaggageInfo[];
  cabinBaggage: CabinBaggageInfo[];
  data: string;
  ds: string;
  fareBasis: string;
  fareType: string;
  flightClass: string;
  fromSegments: FlightSegment[];
  toSegments?: FlightSegment[];
  isSelected?: boolean;
  totalPrice?: number;
  currency?: string;
  refunds?: RefundRule[]; // 退票规则集合（旧格式兼容）
  changes?: ChangeRule[]; // 改期规则集合（旧格式兼容）
  // 新增字段支持实际API返回格式
  fromTo?: string;
  itineraryId?: string;
  pcc?: string;
  prices?: PriceInfo[];
  routeCodes?: RouteCodes;
  rule?: RuleInfo; // 退改规则集合（新格式）
  tripType?: string;
  validatingCarrier?: string;
}

// 搜索响应
export interface FlightSearchResponse {
  data: {
    routes: FlightRoute[];
  };
}

// 验价请求
export interface PriceVerifyRequest {
  routeData: string;
  // 其他验价需要的字段
}

// 验价响应
export interface PriceVerifyResponse {
  success: boolean;
  price: number;
  currency: string;
  priceBreakdown?: any;
}

// 行李查询请求
export interface BaggageQueryRequest {
  routeData: string;
  // 其他行李查询需要的字段
}

// 选座查询请求
export interface SeatMapRequest {
  routeData: string;
  // 其他选座查询需要的字段
}

// 生单请求
export interface CreateOrderRequest {
  routeData: string;
  passengers: PassengerInfo[];
  contactInfo: ContactInfo;
}

// 乘客信息
export interface PassengerInfo {
  type: 'adult' | 'child' | 'infant';
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  birthDate: string;
  passport: {
    number: string;
    nationality: string;
    expireDate: string;
  };
}

// 联系人信息
export interface ContactInfo {
  email: string;
  phone: string;
  countryCode: string;
}

// 生单响应
export interface CreateOrderResponse {
  success: boolean;
  orderId: string;
  pnr: string;
  timeLimit: string;
}

// 支付校验请求
export interface PaymentVerifyRequest {
  orderId: string;
  paymentInfo: any;
}

// 出票请求
export interface TicketIssueRequest {
  orderId: string;
  pnr: string;
}

// 出票响应
export interface TicketIssueResponse {
  success: boolean;
  tickets: TicketInfo[];
}

// 票号信息
export interface TicketInfo {
  passengerName: string;
  ticketNumber: string;
  eticketFile?: string;
}

// 测试操作类型
export type TestOperation = 
  | 'search'
  | 'priceVerify'
  | 'baggageQuery'
  | 'seatMap'
  | 'createOrder'
  | 'paymentVerify'
  | 'issueTicket'
  | 'getTicketNumber';

// 操作步骤状态
export interface OperationStep {
  type: TestOperation;
  name: string;
  status: 'pending' | 'loading' | 'success' | 'error';
  requestPayload?: any;
  responsePayload?: any;
  error?: string;
}

// 测试会话状态
export interface TestSession {
  id: string;
  name: string;
  steps: OperationStep[];
  currentStep: number;
  selectedRoute?: FlightRoute;
  createdAt: string;
  updatedAt: string;
}
