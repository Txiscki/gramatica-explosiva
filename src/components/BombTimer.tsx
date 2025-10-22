import { useEffect, useState } from "react";
import bombImage from "@/assets/bomb.png";

interface BombTimerProps {
  timeLeft: number;
  totalTime: number;
  isActive: boolean;
}

const BombTimer = ({ timeLeft, totalTime, isActive }: BombTimerProps) => {
  const [shouldShake, setShouldShake] = useState(false);
  const percentage = (timeLeft / totalTime) * 100;
  const isWarning = percentage < 30;

  useEffect(() => {
    if (isWarning && isActive) {
      setShouldShake(true);
    } else {
      setShouldShake(false);
    }
  }, [isWarning, isActive]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className={`relative transition-all duration-300 ${
          shouldShake ? "animate-shake" : ""
        } ${isWarning ? "animate-pulse-glow" : ""}`}
      >
        <img
          src={bombImage}
          alt="Bomba"
          className="w-40 h-40 object-contain drop-shadow-2xl"
        />
        <div className="absolute -top-2 -right-2 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <span className="text-2xl font-bold text-primary-foreground">
            {timeLeft}
          </span>
        </div>
      </div>

      <div className="w-64 h-4 bg-muted rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            isWarning ? "bg-destructive" : "bg-primary"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default BombTimer;
