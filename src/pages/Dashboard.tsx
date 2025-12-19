import { useAuth } from '@/contexts/AuthContext';
import { useInstitution } from '@/contexts/InstitutionContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { AttendanceChart } from '@/components/dashboard/AttendanceChart';
import { DepartmentChart } from '@/components/dashboard/DepartmentChart';
import { RiskDistributionChart } from '@/components/dashboard/RiskDistributionChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';

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

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Attendance marked for Class 10-A', time: '10 minutes ago', type: 'success' },
                { action: 'New student enrolled: Diana Ross', time: '1 hour ago', type: 'info' },
                { action: 'Risk alert: 3 students flagged', time: '2 hours ago', type: 'warning' },
                { action: 'Report exported: Monthly attendance', time: '3 hours ago', type: 'default' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm">{item.action}</span>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
