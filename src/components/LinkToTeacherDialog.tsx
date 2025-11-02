import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { linkStudentToTeacher } from "@/services/teacherLinkingService";
import { useToast } from "@/hooks/use-toast";

interface LinkToTeacherDialogProps {
  studentId: string;
  onLinked?: () => void;
}

const LinkToTeacherDialog = ({ studentId, onLinked }: LinkToTeacherDialogProps) => {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLink = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter a teacher code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await linkStudentToTeacher(studentId, code.trim().toUpperCase());
      toast({
        title: "Success!",
        description: "You've been linked to your teacher",
      });
      setOpen(false);
      setCode("");
      onLinked?.();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid teacher code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="w-4 h-4 mr-2" />
          Link to Teacher
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link to Your Teacher</DialogTitle>
          <DialogDescription>
            Enter the 6-character code provided by your teacher
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="teacher-code">Teacher Code</Label>
            <Input
              id="teacher-code"
              placeholder="ABC123"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="text-center text-xl tracking-widest uppercase"
            />
          </div>
          <Button onClick={handleLink} disabled={loading} className="w-full">
            {loading ? "Linking..." : "Link to Teacher"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LinkToTeacherDialog;
