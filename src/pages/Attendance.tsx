import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useInstitution } from '@/contexts/InstitutionContext';
import { AttendanceSession, AttendanceRecord } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, Copy, Download, QrCode, CheckCircle, XCircle, Users, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Attendance() {
  const { user } = useAuth();
  const { classes, students } = useInstitution();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<AttendanceSession[]>(() => {
    const saved = localStorage.getItem('attendanceSessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [records, setRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('attendanceRecords');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null);
  const [formData, setFormData] = useState({
    classId: '',
    subject: '',
    duration: '15',
  });

  // Generate random 6-digit code
  const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Check and update expired sessions
  useEffect(() => {
    const interval = setInterval(() => {
      setSessions((prev) => {
        const updated = prev.map((s) => {
          if (s.status === 'active' && new Date(s.expiresAt) < new Date()) {
            return { ...s, status: 'expired' as const };
          }
          return s;
        });
        localStorage.setItem('attendanceSessions', JSON.stringify(updated));
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedClass = classes.find((c) => c.id === formData.classId);
    if (!selectedClass) return;

    const now = new Date();
    const expiresAt = new Date(now.getTime() + parseInt(formData.duration) * 60000);

    const newSession: AttendanceSession = {
      id: Date.now().toString(),
      classId: formData.classId,
      className: selectedClass.name,
      division: selectedClass.division,
      date: now.toISOString().split('T')[0],
      code: generateCode(),
      expiresAt: expiresAt.toISOString(),
      facultyId: user?.id || '',
      facultyName: user?.name || '',
      subject: formData.subject,
      status: 'active',
    };

    setSessions((prev) => {
      const updated = [newSession, ...prev];
      localStorage.setItem('attendanceSessions', JSON.stringify(updated));
      return updated;
    });

    toast({
      title: 'Attendance session created',
      description: `Code: ${newSession.code} (Valid for ${formData.duration} minutes)`,
    });

    setFormData({ classId: '', subject: '', duration: '15' });
    setIsCreateOpen(false);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: 'Code copied to clipboard' });
  };

  const closeSession = (sessionId: string) => {
    setSessions((prev) => {
      const updated = prev.map((s) =>
        s.id === sessionId ? { ...s, status: 'closed' as const } : s
      );
      localStorage.setItem('attendanceSessions', JSON.stringify(updated));
      return updated;
    });
    toast({ title: 'Session closed' });
  };

  const getSessionRecords = (sessionId: string) => {
    return records.filter((r) => r.sessionId === sessionId);
  };

  const exportSessionToExcel = (session: AttendanceSession) => {
    const sessionRecords = getSessionRecords(session.id);
    const classStudents = students.filter((s) => s.classId === session.classId);

    const headers = ['Roll No', 'Name', 'Status', 'Marked At'];
    const rows = classStudents.map((student) => {
      const record = sessionRecords.find((r) => r.studentId === student.id);
      return [
        student.rollNumber,
        student.name,
        record ? record.status : 'absent',
        record ? new Date(record.markedAt).toLocaleTimeString() : '-',
      ];
    });

    const csvContent = [
      `Attendance Report - ${session.className} ${session.division || ''}`,
      `Subject: ${session.subject}`,
      `Date: ${session.date}`,
      `Faculty: ${session.facultyName}`,
      '',
      headers.join(','),
      ...rows.map((r) => r.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${session.className}_${session.date}.csv`;
    a.click();
    toast({ title: 'Attendance exported successfully' });
  };

  const getTimeRemaining = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - new Date().getTime();
    if (diff <= 0) return 'Expired';
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const statusColors = {
    active: 'bg-success/10 text-success border-success/20',
    expired: 'bg-warning/10 text-warning border-warning/20',
    closed: 'bg-muted text-muted-foreground border-muted',
  };

  // Calculate stats
  const activeSessions = sessions.filter(s => s.status === 'active').length;
  const todaySessions = sessions.filter(s => s.date === new Date().toISOString().split('T')[0]).length;
  const totalPresent = records.filter(r => r.status === 'present').length;
  const avgAttendanceRate = sessions.length > 0 
    ? Math.round((totalPresent / (sessions.length * (students.length / classes.length))) * 100) 
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Attendance</h1>
            <p className="text-muted-foreground mt-1">Generate codes and manage attendance sessions</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Attendance Session</DialogTitle>
                <DialogDescription>
                  Generate a time-limited code for students to mark attendance
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateSession} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Select
                    value={formData.classId}
                    onValueChange={(value) => setFormData({ ...formData, classId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} {c.division && `- ${c.division}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Mathematics, Physics"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Code Valid For (minutes)</Label>
                  <Select
                    value={formData.duration}
                    onValueChange={(value) => setFormData({ ...formData, duration: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="submit">Generate Code</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-success/30 bg-success/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                  <p className="text-3xl font-bold text-success">{activeSessions}</p>
                </div>
                <CheckCircle className="h-10 w-10 text-success/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Sessions</p>
                  <p className="text-3xl font-bold">{todaySessions}</p>
                </div>
                <Calendar className="h-10 w-10 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Present</p>
                  <p className="text-3xl font-bold">{totalPresent}</p>
                </div>
                <Users className="h-10 w-10 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                  <p className="text-3xl font-bold">{sessions.length}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-primary/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Sessions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Active Sessions</h2>
          {sessions.filter((s) => s.status === 'active').length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No active sessions</h3>
                <p className="text-muted-foreground mb-4">
                  Create a new session to start taking attendance
                </p>
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Session
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sessions
                .filter((s) => s.status === 'active')
                .map((session) => {
                  const sessionRecords = getSessionRecords(session.id);
                  const classStudentCount = students.filter(s => s.classId === session.classId).length;
                  const presentCount = sessionRecords.filter(r => r.status === 'present').length;
                  const attendancePercent = classStudentCount > 0 ? Math.round((presentCount / classStudentCount) * 100) : 0;
                  
                  return (
                    <Card key={session.id} className="border-success/30 bg-success/5">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {session.className} {session.division && `- ${session.division}`}
                          </CardTitle>
                          <Badge variant="outline" className={statusColors.active}>
                            Active
                          </Badge>
                        </div>
                        <CardDescription>{session.subject}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-4xl font-mono font-bold tracking-wider text-primary">
                              {session.code}
                            </p>
                            <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{getTimeRemaining(session.expiresAt)}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Attendance Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Present</span>
                            <span className="font-medium">{presentCount}/{classStudentCount}</span>
                          </div>
                          <Progress value={attendancePercent} className="h-2" />
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => copyCode(session.code)}>
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => closeSession(session.id)}>
                            <XCircle className="h-4 w-4 mr-1" />
                            Close
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full"
                          onClick={() => exportSessionToExcel(session)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export Attendance
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          )}
        </div>

        {/* Session Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Session Summary</CardTitle>
            <CardDescription>Overview of attendance sessions by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <CheckCircle className="h-8 w-8 text-success mb-2" />
                <p className="text-2xl font-bold">{sessions.filter(s => s.status === 'active').length}</p>
                <p className="text-sm text-muted-foreground">Active Sessions</p>
              </div>
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                <Clock className="h-8 w-8 text-warning mb-2" />
                <p className="text-2xl font-bold">{sessions.filter(s => s.status === 'expired').length}</p>
                <p className="text-sm text-muted-foreground">Expired Sessions</p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <XCircle className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-2xl font-bold">{sessions.filter(s => s.status === 'closed').length}</p>
                <p className="text-sm text-muted-foreground">Closed Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All Sessions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Session History</CardTitle>
            <CardDescription>All attendance sessions with details</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead className="hidden sm:table-cell">Subject</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead className="hidden md:table-cell">Attendance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => {
                  const sessionRecords = getSessionRecords(session.id);
                  const classStudentCount = students.filter(s => s.classId === session.classId).length;
                  const presentCount = sessionRecords.filter(r => r.status === 'present').length;
                  
                  return (
                    <TableRow key={session.id}>
                      <TableCell>{session.date}</TableCell>
                      <TableCell>
                        {session.className} {session.division && `- ${session.division}`}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{session.subject}</TableCell>
                      <TableCell className="font-mono">{session.code}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {presentCount}/{classStudentCount}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[session.status]}>
                          {session.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => exportSessionToExcel(session)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
