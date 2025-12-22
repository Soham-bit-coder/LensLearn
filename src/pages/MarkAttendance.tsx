import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { AttendanceSession, AttendanceRecord } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Clock, Calendar, AlertCircle, History, Target, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function MarkAttendance() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Get records from localStorage
  const records: AttendanceRecord[] = JSON.parse(
    localStorage.getItem('attendanceRecords') || '[]'
  );
  const sessions: AttendanceSession[] = JSON.parse(
    localStorage.getItem('attendanceSessions') || '[]'
  );

  const myRecords = records.filter((r) => r.studentId === user?.id);
  const presentCount = myRecords.filter(r => r.status === 'present').length;
  const totalCount = myRecords.length;
  const attendancePercentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  // Recent attendance records
  const recentRecords = myRecords.slice(-5).reverse();

  // Get active sessions count
  const activeSessions = sessions.filter(s => s.status === 'active').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Get sessions from localStorage
    const sessions: AttendanceSession[] = JSON.parse(
      localStorage.getItem('attendanceSessions') || '[]'
    );

    const session = sessions.find(
      (s) => s.code.toUpperCase() === code.toUpperCase() && s.status === 'active'
    );

    if (!session) {
      setStatus('error');
      setMessage('Invalid or expired code. Please try again.');
      return;
    }

    if (new Date(session.expiresAt) < new Date()) {
      setStatus('error');
      setMessage('This code has expired. Please ask your teacher for a new code.');
      return;
    }

    // Get existing records
    const records: AttendanceRecord[] = JSON.parse(
      localStorage.getItem('attendanceRecords') || '[]'
    );

    // Check if already marked
    const existingRecord = records.find(
      (r) => r.sessionId === session.id && r.studentId === user?.id
    );

    if (existingRecord) {
      setStatus('error');
      setMessage('You have already marked your attendance for this session.');
      return;
    }

    // Create new record
    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      sessionId: session.id,
      studentId: user?.id || '',
      studentName: user?.name || '',
      rollNumber: '001', // In real app, this would come from student profile
      markedAt: new Date().toISOString(),
      status: 'present',
    };

    records.push(newRecord);
    localStorage.setItem('attendanceRecords', JSON.stringify(records));

    setStatus('success');
    setMessage(`Attendance marked for ${session.subject} - ${session.className}`);
    toast({ title: 'Attendance marked successfully!' });
    setCode('');
  };

  const getSession = (sessionId: string) => {
    return sessions.find((s) => s.id === sessionId);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold">Mark Attendance</h1>
          <p className="text-muted-foreground mt-1">Enter the code provided by your teacher</p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Present</p>
                  <p className="text-2xl font-bold text-success">{presentCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                  <p className="text-2xl font-bold">{totalCount}</p>
                </div>
                <Calendar className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Attendance</p>
                  <p className="text-2xl font-bold">{attendancePercentage}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Sessions Alert */}
        {activeSessions > 0 && (
          <Card className="border-success/30 bg-success/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-success/20">
                  <Clock className="h-6 w-6 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-success">{activeSessions} Active Session{activeSessions > 1 ? 's' : ''}</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter the code below to mark your attendance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Code Entry Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Enter Attendance Code
            </CardTitle>
            <CardDescription>Type the 6-character code shared by your teacher</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase());
                    setStatus('idle');
                  }}
                  className="text-center text-2xl font-mono tracking-widest h-16"
                  maxLength={6}
                  required
                />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={code.length !== 6}>
                <CheckCircle className="h-5 w-5 mr-2" />
                Mark Present
              </Button>
            </form>

            {status !== 'idle' && (
              <div
                className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${
                  status === 'success'
                    ? 'bg-success/10 text-success'
                    : 'bg-destructive/10 text-destructive'
                }`}
              >
                {status === 'success' ? (
                  <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                )}
                <p className="text-sm">{message}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attendance Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Your Attendance Progress
            </CardTitle>
            <CardDescription>Keep your attendance above 75% to avoid issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">{attendancePercentage}%</span>
                <Badge 
                  variant="outline" 
                  className={attendancePercentage >= 75 ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}
                >
                  {attendancePercentage >= 75 ? 'Good Standing' : 'Needs Improvement'}
                </Badge>
              </div>
              <Progress value={attendancePercentage} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0%</span>
                <span>Target: 75%</span>
                <span>100%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Records */}
        {recentRecords.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Attendance
              </CardTitle>
              <CardDescription>Your last 5 attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentRecords.map((record) => {
                  const session = getSession(record.sessionId);
                  return (
                    <div key={record.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-success/10">
                          <CheckCircle className="h-4 w-4 text-success" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{session?.subject || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground">{session?.className}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {new Date(record.markedAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(record.markedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* How it works */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              How it works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">1</div>
              <p className="text-sm text-muted-foreground">Your teacher will generate a unique attendance code</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">2</div>
              <p className="text-sm text-muted-foreground">Enter the code in the field above</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">3</div>
              <p className="text-sm text-muted-foreground">Make sure to enter the code before it expires</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">4</div>
              <p className="text-sm text-muted-foreground">You can only mark attendance once per session</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
