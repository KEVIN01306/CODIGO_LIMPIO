export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface WorkspaceContext {
  currentCode: string;
  language: string;
  lastExecutionOutput?: string | null;
  exerciseGoal: string;
}

export interface AiChatRequest {
  studentPrompt: string;
  chatHistory: ChatMessage[];
  workspaceContext: WorkspaceContext;
}
