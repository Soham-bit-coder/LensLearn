import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AttendanceRecord, AttendanceSession } from '@/types';
import { CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';

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

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold">My Records</h1>
          <p className="text-muted-foreground mt-1">View your attendance history</p>
        </div>

        {/* Summary Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg bg-success/10">
                <p className="text-3xl font-bold text-success">
                  {myRecords.filter((r) => r.status === 'present').length}
                </p>
                <p className="text-sm text-muted-foreground">Present</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-destructive/10">
                <p className="text-3xl font-bold text-destructive">
                  {myRecords.filter((r) => r.status === 'absent').length}
                </p>
                <p className="text-sm text-muted-foreground">Absent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Records List */}
        <div className="space-y-4">
          {myRecords.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No records yet</h3>
                <p className="text-muted-foreground">
                  Your attendance records will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            myRecords.map((record) => {
              const session = getSession(record.sessionId);
              return (
                <Card key={record.id}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
