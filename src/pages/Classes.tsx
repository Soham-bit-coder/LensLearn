import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useInstitution } from '@/contexts/InstitutionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Users, BookOpen, TrendingUp, AlertTriangle, GraduationCap, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Classes() {
  const { classes, students, addClass } = useInstitution();
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', division: '' });
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClass({
      name: formData.name,
      division: formData.division || undefined,
      institutionId: '1',
    });
    toast({ title: 'Class added successfully' });
    setFormData({ name: '', division: '' });
    setIsAddOpen(false);
  };

  const getStudentCount = (classId: string) => {
    return students.filter((s) => s.classId === classId).length;
  };

  const getClassAttendance = (classId: string) => {
    const classStudents = students.filter((s) => s.classId === classId);
    if (classStudents.length === 0) return 0;
    return Math.round(
      classStudents.reduce((acc, s) => acc + (s.attendancePercentage || 0), 0) / classStudents.length
    );
  };

  const getClassAvgScore = (classId: string) => {
    const classStudents = students.filter((s) => s.classId === classId);
    if (classStudents.length === 0) return 0;
    return Math.round(
      classStudents.reduce((acc, s) => acc + (s.averageScore || 0), 0) / classStudents.length
    );
  };

  const getAtRiskCount = (classId: string) => {
    return students.filter((s) => s.classId === classId && s.riskLevel === 'high').length;
  };

  // Calculate overall stats
  const totalStudents = students.length;
  const avgAttendance = Math.round(students.reduce((acc, s) => acc + (s.attendancePercentage || 0), 0) / students.length);
  const avgScore = Math.round(students.reduce((acc, s) => acc + (s.averageScore || 0), 0) / students.length);
  const totalAtRisk = students.filter(s => s.riskLevel === 'high').length;

  // Get students for selected class
  const selectedClassStudents = selectedClass 
    ? students.filter(s => s.classId === selectedClass) 
    : [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Classes</h1>
            <p className="text-muted-foreground mt-1">Manage classes and divisions</p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Class
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Class</DialogTitle>
                <DialogDescription>Create a new class or division</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="className">Class Name</Label>
                  <Input
                    id="className"
                    placeholder="e.g., Class 10, Grade 12, B.Tech 1st Year"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="division">Division (Optional)</Label>
                  <Input
                    id="division"
                    placeholder="e.g., A, B, Science, Commerce"
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Add Class</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Classes</p>
                  <p className="text-3xl font-bold">{classes.length}</p>
                </div>
                <BookOpen className="h-10 w-10 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold">{totalStudents}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">At Risk Students</p>
                  <p className="text-3xl font-bold text-destructive">{totalAtRisk}</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-destructive/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Classes Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => {
            const attendance = getClassAttendance(cls.id);
            const atRisk = getAtRiskCount(cls.id);
            const avgScoreVal = getClassAvgScore(cls.id);
            
            return (
              <Card 
                key={cls.id} 
                className={`hover:shadow-md transition-shadow cursor-pointer ${selectedClass === cls.id ? 'border-primary' : ''}`}
                onClick={() => setSelectedClass(selectedClass === cls.id ? null : cls.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      {cls.name} {cls.division && <span className="text-muted-foreground">- {cls.division}</span>}
                    </CardTitle>
                    {atRisk > 0 && (
                      <Badge variant="destructive">{atRisk} at risk</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Students
                      </span>
                      <span className="font-semibold">{getStudentCount(cls.id)}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Attendance</span>
                        <span className="font-semibold">{attendance}%</span>
                      </div>
                      <Progress value={attendance} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Avg. Score</span>
                        <span className="font-semibold">{avgScoreVal}%</span>
                      </div>
                      <Progress value={avgScoreVal} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {classes.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No classes yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first class
              </p>
              <Button onClick={() => setIsAddOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Class
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Selected Class Students */}
        {selectedClass && selectedClassStudents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Students in {classes.find(c => c.id === selectedClass)?.name}
              </CardTitle>
              <CardDescription>Click on a class card above to view its students</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Risk Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedClassStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.rollNumber}</TableCell>
                      <TableCell>{student.name}</TableCell>
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
            </CardContent>
          </Card>
        )}

        {/* Class Performance Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Class Performance Comparison
            </CardTitle>
            <CardDescription>Compare performance metrics across all classes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classes.map((cls) => {
                const attendance = getClassAttendance(cls.id);
                const avgScoreVal = getClassAvgScore(cls.id);
                const studentCount = getStudentCount(cls.id);
                
                return (
                  <div key={cls.id} className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <span className="font-medium">
                          {cls.name} {cls.division && `- ${cls.division}`}
                        </span>
                        <Badge variant="outline">{studentCount} students</Badge>
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Attendance</span>
                          <span className="font-medium">{attendance}%</span>
                        </div>
                        <Progress value={attendance} className="h-2" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Avg. Score</span>
                          <span className="font-medium">{avgScoreVal}%</span>
                        </div>
                        <Progress value={avgScoreVal} className="h-2" />
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
