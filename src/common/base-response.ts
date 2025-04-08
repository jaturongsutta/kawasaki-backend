// Define a base response interface
export interface BaseResponse {
  status: 0 | 1 | 2;
  message?: string;
  data?: any; // Optional, can be used to return any additional data
}
