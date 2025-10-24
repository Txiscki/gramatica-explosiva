import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getAllSessions, GameSession } from "@/services/gameSessionService";
import { getAllUsers, UserProfile } from "@/services/userService";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile?.role !== "teacher") {
      navigate("/");
      return;
    }

    const loadData = async () => {
      const [sessionsData, usersData] = await Promise.all([
        getAllSessions(),
        getAllUsers()
      ]);
      setSessions(sessionsData);
      setUsers(usersData.filter(u => u.role === "student"));
      setLoading(false);
    };

    loadData();
  }, [userProfile, navigate]);

  const getStudentStats = (userId: string) => {
    const studentSessions = sessions.filter(s => s.userId === userId);
    const totalGames = studentSessions.length;
    const totalScore = studentSessions.reduce((sum, s) => sum + s.score, 0);
    const maxStreak = Math.max(...studentSessions.map(s => s.streak), 0);
    const avgScore = totalGames > 0 ? Math.round(totalScore / totalGames) : 0;

    return { totalGames, totalScore, maxStreak, avgScore };
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
        <p className="text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Game
          </Button>
          <div>
            <h1 className="text-4xl font-bold">Teacher Dashboard</h1>
            <p className="text-muted-foreground">Monitor student progress and performance</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Students</CardDescription>
              <CardTitle className="text-3xl">{users.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Games Played</CardDescription>
              <CardTitle className="text-3xl">{sessions.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Average Score</CardDescription>
              <CardTitle className="text-3xl">
                {sessions.length > 0 
                  ? Math.round(sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length)
                  : 0
                }
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Student Performance</CardTitle>
            <CardDescription>Overview of all students and their statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead className="text-center">Games Played</TableHead>
                  <TableHead className="text-center">Total Score</TableHead>
                  <TableHead className="text-center">Avg Score</TableHead>
                  <TableHead className="text-center">Max Streak</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const stats = getStudentStats(user.uid!);
                  return (
                    <TableRow key={user.uid}>
                      <TableCell className="font-medium">{user.displayName}</TableCell>
                      <TableCell className="text-center">{stats.totalGames}</TableCell>
                      <TableCell className="text-center">{stats.totalScore}</TableCell>
                      <TableCell className="text-center">{stats.avgScore}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{stats.maxStreak}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No students yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Game Sessions</CardTitle>
            <CardDescription>Latest games played by students</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead className="text-center">Streak</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.slice(0, 20).map((session, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{session.displayName}</TableCell>
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
                    <TableCell>{new Date(session.timestamp).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
                {sessions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No game sessions yet
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

export default TeacherDashboard;
