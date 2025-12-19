import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { AttendanceSession, AttendanceRecord } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function MarkAttendance() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

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

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold">Mark Attendance</h1>
          <p className="text-muted-foreground mt-1">Enter the code provided by your teacher</p>
        </div>

        <Card>
          <CardContent className="pt-6">
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

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              How it works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>1. Your teacher will generate a unique attendance code</p>
            <p>2. Enter the code in the field above</p>
            <p>3. Make sure to enter the code before it expires</p>
            <p>4. You can only mark attendance once per session</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
