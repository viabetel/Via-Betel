-- Storage buckets para marketplace
CREATE BUCKET IF NOT EXISTS documents;
CREATE BUCKET IF NOT EXISTS chat_attachments;

-- RLS no bucket documents
CREATE POLICY "documents_read_own" ON storage.objects FOR SELECT
  USING (bucket_id = 'documents' AND auth.uid()::text = SPLIT_PART((storage.foldername(name))[1], '_', 1));

CREATE POLICY "documents_insert_own" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = SPLIT_PART((storage.foldername(name))[1], '_', 1));

-- RLS no bucket chat_attachments
CREATE POLICY "chat_attachments_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'chat_attachments');

CREATE POLICY "chat_attachments_insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'chat_attachments' AND auth.uid() IS NOT NULL);
