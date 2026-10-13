export interface LoginPops {
  isLogin: boolean;
  setIsLogin?: (state: boolean) => void;
}

export type LoginState = {
  success: boolean;
  error?: string;
  user?: UserPayload;
};

export interface UserPayload {
  sub: string;
  email?: string;
  name?: string;
  role?: string;
  uid?: string;
  typ?: string;
  iat: number;
  exp: number;
}

export interface ApiErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}

export interface ApiSuccessResponse {
  message: string;
  data: {
    token: string;
  };
}

export interface AuthContextType {
  user: UserPayload | null;
  setUser: (user: UserPayload | null) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}