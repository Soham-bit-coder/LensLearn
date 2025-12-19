import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useInstitution } from '@/contexts/InstitutionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, FileSpreadsheet, Users, ClipboardCheck, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AttendanceSession, AttendanceRecord } from '@/types';

export default function Reports() {
  const { students, classes } = useInstitution();
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [reportType, setReportType] = useState<string>('attendance');

  const exportStudentReport = () => {
    const filteredStudents =
      selectedClass === 'all'
        ? students
        : students.filter((s) => s.classId === selectedClass);

    const headers = [
      'Roll No',
      'Name',
      'Email',
      'Phone',
      'Class',
      'Division',
      'Status',
      'Attendance %',
      'Average Score',
      'Risk Level',
    ];
    const rows = filteredStudents.map((s) => [
      s.rollNumber,
      s.name,
      s.email,
      s.phone,
      s.className,
      s.division || '-',
      s.status,
      s.attendancePercentage,
      s.averageScore,
      s.riskLevel,
    ]);

    downloadCSV('student_report', headers, rows);
  };

  const exportAttendanceReport = () => {
    const sessions: AttendanceSession[] = JSON.parse(
      localStorage.getItem('attendanceSessions') || '[]'
    );
    const records: AttendanceRecord[] = JSON.parse(
      localStorage.getItem('attendanceRecords') || '[]'
    );

    const filteredSessions =
      selectedClass === 'all'
        ? sessions
        : sessions.filter((s) => s.classId === selectedClass);

    const headers = ['Date', 'Class', 'Subject', 'Faculty', 'Code', 'Status', 'Present Count'];
    const rows = filteredSessions.map((s) => {
      const sessionRecords = records.filter((r) => r.sessionId === s.id);
      return [
        s.date,
        `${s.className}${s.division ? ` - ${s.division}` : ''}`,
        s.subject,
        s.facultyName,
        s.code,
        s.status,
        sessionRecords.filter((r) => r.status === 'present').length,
      ];
    });

    downloadCSV('attendance_report', headers, rows);
  };

  const exportRiskReport = () => {
    const filteredStudents =
      selectedClass === 'all'
        ? students
        : students.filter((s) => s.classId === selectedClass);

    const headers = [
      'Roll No',
      'Name',
      'Class',
      'Attendance %',
      'Academic Score',
      'Risk Level',
      'Recommendation',
    ];
    const rows = filteredStudents.map((s) => {
      let recommendation = 'Continue current approach';
      if ((s.attendancePercentage || 0) < 75) {
        recommendation = 'Improve attendance';
      } else if ((s.averageScore || 0) < 60) {
        recommendation = 'Academic support needed';
      }

      return [
        s.rollNumber,
        s.name,
        `${s.className}${s.division ? ` - ${s.division}` : ''}`,
        s.attendancePercentage,
        s.averageScore,
        s.riskLevel,
        recommendation,
      ];
    });

    downloadCSV('risk_analysis_report', headers, rows);
  };

  const downloadCSV = (filename: string, headers: string[], rows: (string | number | undefined)[][]) => {
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast({ title: 'Report exported successfully' });
  };

  const reports = [
    {
      id: 'students',
      title: 'Student Report',
      description: 'Complete student directory with attendance and performance data',
      icon: Users,
      action: exportStudentReport,
    },
    {
      id: 'attendance',
      title: 'Attendance Report',
      description: 'All attendance sessions with present/absent counts',
      icon: ClipboardCheck,
      action: exportAttendanceReport,
    },
    {
      id: 'risk',
      title: 'Risk Analysis Report',
      description: 'Student risk assessment with recommendations',
      icon: AlertTriangle,
      action: exportRiskReport,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">Export attendance and performance reports</p>
        </div>

        {/* Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium">Filter by Class</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classes.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} {c.division && `- ${c.division}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <report.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                  </div>
                </div>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={report.action} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export to Excel
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Export Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">
                  {selectedClass === 'all'
                    ? students.length
                    : students.filter((s) => s.classId === selectedClass).length}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">Classes</p>
                <p className="text-2xl font-bold">
                  {selectedClass === 'all' ? classes.length : 1}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">At Risk Students</p>
                <p className="text-2xl font-bold text-destructive">
                  {(selectedClass === 'all'
                    ? students
                    : students.filter((s) => s.classId === selectedClass)
                  ).filter((s) => s.riskLevel === 'high').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
