-- 接続テーブル: 複数の入力接続をサポート
CREATE TABLE IF NOT EXISTS public.exam_connections (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    source_selection_id uuid NOT NULL REFERENCES public.user_exam_selections(id) ON DELETE CASCADE,
    target_selection_id uuid NOT NULL REFERENCES public.user_exam_selections(id) ON DELETE CASCADE,
    condition_type text NOT NULL CHECK (condition_type IN ('pass', 'fail')),
    created_at timestamptz DEFAULT now(),
    UNIQUE(source_selection_id, condition_type)
);

ALTER TABLE public.exam_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own connections" ON public.exam_connections
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own connections" ON public.exam_connections
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own connections" ON public.exam_connections
    FOR DELETE USING (auth.uid() = user_id);

-- 既存データの移行
INSERT INTO public.exam_connections (user_id, source_selection_id, target_selection_id, condition_type)
SELECT s.user_id, s.condition_source_id, s.id, s.condition_type
FROM public.user_exam_selections s
WHERE s.condition_source_id IS NOT NULL AND s.condition_type IS NOT NULL
ON CONFLICT DO NOTHING;
