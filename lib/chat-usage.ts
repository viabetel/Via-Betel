/**
 * Serviço para controlar limite de 7 conversas mensais para instrutores sem plano ativo.
 *
 * REGRAS:
 * - Instrutores COM plano ativo: SEM LIMITE
 * - Instrutores SEM plano ativo: máximo 7 conversas diferentes por mês
 * - "Conversa" = thread com um aluno específico
 * - Só conta quando o instrutor envia a PRIMEIRA resposta na conversa naquele mês
 * - Se continuar conversando com o mesmo aluno, não incrementa o contador
 * - Reset automático no início de cada mês (baseado em year + month)
 */

import { createClient } from "@/lib/supabase/server"

const FREE_CONVERSATION_LIMIT = 7

interface MonthlyChatUsage {
  id: string
  userId: string
  year: number
  month: number
  usedConversations: number
}

interface ChatUsageResult {
  canSend: boolean
  usedConversations: number
  limit: number
  isNewConversation: boolean
  hasActivePlan: boolean
}

/**
 * Verifica se o instrutor tem plano ativo
 */
async function checkInstructorHasActivePlan(userId: string): Promise<boolean> {
  const supabase = await createClient()

  // Busca o instructor_id baseado no user_id (email match ou campo direto)
  const { data: profile } = await supabase.from("profiles").select("email").eq("id", userId).single()

  if (!profile?.email) return false

  // Busca o instrutor pelo email
  const { data: instructor } = await supabase.from("instructors").select("id").eq("email", profile.email).single()

  if (!instructor) return false

  // Verifica se tem subscription ativa
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status, expires_at")
    .eq("instructor_id", instructor.id)
    .eq("status", "ACTIVE")
    .single()

  if (!subscription) return false

  // Verifica se não expirou
  if (subscription.expires_at) {
    const expiresAt = new Date(subscription.expires_at)
    if (expiresAt < new Date()) return false
  }

  return true
}

/**
 * Obtém ou cria o registro de uso mensal para o instrutor
 */
export async function getMonthlyChatUsage(userId: string, date: Date = new Date()): Promise<MonthlyChatUsage> {
  const supabase = await createClient()
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // JavaScript months are 0-indexed

  // Tenta buscar registro existente
  const { data: existing } = await supabase
    .from("monthly_chat_usage")
    .select("*")
    .eq("user_id", userId)
    .eq("year", year)
    .eq("month", month)
    .single()

  if (existing) {
    return {
      id: existing.id,
      userId: existing.user_id,
      year: existing.year,
      month: existing.month,
      usedConversations: existing.used_conversations,
    }
  }

  // Cria novo registro para o mês
  const { data: created, error } = await supabase
    .from("monthly_chat_usage")
    .insert({
      user_id: userId,
      year,
      month,
      used_conversations: 0,
    })
    .select()
    .single()

  if (error) {
    // Pode ter sido criado por outra request concorrente, tenta buscar novamente
    const { data: retry } = await supabase
      .from("monthly_chat_usage")
      .select("*")
      .eq("user_id", userId)
      .eq("year", year)
      .eq("month", month)
      .single()

    if (retry) {
      return {
        id: retry.id,
        userId: retry.user_id,
        year: retry.year,
        month: retry.month,
        usedConversations: retry.used_conversations,
      }
    }

    throw new Error("Erro ao criar registro de uso mensal")
  }

  return {
    id: created.id,
    userId: created.user_id,
    year: created.year,
    month: created.month,
    usedConversations: created.used_conversations,
  }
}

/**
 * Verifica se a conversa já foi contabilizada para o instrutor neste mês
 */
async function isConversationAlreadyCounted(
  userId: string,
  conversationId: string,
  year: number,
  month: number,
): Promise<boolean> {
  const supabase = await createClient()

  const { data } = await supabase
    .from("conversation_usage_logs")
    .select("id")
    .eq("user_id", userId)
    .eq("conversation_id", conversationId)
    .eq("year", year)
    .eq("month", month)
    .single()

  return !!data
}

