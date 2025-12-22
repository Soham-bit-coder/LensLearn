import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AttendanceRecord, AttendanceSession } from '@/types';
import { CheckCircle, XCircle, Clock, Calendar, TrendingUp, Award, Target, BookOpen } from 'lucide-react';

export default function MyRecords() {
  const { user } = useAuth();

  // Get records from localStorage
  const sessions: AttendanceSession[] = JSON.parse(
    localStorage.getItem('attendanceSessions') || '[]'
  );
  const records: AttendanceRecord[] = JSON.parse(
    localStorage.getItem('attendanceRecords') || '[]'
  );

  const myRecords = records.filter((r) => r.studentId === user?.id);

  const getSession = (sessionId: string) => {
    return sessions.find((s) => s.id === sessionId);
  };

  // Calculate stats
  const presentCount = myRecords.filter((r) => r.status === 'present').length;
  const absentCount = myRecords.filter((r) => r.status === 'absent').length;
  const totalRecords = myRecords.length;
  const attendancePercentage = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0;

  // Group records by subject
  const recordsBySubject = myRecords.reduce((acc, record) => {
    const session = getSession(record.sessionId);
    if (session) {
      if (!acc[session.subject]) {
        acc[session.subject] = { present: 0, total: 0 };
      }
      acc[session.subject].total++;
      if (record.status === 'present') {
        acc[session.subject].present++;
      }
    }
    return acc;
  }, {} as Record<string, { present: number; total: number }>);

  // Get recent 7 days attendance
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const dailyAttendance = last7Days.map(date => {
    const dayRecords = myRecords.filter(r => {
      const session = getSession(r.sessionId);
      return session?.date === date;
    });
    return {
      date,
      present: dayRecords.filter(r => r.status === 'present').length,
      absent: dayRecords.filter(r => r.status === 'absent').length,
    };
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold">My Records</h1>
          <p className="text-muted-foreground mt-1">View your attendance history and performance</p>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-success/30 bg-success/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Present</p>
                  <p className="text-3xl font-bold text-success">{presentCount}</p>
                </div>
                <CheckCircle className="h-10 w-10 text-success/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Absent</p>
                  <p className="text-3xl font-bold text-destructive">{absentCount}</p>
                </div>
                <XCircle className="h-10 w-10 text-destructive/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                  <p className="text-3xl font-bold">{totalRecords}</p>
                </div>
                <Calendar className="h-10 w-10 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Attendance %</p>
                  <p className="text-3xl font-bold text-primary">{attendancePercentage}%</p>
                </div>
                <TrendingUp className="h-10 w-10 text-primary/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Attendance Progress
            </CardTitle>
            <CardDescription>Your overall attendance percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">{attendancePercentage}%</span>
                <span className="text-sm text-muted-foreground">Target: 75%</span>
              </div>
              <Progress value={attendancePercentage} className="h-4" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0%</span>
                <span className={attendancePercentage >= 75 ? 'text-success' : 'text-warning'}>
                  {attendancePercentage >= 75 ? 'Above target!' : 'Below target'}
                </span>
                <span>100%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject-wise Attendance */}
        {Object.keys(recordsBySubject).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Subject-wise Attendance
              </CardTitle>
              <CardDescription>Your attendance breakdown by subject</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(recordsBySubject).map(([subject, data]) => {
                  const percentage = Math.round((data.present / data.total) * 100);
                  return (
                    <div key={subject} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{subject}</span>
                        <span className="text-sm text-muted-foreground">
                          {data.present}/{data.total} ({percentage}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Weekly Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Last 7 Days
            </CardTitle>
            <CardDescription>Your attendance over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {dailyAttendance.map((day) => {
                const hasRecords = day.present > 0 || day.absent > 0;
                const allPresent = hasRecords && day.absent === 0;
                const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
                
                return (
                  <div 
                    key={day.date} 
                    className={`p-3 rounded-lg text-center ${
                      !hasRecords ? 'bg-muted' :
                      allPresent ? 'bg-success/10 border border-success/20' :
                      'bg-destructive/10 border border-destructive/20'
                    }`}
                  >
                    <p className="text-xs text-muted-foreground">{dayName}</p>
                    <p className="text-sm font-medium mt-1">
                      {day.date.split('-')[2]}
                    </p>
                    {hasRecords && (
                      <div className="mt-1">
                        {allPresent ? (
                          <CheckCircle className="h-4 w-4 text-success mx-auto" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive mx-auto" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Records List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Attendance History
            </CardTitle>
            <CardDescription>Detailed list of all your attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myRecords.length === 0 ? (
                <div className="py-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No records yet</h3>
                  <p className="text-muted-foreground">
                    Your attendance records will appear here
                  </p>
                </div>
              ) : (
                myRecords.map((record) => {
                  const session = getSession(record.sessionId);
                  return (
                    <div key={record.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4">
                        {record.status === 'present' ? (
                          <div className="p-2 rounded-full bg-success/10">
                            <CheckCircle className="h-5 w-5 text-success" />
                          </div>
                        ) : (
                          <div className="p-2 rounded-full bg-destructive/10">
                            <XCircle className="h-5 w-5 text-destructive" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">
                            {session?.subject || 'Unknown Subject'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {session?.className} {session?.division && `- ${session.division}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant="outline"
                          className={
                            record.status === 'present'
                              ? 'bg-success/10 text-success border-success/20'
                              : 'bg-destructive/10 text-destructive border-destructive/20'
                          }
                        >
                          {record.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(record.markedAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(record.markedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Achievement Card */}
        {attendancePercentage >= 90 && (
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-amber-500/20">
                  <Award className="h-8 w-8 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Excellent Attendance!</h3>
                  <p className="text-sm text-muted-foreground">
                    Congratulations! You've maintained above 90% attendance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
