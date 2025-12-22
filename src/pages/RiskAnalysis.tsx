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
import { AlertTriangle, TrendingDown, Target, Lightbulb, Users, BookOpen, CheckCircle, XCircle, TrendingUp, Brain } from 'lucide-react';
import { useState } from 'react';

export default function RiskAnalysis() {
  const { students, classes } = useInstitution();
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<RiskPrediction | null>(null);

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
  const lowRiskCount = predictions.length - highRiskCount - mediumRiskCount;

  // Calculate average scores by risk level
  const avgAttendanceByRisk = {
    high: Math.round(predictions.filter(p => p.overallRisk === 'high').reduce((acc, p) => acc + p.attendanceScore, 0) / (highRiskCount || 1)),
    medium: Math.round(predictions.filter(p => p.overallRisk === 'medium').reduce((acc, p) => acc + p.attendanceScore, 0) / (mediumRiskCount || 1)),
    low: Math.round(predictions.filter(p => p.overallRisk === 'low').reduce((acc, p) => acc + p.attendanceScore, 0) / (lowRiskCount || 1)),
  };

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

  // Common risk factors
  const commonFactors = [
    { factor: 'Low Attendance', count: predictions.filter(p => p.attendanceScore < 75).length, icon: XCircle },
    { factor: 'Below Avg. Academic', count: predictions.filter(p => p.academicScore < 60).length, icon: TrendingDown },
    { factor: 'Low Participation', count: predictions.filter(p => p.participationScore < 60).length, icon: Users },
  ];

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
                  <p className="text-xs text-muted-foreground mt-1">Avg. Attendance: {avgAttendanceByRisk.high}%</p>
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
                  <p className="text-xs text-muted-foreground mt-1">Avg. Attendance: {avgAttendanceByRisk.medium}%</p>
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
                  <p className="text-3xl font-bold text-success">{lowRiskCount}</p>
                  <p className="text-xs text-muted-foreground mt-1">Avg. Attendance: {avgAttendanceByRisk.low}%</p>
                </div>
                <Target className="h-10 w-10 text-success/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Common Risk Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Common Risk Factors
            </CardTitle>
            <CardDescription>Most common factors contributing to student risk</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {commonFactors.map((item) => (
                <div key={item.factor} className="p-4 rounded-lg border">
                  <div className="flex items-center gap-3 mb-2">
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{item.factor}</span>
                  </div>
                  <p className="text-2xl font-bold">{item.count}</p>
                  <p className="text-sm text-muted-foreground">students affected</p>
                  <Progress value={(item.count / students.length) * 100} className="h-2 mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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

        {/* Selected Student Detail */}
        {selectedStudent && (
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedStudent.studentName}</CardTitle>
                  <CardDescription>
                    {selectedStudent.rollNumber} • {selectedStudent.className}
                  </CardDescription>
                </div>
                <Badge variant="outline" className={riskColors[selectedStudent.overallRisk]}>
                  {selectedStudent.overallRisk} risk ({selectedStudent.riskPercentage}%)
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Performance Metrics
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Attendance</span>
                        <span className="font-medium">{selectedStudent.attendanceScore}%</span>
                      </div>
                      <Progress value={selectedStudent.attendanceScore} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Academic</span>
                        <span className="font-medium">{selectedStudent.academicScore}%</span>
                      </div>
                      <Progress value={selectedStudent.academicScore} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Participation</span>
                        <span className="font-medium">{selectedStudent.participationScore}%</span>
                      </div>
                      <Progress value={selectedStudent.participationScore} className="h-2" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Recommendations
                  </h4>
                  <div className="space-y-2">
                    {selectedStudent.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-3 rounded-lg bg-background border">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
                  <TableHead className="hidden lg:table-cell">Participation</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead className="hidden xl:table-cell">Key Factor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPredictions.map((prediction) => (
                  <TableRow 
                    key={prediction.studentId} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedStudent(prediction)}
                  >
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
                    <TableCell className="hidden lg:table-cell">
                      <div className="w-20">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{prediction.participationScore}%</span>
                        </div>
                        <Progress value={prediction.participationScore} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={riskColors[prediction.overallRisk]}>
                        {prediction.overallRisk} ({prediction.riskPercentage}%)
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
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

        {/* Risk Distribution by Class */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Risk Distribution by Class
            </CardTitle>
            <CardDescription>Compare risk levels across different classes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classes.map((cls) => {
                const classStudents = students.filter(s => s.classId === cls.id);
                const classPredictions = predictions.filter(p => {
                  const student = students.find(s => s.id === p.studentId);
                  return student?.classId === cls.id;
                });
                const classHigh = classPredictions.filter(p => p.overallRisk === 'high').length;
                const classMedium = classPredictions.filter(p => p.overallRisk === 'medium').length;
                const classLow = classPredictions.filter(p => p.overallRisk === 'low').length;

                return (
                  <div key={cls.id} className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">
                        {cls.name} {cls.division && `- ${cls.division}`}
                      </span>
                      <span className="text-sm text-muted-foreground">{classStudents.length} students</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 p-2 rounded bg-destructive/10 text-center">
                        <p className="text-lg font-bold text-destructive">{classHigh}</p>
                        <p className="text-xs text-muted-foreground">High</p>
                      </div>
                      <div className="flex-1 p-2 rounded bg-warning/10 text-center">
                        <p className="text-lg font-bold text-warning">{classMedium}</p>
                        <p className="text-xs text-muted-foreground">Medium</p>
                      </div>
                      <div className="flex-1 p-2 rounded bg-success/10 text-center">
                        <p className="text-lg font-bold text-success">{classLow}</p>
                        <p className="text-xs text-muted-foreground">Low</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
