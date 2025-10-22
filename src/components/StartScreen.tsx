import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import bombImage from "@/assets/bomb.png";

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-2 animate-bounce-in">
        <CardHeader className="text-center pb-0">
          <img
            src={bombImage}
            alt="La Bomba Gramática"
            className="w-48 h-48 mx-auto mb-6 drop-shadow-2xl"
          />
          <CardTitle className="text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
            ¡La Bomba Gramática!
          </CardTitle>
          <CardDescription className="text-xl mt-4">
            ¡Responde las preguntas antes de que explote la bomba!
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="space-y-4 mb-8">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">📚 Cómo jugar:</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Responde preguntas de gramática española</li>
                <li>• Tienes 20 segundos por pregunta</li>
                <li>• Cada respuesta correcta suma puntos</li>
                <li>• ¡Consigue rachas para más puntos!</li>
              </ul>
            </div>
          </div>
          <Button
            onClick={onStart}
            size="lg"
            className="w-full text-xl font-bold h-16 shadow-lg hover:scale-105 transition-transform"
          >
            ¡Empezar a Jugar!
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StartScreen;
