import React, { useEffect, useState } from "react";

type Payload = {
  gameflow: string;
  summoner: { displayName: string } | null;
  liveData: any;
};

declare global {
  interface Window {
    overlay?: {
      onData: (cb: (payload: Payload) => void) => void;
      send?: (channel: string, data?: any) => void;
    };
  }
}

export default function App() {
  const [p, setP] = useState<Payload>({
    gameflow: "Unknown",
    summoner: null,
    liveData: null,
  });

  useEffect(() => {
    window.overlay?.onData((payload) => setP(payload));
  }, []);

  const time = Math.floor(p.liveData?.gameData?.gameTime ?? 0);
  const meGold = (() => {
    const me = p.liveData?.allPlayers?.find(
      (x: any) => x.summonerName === p.summoner?.displayName
    );
    return me?.scores?.gold ?? "-";
  })();

  return (
    <div
      style={{
        padding: 12,
        color: "#fff",
        background: "rgba(20,20,30,0.35)",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.15)",
        backdropFilter: "blur(8px)",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
      }}
    >
      <div style={{ display: "flex", gap: 12 }}>
        <Badge>phase: {p.gameflow}</Badge>
        <span style={{ opacity: 0.8 }}>
          summoner: {p.summoner?.displayName ?? "-"}
        </span>
      </div>
      <div style={{ marginTop: 8, opacity: 0.85, fontSize: 12 }}>
        {p.liveData ? `time: ${time}s | gold: ${meGold}` : "(not in game)"}
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        padding: "2px 8px",
        background: "rgba(255,255,255,.15)",
        borderRadius: 8,
      }}
    >
      {children}
    </span>
  );
}
