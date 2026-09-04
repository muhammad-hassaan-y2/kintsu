const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";


let inMemoryToken: string | null = null;

export function setAuthToken(token: string) {
  inMemoryToken = token;
}

export function getAuthToken(): string | null {
  return inMemoryToken;
}

export function clearAuthToken() {
  inMemoryToken = null;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (inMemoryToken) {
    headers["Authorization"] = `Bearer ${inMemoryToken}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `API error (${res.status}): ${res.statusText}`);
    }

    const json = await res.json();
    return json.data !== undefined ? json.data : json;
  } catch (err: any) {
    console.warn(`[Kintsu API] ${endpoint} request failed:`, err.message || err);
    throw err;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// AUTHENTICATION API (Neon PostgreSQL + FastAPI)
// ═══════════════════════════════════════════════════════════════════════════

export async function loginUser(email: string, password: string) {
  const res = await request<any>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (res && res.token) {
    setAuthToken(res.token);
  }
  return res;
}

export async function signupUser(
  email: string, 
  password: string, 
  fullName: string, 
  role: string = "counselor",
  prisonerData?: {
    prisonerName?: string;
    inmateId?: string;
    securityBlock?: string;
    riskLevel?: string;
    rehabTrack?: string;
  }
) {
  const res = await request<any>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ 
      email, 
      password, 
      full_name: fullName, 
      role,
      prisoner_name: prisonerData?.prisonerName,
      prisoner_inmate_id: prisonerData?.inmateId,
      prisoner_block: prisonerData?.securityBlock,
      prisoner_risk_level: prisonerData?.riskLevel,
      prisoner_rehab_track: prisonerData?.rehabTrack
    }),
  });
  if (res && res.token) {
    setAuthToken(res.token);
  }
  return res;
}


export async function demoLogin() {
  const res = await request<any>("/auth/demo-login", { method: "POST" });
  if (res && res.token) {
    setAuthToken(res.token);
  }
  return res;
}


export async function fetchCurrentUser() {
  return request<any>("/auth/me");
}

// ═══════════════════════════════════════════════════════════════════════════
// PRISONER FILE & INTAKE API (Neon PostgreSQL)
// ═══════════════════════════════════════════════════════════════════════════

export async function createPrisonerIntake(data: {
  inmate_id: string;
  full_name: string;
  security_block?: string;
  risk_level?: string;
  rehab_track?: string;
  counselor_notes?: string;
}) {
  return request<any>("/participants/intake", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchPrisonerFiles() {
  return request<any>("/participants/files");
}

export async function fetchCaseNotes(inmateId: string) {
  return request<any>(`/participants/${inmateId}/case-notes`);
}

export async function createCaseNote(inmateId: string, noteData: { note_text: string; category?: string; counselor_name?: string }) {
  return request<any>(`/participants/${inmateId}/case-notes`, {
    method: "POST",
    body: JSON.stringify(noteData),
  });
}


// ═══════════════════════════════════════════════════════════════════════════
// SESSIONS API
// ═══════════════════════════════════════════════════════════════════════════

export async function fetchTodaySessions() {
  return request<any[]>("/sessions/today");
}

export async function fetchSessions(params?: { status?: string; block?: string; category?: string }) {
  const query = new URLSearchParams(params as any).toString();
  return request<any[]>(`/sessions${query ? `?${query}` : ""}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// SESSION BUILDER API
// ═══════════════════════════════════════════════════════════════════════════

export async function generateAISession(params: { topic: string; targetGroup?: string; durationMinutes?: number; inmateId?: string }) {
  return request<any>("/session-builder/generate-ai", {
    method: "POST",
    body: JSON.stringify({
      topic: params.topic,
      block: params.targetGroup,
      inmate_id: params.inmateId
    }),
  });
}


export async function publishSession(sessionData: any) {
  return request<any>("/session-builder/publish", {
    method: "POST",
    body: JSON.stringify(sessionData),
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// PARTICIPANTS & REHABILITATION API
// ═══════════════════════════════════════════════════════════════════════════

export async function fetchParticipants(params?: { block?: string; stage?: string }) {
  const query = new URLSearchParams(params as any).toString();
  return request<any[]>(`/participants${query ? `?${query}` : ""}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTENT & RESOURCES API
// ═══════════════════════════════════════════════════════════════════════════

export async function fetchStories(category?: string) {
  return request<any[]>(`/stories${category ? `?category=${category}` : ""}`);
}

export async function fetchBooks(category?: string) {
  return request<any[]>(`/books${category ? `?category=${category}` : ""}`);
}

export async function fetchAnalytics() {
  return request<any>("/progress/summary");
}

// ═══════════════════════════════════════════════════════════════════════════
// ROLEPLAY SIMULATOR API
// ═══════════════════════════════════════════════════════════════════════════

export async function fetchRoleplayScenarios() {
  return request<any[]>("/roleplay/scenarios");
}

export async function startRoleplay(scenarioId: string, participantId?: string) {
  return request<any>("/roleplay/start", {
    method: "POST",
    body: JSON.stringify({ scenarioId, participantId }),
  });
}

export async function submitRoleplayTurn(logId: string, userDialogue: string) {
  return request<any>("/roleplay/turn", {
    method: "POST",
    body: JSON.stringify({ logId, userDialogue }),
  });
}

export async function completeRoleplay(logId: string) {
  return request<any>("/roleplay/complete", {
    method: "POST",
    body: JSON.stringify({ logId }),
  });
}
