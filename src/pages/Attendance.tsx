import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useInstitution } from '@/contexts/InstitutionContext';
import { AttendanceSession, AttendanceRecord } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Plus, Clock, Copy, Download, QrCode, CheckCircle, XCircle } from 'lucide-react';
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

        {/* Active Sessions */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sessions
            .filter((s) => s.status === 'active')
            .map((session) => (
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
            ))}
        </div>

        {/* All Sessions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Session History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead className="hidden sm:table-cell">Subject</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{session.date}</TableCell>
                    <TableCell>
                      {session.className} {session.division && `- ${session.division}`}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{session.subject}</TableCell>
                    <TableCell className="font-mono">{session.code}</TableCell>
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
