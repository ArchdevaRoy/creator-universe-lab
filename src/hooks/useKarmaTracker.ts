import { useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const MILESTONES = [25, 50, 100] as const;

export function useKarmaTracker(itemId: string, durationSeconds: number) {
  const { user } = useAuth();
  const awardedRef = useRef<Set<number>>(new Set());

  const checkMilestone = useCallback(
    async (currentTimeSeconds: number) => {
      if (!user || !durationSeconds || durationSeconds === 0) return;

      const pct = Math.floor((currentTimeSeconds / durationSeconds) * 100);

      for (const milestone of MILESTONES) {
        if (pct >= milestone && !awardedRef.current.has(milestone)) {
          awardedRef.current.add(milestone);

          const { data, error } = await supabase.rpc("award_karma", {
            p_user_id: user.id,
            p_item_id: itemId,
            p_milestone: milestone,
          });

          if (!error && data && (data as any).awarded) {
            toast({
              title: `🔥 +${(data as any).points} Karma`,
              description: `${milestone}% milestone reached!`,
            });
          }
        }
      }
    },
    [user, itemId, durationSeconds]
  );

  const resetTracker = useCallback(() => {
    awardedRef.current.clear();
  }, []);

  return { checkMilestone, resetTracker };
}
