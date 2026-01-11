-- Função para incrementar contador de uso de chat de forma atômica
-- Evita race conditions quando múltiplas mensagens são enviadas simultaneamente

CREATE OR REPLACE FUNCTION increment_chat_usage(
  p_user_id TEXT,
  p_year INTEGER,
  p_month INTEGER
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE monthly_chat_usage
  SET 
    used_conversations = used_conversations + 1,
    updated_at = now()
  WHERE 
    user_id = p_user_id 
    AND year = p_year 
    AND month = p_month;
    
  -- Se não existir, cria com valor 1
  IF NOT FOUND THEN
    INSERT INTO monthly_chat_usage (user_id, year, month, used_conversations)
    VALUES (p_user_id, p_year, p_month, 1)
    ON CONFLICT (user_id, year, month) 
    DO UPDATE SET 
      used_conversations = monthly_chat_usage.used_conversations + 1,
      updated_at = now();
  END IF;
END;
$$;
