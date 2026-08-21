const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `API error (${res.status}): ${res.statusText}`);
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
  return request<any>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function signupUser(email: string, password: string, fullName: string, role: string = "counselor") {
  return request<any>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, full_name: fullName, role }),
  });
}

export async function demoLogin() {
  return loginUser("demo@kintsu.org", "demo123");
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

export async function fetchSessionTemplates() {
  return request<any[]>("/session-builder/templates");
}

export async function generateAISession(topic: string, category: string, block?: string) {
  return request<any>("/session-builder/generate-ai", {
    method: "POST",
    body: JSON.stringify({ topic, category, block }),
  });
}

export async function saveSessionDraft(draftData: any) {
  return request<any>("/session-builder/draft", {
    method: "POST",
    body: JSON.stringify(draftData),
  });
}

export async function publishSession(sessionData: any) {
  return request<any>("/session-builder/publish", {
    method: "POST",
    body: JSON.stringify(sessionData),
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// PARTICIPANTS & PROGRESS API
// ═══════════════════════════════════════════════════════════════════════════

export async function fetchParticipants(params?: { block?: string; stage?: string }) {
  const query = new URLSearchParams(params as any).toString();
  return request<any[]>(`/participants${query ? `?${query}` : ""}`);
}

export async function fetchParticipantProgress(participantId: string) {
  return request<any>(`/progress/participants/${participantId}`);
}

export async function addCaseworkNote(participantId: string, note: string) {
  return request<any>(`/participants/${participantId}/notes`, {
    method: "POST",
    body: JSON.stringify({ note }),
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// LIBRARIES & ANALYTICS API
// ═══════════════════════════════════════════════════════════════════════════

export async function fetchStories(category?: string) {
  return request<any[]>(`/stories${category ? `?category=${encodeURIComponent(category)}` : ""}`);
}

export async function fetchBooks(category?: string) {
  return request<any[]>(`/books${category ? `?category=${encodeURIComponent(category)}` : ""}`);
}

export async function fetchAnalytics() {
  return request<any>("/analytics");
}

// ═══════════════════════════════════════════════════════════════════════════
// ROLEPLAY SIMULATOR API
// ═══════════════════════════════════════════════════════════════════════════

export async function fetchRoleplayScenarios() {
  return request<any[]>("/roleplay/scenarios");
}

export async function startRoleplay(scenarioId: string, participantName: string) {
  return request<any>("/roleplay/start", {
    method: "POST",
    body: JSON.stringify({ scenarioId, participantName }),
  });
}

export async function submitRoleplayTurn(logId: string, userInput: string) {
  return request<any>("/roleplay/turn", {
    method: "POST",
    body: JSON.stringify({ logId, userInput }),
  });
}

export async function completeRoleplay(logId: string) {
  return request<any>("/roleplay/complete", {
    method: "POST",
    body: JSON.stringify({ logId }),
  });
}
