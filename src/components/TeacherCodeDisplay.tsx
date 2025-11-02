import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { getOrCreateTeacherCode } from "@/services/teacherLinkingService";
import { useToast } from "@/hooks/use-toast";

interface TeacherCodeDisplayProps {
  teacherId: string;
}

const TeacherCodeDisplay = ({ teacherId }: TeacherCodeDisplayProps) => {
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadCode = async () => {
      try {
        const teacherCode = await getOrCreateTeacherCode(teacherId);
        setCode(teacherCode);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load teacher code",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadCode();
  }, [teacherId, toast]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Teacher code copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Teacher Code</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Teacher Code</CardTitle>
        <CardDescription>
          Share this code with your students so they can link to you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-muted p-4 rounded-lg">
            <p className="text-3xl font-bold tracking-widest text-center">{code}</p>
          </div>
          <Button onClick={handleCopy} variant="outline" size="icon">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherCodeDisplay;
