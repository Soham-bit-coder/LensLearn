import { useAuth } from '@/contexts/AuthContext';
import { useInstitution } from '@/contexts/InstitutionContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { AttendanceChart } from '@/components/dashboard/AttendanceChart';
import { DepartmentChart } from '@/components/dashboard/DepartmentChart';
import { RiskDistributionChart } from '@/components/dashboard/RiskDistributionChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, UserCheck, AlertTriangle, TrendingUp, Calendar, Clock, Award, BookOpen, Target, ArrowUp, ArrowDown } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { students, classes } = useInstitution();

  // Calculate stats
  const totalStudents = students.length;
  const presentToday = Math.round(totalStudents * 0.85);
  const atRiskStudents = students.filter(s => s.riskLevel === 'high').length;
  const avgAttendance = Math.round(
    students.reduce((acc, s) => acc + (s.attendancePercentage || 0), 0) / totalStudents
  );

  // Risk distribution
  const lowRisk = students.filter(s => s.riskLevel === 'low').length;
  const mediumRisk = students.filter(s => s.riskLevel === 'medium').length;
  const highRisk = students.filter(s => s.riskLevel === 'high').length;

  // Class-wise attendance data
  const classData = classes.map(c => ({
    name: c.division ? `${c.name} ${c.division}` : c.name,
    attendance: 70 + Math.round(Math.random() * 25),
  }));

  // Top performing students
  const topStudents = [...students]
    .sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0))
    .slice(0, 5);

  // Weekly attendance trend
  const weeklyTrend = [
    { day: 'Mon', attendance: 92 },
    { day: 'Tue', attendance: 88 },
    { day: 'Wed', attendance: 95 },
    { day: 'Thu', attendance: 91 },
    { day: 'Fri', attendance: 87 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.name}! Here's your overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Students"
            value={totalStudents}
            icon={Users}
            variant="primary"
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Present Today"
            value={presentToday}
            icon={UserCheck}
            variant="success"
          />
          <StatCard
            title="At Risk Students"
            value={atRiskStudents}
            icon={AlertTriangle}
            variant="destructive"
          />
          <StatCard
            title="Avg. Attendance"
            value={`${avgAttendance}%`}
            icon={TrendingUp}
            variant="default"
            trend={{ value: 2.5, isPositive: true }}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AttendanceChart present={presentToday} absent={totalStudents - presentToday - 2} late={2} />
          <DepartmentChart data={classData} />
          <RiskDistributionChart lowRisk={lowRisk} mediumRisk={mediumRisk} highRisk={highRisk} />
        </div>

        {/* Weekly Trend & Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Weekly Attendance Trend
              </CardTitle>
              <CardDescription>Daily attendance percentage this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weeklyTrend.map((day) => (
                  <div key={day.day} className="flex items-center gap-4">
                    <span className="w-10 text-sm font-medium">{day.day}</span>
                    <div className="flex-1">
                      <Progress value={day.attendance} className="h-3" />
                    </div>
                    <span className="w-12 text-sm text-right">{day.attendance}%</span>
                    {day.attendance >= 90 ? (
                      <ArrowUp className="h-4 w-4 text-success" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-warning" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quick Stats
              </CardTitle>
              <CardDescription>Overview at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <BookOpen className="h-8 w-8 text-primary mb-2" />
                  <p className="text-2xl font-bold">{classes.length}</p>
                  <p className="text-sm text-muted-foreground">Total Classes</p>
                </div>
                <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                  <Award className="h-8 w-8 text-success mb-2" />
                  <p className="text-2xl font-bold">{lowRisk}</p>
                  <p className="text-sm text-muted-foreground">Top Performers</p>
                </div>
                <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
                  <Clock className="h-8 w-8 text-warning mb-2" />
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-sm text-muted-foreground">Active Sessions</p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <Users className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-2xl font-bold">{Math.round(totalStudents / classes.length)}</p>
                  <p className="text-sm text-muted-foreground">Avg. Class Size</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performers & Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Top Performers
              </CardTitle>
              <CardDescription>Students with highest scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topStudents.map((student, index) => (
                  <div key={student.id} className="flex items-center gap-4">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                      index === 0 ? 'bg-amber-100 text-amber-700' :
                      index === 1 ? 'bg-slate-100 text-slate-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.className}</p>
                    </div>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      {student.averageScore}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest system activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'Attendance marked for Class 10-A', time: '10 minutes ago', type: 'success' },
                  { action: 'New student enrolled: Diana Ross', time: '1 hour ago', type: 'info' },
                  { action: 'Risk alert: 3 students flagged', time: '2 hours ago', type: 'warning' },
                  { action: 'Report exported: Monthly attendance', time: '3 hours ago', type: 'default' },
                  { action: 'Class 12-B attendance completed', time: '4 hours ago', type: 'success' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${
                        item.type === 'success' ? 'bg-success' :
                        item.type === 'warning' ? 'bg-warning' :
                        item.type === 'info' ? 'bg-primary' :
                        'bg-muted-foreground'
                      }`} />
                      <span className="text-sm">{item.action}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
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