/**
 * Verifica se o instrutor pode enviar mensagem nesta conversa
 *
 * Retorna:
 * - canSend: true se pode enviar
 * - usedConversations: quantas conversas já usou no mês
 * - limit: limite máximo (7 para gratuito)
 * - isNewConversation: true se esta conversa ainda não foi contada no mês
 * - hasActivePlan: true se tem plano ativo (sem limite)
 */
export async function canInstructorSendMessage(
  userId: string,
  conversationId: string,
  date: Date = new Date(),
): Promise<ChatUsageResult> {
  // Verifica se tem plano ativo
  const hasActivePlan = await checkInstructorHasActivePlan(userId)

  // Se tem plano ativo, sempre pode enviar
  if (hasActivePlan) {
    return {
      canSend: true,
      usedConversations: 0,
      limit: Number.POSITIVE_INFINITY,
      isNewConversation: false,
      hasActivePlan: true,
    }
  }

  const year = date.getFullYear()
  const month = date.getMonth() + 1

  // Busca uso mensal
  const usage = await getMonthlyChatUsage(userId, date)

  // Verifica se esta conversa já foi contada
  const alreadyCounted = await isConversationAlreadyCounted(userId, conversationId, year, month)

  // Se já foi contada, pode continuar conversando
  if (alreadyCounted) {
    return {
      canSend: true,
      usedConversations: usage.usedConversations,
      limit: FREE_CONVERSATION_LIMIT,
      isNewConversation: false,
      hasActivePlan: false,
    }
  }

  // Se é nova conversa, verifica se atingiu o limite
  const canSend = usage.usedConversations < FREE_CONVERSATION_LIMIT

  return {
    canSend,
    usedConversations: usage.usedConversations,
    limit: FREE_CONVERSATION_LIMIT,
    isNewConversation: true,
    hasActivePlan: false,
  }
}

/**
 * Marca a conversa como usada e incrementa o contador (se necessário)
 * Chamado APÓS enviar a primeira mensagem na conversa no mês
 */
export async function markConversationAsUsed(
  userId: string,
  conversationId: string,
  date: Date = new Date(),
): Promise<void> {
  const supabase = await createClient()
  const year = date.getFullYear()
  const month = date.getMonth() + 1

  // Verifica se já foi contada
  const alreadyCounted = await isConversationAlreadyCounted(userId, conversationId, year, month)
  if (alreadyCounted) return

  // Registra que esta conversa foi contada
  await supabase
    .from("conversation_usage_logs")
    .insert({
      user_id: userId,
      conversation_id: conversationId,
      year,
      month,
    })
    .select()
    .single()

  // Incrementa contador de uso mensal
  await supabase.rpc("increment_chat_usage", {
    p_user_id: userId,
    p_year: year,
    p_month: month,
  })
}

/**
 * Obtém informações de uso para exibição na UI
 */
export async function getChatUsageInfo(userId: string): Promise<{
  hasActivePlan: boolean
  usedConversations: number
  limit: number
  remaining: number
  renewsAt: Date
  isNearLimit: boolean
}> {
  const hasActivePlan = await checkInstructorHasActivePlan(userId)

  if (hasActivePlan) {
    return {
      hasActivePlan: true,
      usedConversations: 0,
      limit: Number.POSITIVE_INFINITY,
      remaining: Number.POSITIVE_INFINITY,
      renewsAt: new Date(),
      isNearLimit: false,
    }
  }

  const usage = await getMonthlyChatUsage(userId)
  const remaining = Math.max(0, FREE_CONVERSATION_LIMIT - usage.usedConversations)

  // Calcula quando renova (primeiro dia do próximo mês)
  const now = new Date()
  const renewsAt = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  return {
    hasActivePlan: false,
    usedConversations: usage.usedConversations,
    limit: FREE_CONVERSATION_LIMIT,
    remaining,
    renewsAt,
    isNearLimit: usage.usedConversations >= 5, // Alerta quando usa 5 ou mais
  }
}
