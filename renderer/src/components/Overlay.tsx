import React, { useEffect, useState } from "react";

interface Unit {
  id: number;
  name: string;
  icon: string;
  items: string[];
}

interface Player {
  name: string;
  health: number;
  units: Unit[];
}

declare global {
  interface Window {
    electronAPI: {
      onUpdateTFT: (callback: (event: any, data: Player[]) => void) => void;
    };
  }
}

export default function Overlay() {
  const [participants, setParticipants] = useState<Player[]>([]);

  const dummy = [
    {
      name: "sad",
      health: 32,
      units: [
        {
          id: 12,
          name: "garen",
          icon: "",
          items: ["garoil"],
        },
      ],
    },
  ];

  useEffect(() => {
    // window.electronAPI.onUpdateTFT((_, data) => {
    //   setParticipants(data);
    // });
    setParticipants(dummy);
  }, []);

  return (
    <div>
      {participants.map((p) => (
        <div key={p.name}>
          {p.name} ({p.health} HP)
        </div>
      ))}
    </div>
  );
}
