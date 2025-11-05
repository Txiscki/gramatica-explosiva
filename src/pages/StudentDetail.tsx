import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, TrendingUp, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserSessions, GameSession } from "@/services/gameSessionService";
import { getUserProfile, UserProfile } from "@/services/userService";
import BadgeDisplay from "@/components/BadgeDisplay";

const StudentDetail = () => {
  const navigate = useNavigate();
  const { studentId } = useParams<{ studentId: string }>();
  const { userRole } = useAuth();
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [student, setStudent] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userRole !== "teacher") {
      navigate("/");
      return;
    }

    const loadStudentData = async () => {
      if (!studentId) return;

      try {
        const [studentProfile, studentSessions] = await Promise.all([
          getUserProfile(studentId),
          getUserSessions(studentId),
        ]);

        setStudent(studentProfile);
        setSessions(studentSessions);
        setLoading(false);
      } catch (error) {
        console.error("Error loading student data:", error);
        setLoading(false);
      }
    };

    loadStudentData();
  }, [studentId, userRole, navigate]);

  const getStats = () => {
    const totalGames = sessions.length;
    const totalScore = sessions.reduce((sum, s) => sum + s.score, 0);
    const maxStreak = Math.max(...sessions.map(s => s.streak), 0);
    const avgScore = totalGames > 0 ? Math.round(totalScore / totalGames) : 0;
    const perfectGames = sessions.filter(s => s.isPerfectGame).length;
    const totalCorrectAnswers = sessions.reduce((sum, s) => sum + (s.correctAnswers || 0), 0);
    const totalWrongAnswers = sessions.reduce((sum, s) => sum + (s.wrongAnswers || 0), 0);

    // Calculate most played difficulty
    const difficultyCount = sessions.reduce((acc, s) => {
      acc[s.difficulty] = (acc[s.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostPlayedDifficulty = Object.entries(difficultyCount)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A";

    return {
      totalGames,
      totalScore,
      maxStreak,
      avgScore,
      perfectGames,
      totalCorrectAnswers,
      totalWrongAnswers,
      mostPlayedDifficulty,
    };
  };

  const difficultyColors = {
    a2: "bg-success",
    b1: "bg-secondary",
    b2: "bg-accent",
    c1: "bg-primary",
    c2: "bg-destructive"
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading student data...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-lg">Student not found</p>
        <Button onClick={() => navigate("/teacher-dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => navigate("/teacher-dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-4xl font-bold">{student.displayName}</h1>
            <p className="text-muted-foreground">{student.email}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Games</CardDescription>
              <CardTitle className="text-3xl">{stats.totalGames}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Score</CardDescription>
              <CardTitle className="text-3xl">{stats.totalScore}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Average Score</CardDescription>
              <CardTitle className="text-3xl">{stats.avgScore}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Max Streak</CardDescription>
              <CardTitle className="text-3xl">{stats.maxStreak}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Most Played Level</CardDescription>
              <CardTitle className="text-2xl">
                <Badge className={difficultyColors[stats.mostPlayedDifficulty as keyof typeof difficultyColors]}>
                  {stats.mostPlayedDifficulty.toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Perfect Games</CardDescription>
              <CardTitle className="text-3xl">{stats.perfectGames}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>All unlocked badges</CardDescription>
          </CardHeader>
          <CardContent>
            {studentId && <BadgeDisplay userId={studentId} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Game History</CardTitle>
            <CardDescription>All games played by this student</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead className="text-center">Streak</TableHead>
                  <TableHead className="text-center">Correct</TableHead>
                  <TableHead className="text-center">Wrong</TableHead>
                  <TableHead className="text-center">Time</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {new Date(session.timestamp).toLocaleDateString()} {new Date(session.timestamp).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={difficultyColors[session.difficulty]}>
                        {session.difficulty.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Trophy className="w-4 h-4 text-secondary" />
                        {session.score}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <TrendingUp className="w-4 h-4 text-accent" />
                        {session.streak}
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-success">{session.correctAnswers}</TableCell>
                    <TableCell className="text-center text-destructive">{session.wrongAnswers}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="w-4 h-4" />
                        {Math.floor(session.completionTimeSeconds / 60)}:{String(session.completionTimeSeconds % 60).padStart(2, "0")}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {session.isPerfectGame && <Badge variant="secondary">Perfect!</Badge>}
                      {session.isInfiniteMode && <Badge className="bg-primary">Infinite</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
                {sessions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No games played yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDetail;
