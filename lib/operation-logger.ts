export type OperationEvent =
  | "generation_started"
  | "generation_completed"
  | "ai_error"
  | "image_error"
  | "supabase_error"
  | "estimated_cost"
  | "regeneration_done"
  | "content_approved"
  | "content_published";

export type OperationLog = {
  id: string;
  event: OperationEvent;
  message: string;
  level: "info" | "warning" | "error";
  createdAt: string;
  metadata?: Record<string, string | number | boolean | null | undefined>;
};

export function createOperationLog(
  event: OperationEvent,
  message: string,
  metadata?: OperationLog["metadata"],
  level: OperationLog["level"] = event.includes("error") ? "error" : "info"
): OperationLog {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    event,
    message,
    level,
    createdAt: new Date().toISOString(),
    metadata
  };
}

export function logOperation(log: OperationLog) {
  const payload = {
    event: log.event,
    message: log.message,
    createdAt: log.createdAt,
    ...log.metadata
  };

  if (log.level === "error") {
    console.error("[EntrelinhasContentStudio]", payload);
    return;
  }

  if (log.level === "warning") {
    console.warn("[EntrelinhasContentStudio]", payload);
    return;
  }

  console.info("[EntrelinhasContentStudio]", payload);
}

export function friendlyErrorMessage(error: unknown) {
  const message = readableErrorMessage(error);

  if (/JSON|invalid/i.test(message)) return "A IA retornou um formato invalido. Use o fallback ou tente regenerar este item.";
  if (/cost|limite|budget/i.test(message)) return "Limite de custo atingido. Use modo economico ou regenere so um conteúdo.";
  if (/Supabase|database|banco|RLS|permission|policy/i.test(message)) {
    return `Falha no banco ou permissão: ${message}`;
  }
  if (/storage|bucket|upload/i.test(message)) return `Storage indisponível: ${message}`;
  if (/image|imagem|PNG|post/i.test(message)) return "Post ainda não foi gerado. Clique em Gerar post para tentar novamente.";
  if (/OpenAI|Gemini|IA|provider/i.test(message)) return "IA indisponível. O app pode continuar com fallback local.";
  if (/content|blocked|bloqueado/i.test(message)) return "Conteudo invalido pelas regras de segurança. Ajuste ou regenere este item.";

  return message || "Algo não saiu como esperado. Tente novamente em instantes.";
}

function readableErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (!error) return "";
  if (typeof error === "string") return error;
  if (typeof error === "object") {
    const record = error as Record<string, unknown>;
    const parts = [record.message, record.code, record.details, record.hint]
      .filter(Boolean)
      .map(String);

    if (parts.length > 0) return parts.join(" | ");

    try {
      return JSON.stringify(record);
    } catch {
      return "Erro desconhecido em formato de objeto.";
    }
  }

  return String(error);
}
