import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useInstitution } from '@/contexts/InstitutionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
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
import { Download, FileSpreadsheet, Users, ClipboardCheck, AlertTriangle, TrendingUp, Calendar, BarChart3, PieChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AttendanceSession, AttendanceRecord } from '@/types';

export default function Reports() {
  const { students, classes } = useInstitution();
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('week');

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

  // Calculate filtered stats
  const filteredStudents = selectedClass === 'all' 
    ? students 
    : students.filter(s => s.classId === selectedClass);
  const avgAttendance = Math.round(filteredStudents.reduce((acc, s) => acc + (s.attendancePercentage || 0), 0) / filteredStudents.length);
  const avgScore = Math.round(filteredStudents.reduce((acc, s) => acc + (s.averageScore || 0), 0) / filteredStudents.length);
  const atRiskCount = filteredStudents.filter(s => s.riskLevel === 'high').length;

  // Recent exports (mock data)
  const recentExports = [
    { name: 'student_report_2024-01-15.csv', date: '2024-01-15', type: 'Student Report', size: '45 KB' },
    { name: 'attendance_report_2024-01-14.csv', date: '2024-01-14', type: 'Attendance Report', size: '32 KB' },
    { name: 'risk_analysis_2024-01-13.csv', date: '2024-01-13', type: 'Risk Report', size: '28 KB' },
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
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium">Date Range</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold">{filteredStudents.length}</p>
                </div>
                <Users className="h-10 w-10 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Attendance</p>
                  <p className="text-3xl font-bold">{avgAttendance}%</p>
                </div>
                <TrendingUp className="h-10 w-10 text-success/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Score</p>
                  <p className="text-3xl font-bold">{avgScore}%</p>
                </div>
                <BarChart3 className="h-10 w-10 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">At Risk</p>
                  <p className="text-3xl font-bold text-destructive">{atRiskCount}</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-destructive/50" />
              </div>
            </CardContent>
          </Card>
        </div>

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

        {/* Data Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Data Preview
            </CardTitle>
            <CardDescription>Preview of data that will be exported</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Risk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.slice(0, 5).map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.rollNumber}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.className}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={student.attendancePercentage} className="h-2 w-16" />
                        <span className="text-sm">{student.attendancePercentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={student.averageScore} className="h-2 w-16" />
                        <span className="text-sm">{student.averageScore}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          student.riskLevel === 'high' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                          student.riskLevel === 'medium' ? 'bg-warning/10 text-warning border-warning/20' :
                          'bg-success/10 text-success border-success/20'
                        }
                      >
                        {student.riskLevel}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredStudents.length > 5 && (
              <div className="p-4 text-center text-sm text-muted-foreground border-t">
                Showing 5 of {filteredStudents.length} students. Export to see all data.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Export Summary & Recent Exports */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Export Summary
              </CardTitle>
              <CardDescription>Overview of selected data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{filteredStudents.length}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">Classes</p>
                  <p className="text-2xl font-bold">
                    {selectedClass === 'all' ? classes.length : 1}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">At Risk Students</p>
                  <p className="text-2xl font-bold text-destructive">{atRiskCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Exports
              </CardTitle>
              <CardDescription>Previously exported reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentExports.map((exp, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{exp.type}</p>
                        <p className="text-xs text-muted-foreground">{exp.date}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{exp.size}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
