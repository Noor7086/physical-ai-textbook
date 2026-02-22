/**
 * API service for communicating with the FastAPI backend.
 */

// In production (Vercel), API is on the same domain. Locally, use the dev server.
const API_URL =
  typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? ""
    : "http://localhost:8000";

interface ChatRequest {
  message: string;
  session_id: string;
  chapter_context?: string;
}

interface ChapterReference {
  chapter_slug: string;
  chapter_title: string;
  module_slug: string;
  relevance_score: number;
}

interface ChatResponse {
  response: string;
  references: ChapterReference[];
  session_id: string;
}

interface SelectedTextRequest {
  selected_text: string;
  question: string;
  chapter_slug: string;
}

interface SignupRequest {
  email: string;
  password: string;
  profile: {
    python_level: string;
    ros_level: string;
    ml_level: string;
    arduino_experience: boolean;
    jetson_experience: boolean;
    robot_experience: boolean;
    learning_goals?: string;
  };
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  user: { id: string; email: string; created_at: string };
  token: string;
  expires_at: string;
}

interface UserWithProfile {
  id: string;
  email: string;
  created_at: string;
  profile: {
    id: string;
    user_id: string;
    python_level: string;
    ros_level: string;
    ml_level: string;
    arduino_experience: boolean;
    jetson_experience: boolean;
    robot_experience: boolean;
    learning_goals: string | null;
    created_at: string;
  } | null;
}

interface PersonalizeRequest {
  chapter_slug: string;
  content: string;
}

interface PersonalizeResponse {
  personalized_content: string;
  adaptations_made: string[];
}

interface TranslateRequest {
  content: string;
  chapter_slug: string;
}

interface TranslateResponse {
  translated_content: string;
  cached: boolean;
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || "API request failed");
  }
  return res.json();
}

// Chat endpoints
export async function sendChatMessage(
  data: ChatRequest,
): Promise<ChatResponse> {
  return request<ChatResponse>("/api/chat", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function askAboutSelectedText(
  data: SelectedTextRequest,
): Promise<ChatResponse> {
  return request<ChatResponse>("/api/chat/selected-text", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function streamChatMessage(data: ChatRequest): EventSource | null {
  // For SSE streaming, we use a POST workaround via fetch
  return null; // Simplified: use sendChatMessage for now
}

// Auth endpoints
export async function signup(data: SignupRequest): Promise<AuthResponse> {
  const res = await request<AuthResponse>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", res.token);
  }
  return res;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", res.token);
  }
  return res;
}

export async function logout(): Promise<void> {
  try {
    await request("/api/auth/logout", { method: "POST" });
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }
}

export async function getCurrentUser(): Promise<UserWithProfile> {
  return request<UserWithProfile>("/api/auth/me");
}

// Personalization endpoint
export async function personalizeContent(
  data: PersonalizeRequest,
): Promise<PersonalizeResponse> {
  return request<PersonalizeResponse>("/api/personalize", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Translation endpoint
export async function translateToUrdu(
  data: TranslateRequest,
): Promise<TranslateResponse> {
  return request<TranslateResponse>("/api/translate", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export type {
  ChatRequest,
  ChatResponse,
  ChapterReference,
  SelectedTextRequest,
  SignupRequest,
  LoginRequest,
  AuthResponse,
  UserWithProfile,
  PersonalizeRequest,
  PersonalizeResponse,
  TranslateRequest,
  TranslateResponse,
};
