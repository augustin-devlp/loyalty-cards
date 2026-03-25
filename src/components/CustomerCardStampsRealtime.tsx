"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getShape } from "@/lib/stampShapes";

interface Props {
  customerCardId: string;
  initialStamps: number;
  initialPoints: number;
  cardType: "stamp" | "points";
  stampsRequired: number;
  rewardThreshold: number;
  primaryColor: string;
  textColor: string;
  stampShape: string;
  rewardsClaimed: number;
}

export default function CustomerCardStampsRealtime({
  customerCardId,
  initialStamps,
  initialPoints,
  cardType,
  stampsRequired,
  rewardThreshold,
  primaryColor,
  textColor,
  stampShape,
  rewardsClaimed,
}: Props) {
  const [stamps, setStamps] = useState(initialStamps);
  const [points, setPoints] = useState(initialPoints);
  const bg = primaryColor;
  const fg = textColor;

  useEffect(() => {
    const supabase = createClient();

    // Supabase Realtime subscription
    const channel = supabase
      .channel(`customer-card-${customerCardId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "customer_cards",
          filter: `id=eq.${customerCardId}`,
        },
        (payload) => {
          const row = payload.new as { current_stamps?: number; current_points?: number };
          if (row.current_stamps != null) setStamps(row.current_stamps);
          if (row.current_points != null) setPoints(row.current_points);
        }
      )
      .subscribe((status) => {
        // If realtime not available, fall back to polling
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          startPolling();
        }
      });

    // Polling fallback
    let pollInterval: ReturnType<typeof setInterval> | null = null;
    function startPolling() {
      if (pollInterval) return;
      pollInterval = setInterval(async () => {
        const { data } = await supabase
          .from("customer_cards")
          .select("current_stamps, current_points")
          .eq("id", customerCardId)
          .single();
        if (data) {
          if (data.current_stamps != null) setStamps(data.current_stamps);
          if (data.current_points != null) setPoints(data.current_points);
        }
      }, 3000);
    }

    return () => {
      supabase.removeChannel(channel);
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [customerCardId]);

  const shape = stampShape ?? "circle";
  const shapeData = getShape(shape);
  const stampProgress = Math.min(stamps / stampsRequired, 1);
  const pointsProgress = Math.min(points / rewardThreshold, 1);

  function StampCell({ filled }: { filled: boolean }) {
    if (shape === "circle") {
      return (
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: `2px solid ${bg}`,
            backgroundColor: filled ? bg : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 700,
            color: filled ? fg : bg,
          }}
        >
          {filled ? "✓" : ""}
        </div>
      );
    }
    return (
      <svg
        viewBox="0 0 24 24"
        width={34}
        height={34}
        style={{ color: bg, opacity: filled ? 1 : 0.2 }}
        dangerouslySetInnerHTML={{ __html: shapeData.svg }}
      />
    );
  }

  if (cardType === "stamp") {
    return (
      <div>
        <div className="flex justify-between text-sm font-medium text-gray-700 mb-3">
          <span>Tampons</span>
          <span>{stamps} / {stampsRequired}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {Array.from({ length: Math.min(stampsRequired, 15) }).map((_, i) => (
            <StampCell key={i} filled={i < stamps} />
          ))}
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${stampProgress * 100}%`, backgroundColor: bg }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {stampsRequired - stamps > 0
            ? `Plus que ${stampsRequired - stamps} tampon(s) pour votre récompense !`
            : "🎉 Vous avez atteint votre récompense !"}
        </p>
        {rewardsClaimed > 0 && (
          <p className="text-xs text-gray-400 mt-3">Récompenses obtenues : {rewardsClaimed}</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between text-sm font-medium text-gray-700 mb-3">
        <span>Points</span>
        <span>{points} / {rewardThreshold} pts</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pointsProgress * 100}%`, backgroundColor: bg }}
        />
      </div>
      <p className="text-xs text-gray-400">
        {rewardThreshold - points > 0
          ? `Plus que ${rewardThreshold - points} points pour votre récompense !`
          : "🎉 Vous avez atteint votre récompense !"}
      </p>
      {rewardsClaimed > 0 && (
        <p className="text-xs text-gray-400 mt-3">Récompenses obtenues : {rewardsClaimed}</p>
      )}
    </div>
  );
}
