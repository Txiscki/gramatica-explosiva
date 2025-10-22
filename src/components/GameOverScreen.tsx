import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, RotateCcw } from "lucide-react";

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

const GameOverScreen = ({ score, onRestart }: GameOverScreenProps) => {
  const getMessage = () => {
    if (score >= 50) return "¡Eres un maestro de la gramática!";
    if (score >= 30) return "¡Muy bien! Sigue practicando";
    if (score >= 10) return "¡Buen intento! Puedes mejorar";
    return "¡Sigue intentándolo!";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-2 animate-bounce-in">
        <CardHeader className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center shadow-xl">
            <Trophy className="w-16 h-16 text-white" />
          </div>
          <CardTitle className="text-4xl font-bold mb-2">
            ¡Fin del Juego!
          </CardTitle>
          <CardDescription className="text-2xl mt-2 font-semibold text-foreground">
            {getMessage()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-8 rounded-xl mb-8 text-center border-2 border-primary/20">
            <p className="text-muted-foreground text-lg mb-2">Puntuación Final</p>
            <p className="text-6xl font-bold text-primary">{score}</p>
          </div>

          <Button
            onClick={onRestart}
            size="lg"
            className="w-full text-xl font-bold h-16 shadow-lg hover:scale-105 transition-transform"
          >
            <RotateCcw className="w-6 h-6 mr-2" />
            Jugar de Nuevo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameOverScreen;
