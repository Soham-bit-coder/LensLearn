import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useInstitution } from '@/contexts/InstitutionContext';
import { RiskPrediction } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertTriangle, TrendingDown, Target, Lightbulb } from 'lucide-react';
import { useState } from 'react';

export default function RiskAnalysis() {
  const { students, classes } = useInstitution();
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [filterClass, setFilterClass] = useState<string>('all');

  // Generate ML-like risk predictions based on student data
  const predictions: RiskPrediction[] = students.map((student) => {
    const attendanceScore = student.attendancePercentage || 0;
    const academicScore = student.averageScore || 0;
    const participationScore = Math.round(50 + Math.random() * 50);

    // Simple risk calculation (in real app, this would be ML-based)
    const riskPercentage = Math.max(
      0,
      Math.min(100, 100 - (attendanceScore * 0.4 + academicScore * 0.4 + participationScore * 0.2))
    );

    let overallRisk: 'low' | 'medium' | 'high';
    if (riskPercentage < 30) overallRisk = 'low';
    else if (riskPercentage < 60) overallRisk = 'medium';
    else overallRisk = 'high';

    const factors: string[] = [];
    const recommendations: string[] = [];

    if (attendanceScore < 75) {
      factors.push('Low attendance rate');
      recommendations.push('Implement attendance improvement plan');
    }
    if (academicScore < 60) {
      factors.push('Below average academic performance');
      recommendations.push('Consider remedial classes or tutoring');
    }
    if (participationScore < 60) {
      factors.push('Limited class participation');
      recommendations.push('Encourage active participation in discussions');
    }

    if (factors.length === 0) {
      factors.push('Student is performing well');
      recommendations.push('Continue current approach');
    }

    return {
      studentId: student.id,
      studentName: student.name,
      rollNumber: student.rollNumber,
      className: `${student.className}${student.division ? ` - ${student.division}` : ''}`,
      attendanceScore,
      academicScore,
      participationScore,
      overallRisk,
      riskPercentage: Math.round(riskPercentage),
      factors,
      recommendations,
    };
  });

  const filteredPredictions = predictions.filter((p) => {
    const matchesRisk = filterRisk === 'all' || p.overallRisk === filterRisk;
    const student = students.find((s) => s.id === p.studentId);
    const matchesClass = filterClass === 'all' || student?.classId === filterClass;
    return matchesRisk && matchesClass;
  });

  const highRiskCount = predictions.filter((p) => p.overallRisk === 'high').length;
  const mediumRiskCount = predictions.filter((p) => p.overallRisk === 'medium').length;

  const riskColors = {
    low: 'bg-success/10 text-success border-success/20',
    medium: 'bg-warning/10 text-warning border-warning/20',
    high: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  const progressColors = {
    low: 'bg-success',
    medium: 'bg-warning',
    high: 'bg-destructive',
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">Risk Analysis</h1>
          <p className="text-muted-foreground mt-1">
            ML-based academic risk predictions for students
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">High Risk</p>
                  <p className="text-3xl font-bold text-destructive">{highRiskCount}</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-destructive/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-warning/30 bg-warning/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Medium Risk</p>
                  <p className="text-3xl font-bold text-warning">{mediumRiskCount}</p>
                </div>
                <TrendingDown className="h-10 w-10 text-warning/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-success/30 bg-success/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Low Risk</p>
                  <p className="text-3xl font-bold text-success">
                    {predictions.length - highRiskCount - mediumRiskCount}
                  </p>
                </div>
                <Target className="h-10 w-10 text-success/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={filterRisk} onValueChange={setFilterRisk}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by class" />
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
          </CardContent>
        </Card>

        {/* Risk Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student Risk Assessment</CardTitle>
            <CardDescription>Click on a student to see detailed recommendations</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead className="hidden sm:table-cell">Class</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead className="hidden md:table-cell">Academic</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead className="hidden lg:table-cell">Key Factor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPredictions.map((prediction) => (
                  <TableRow key={prediction.studentId}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{prediction.studentName}</p>
                        <p className="text-xs text-muted-foreground">{prediction.rollNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{prediction.className}</TableCell>
                    <TableCell>
                      <div className="w-20">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{prediction.attendanceScore}%</span>
                        </div>
                        <Progress value={prediction.attendanceScore} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="w-20">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{prediction.academicScore}%</span>
                        </div>
                        <Progress value={prediction.academicScore} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={riskColors[prediction.overallRisk]}>
                        {prediction.overallRisk} ({prediction.riskPercentage}%)
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Lightbulb className="h-4 w-4" />
                        {prediction.factors[0]}
                      </div>
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
