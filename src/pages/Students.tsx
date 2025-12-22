import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useInstitution } from '@/contexts/InstitutionContext';
import { Student } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Search, Plus, Edit, Trash2, Download, Users, UserCheck, AlertTriangle, TrendingUp, GraduationCap, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Students() {
  const { students, classes, addStudent, updateStudent, deleteStudent } = useInstitution();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rollNumber: '',
    classId: '',
  });

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase());
    const matchesClass = filterClass === 'all' || student.classId === filterClass;
    const matchesRisk = filterRisk === 'all' || student.riskLevel === filterRisk;
    return matchesSearch && matchesClass && matchesRisk;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedClass = classes.find((c) => c.id === formData.classId);

    if (editingStudent) {
      updateStudent(editingStudent.id, {
        ...formData,
        className: selectedClass?.name || '',
        division: selectedClass?.division,
      });
      toast({ title: 'Student updated successfully' });
      setEditingStudent(null);
    } else {
      addStudent({
        ...formData,
        className: selectedClass?.name || '',
        division: selectedClass?.division,
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: 'active',
        riskLevel: 'low',
        attendancePercentage: 100,
        averageScore: 0,
      });
      toast({ title: 'Student added successfully' });
    }

    setFormData({ name: '', email: '', phone: '', rollNumber: '', classId: '' });
    setIsAddOpen(false);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      rollNumber: student.rollNumber,
      classId: student.classId,
    });
    setIsAddOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteStudent(id);
    toast({ title: 'Student deleted successfully' });
  };

  const exportToExcel = () => {
    const headers = ['Roll No', 'Name', 'Email', 'Phone', 'Class', 'Division', 'Status', 'Attendance %'];
    const rows = filteredStudents.map((s) => [
      s.rollNumber,
      s.name,
      s.email,
      s.phone,
      s.className,
      s.division || '-',
      s.status,
      s.attendancePercentage,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
    toast({ title: 'Students exported successfully' });
  };

  const riskColors = {
    low: 'bg-success/10 text-success border-success/20',
    medium: 'bg-warning/10 text-warning border-warning/20',
    high: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  // Calculate stats
  const totalActive = students.filter(s => s.status === 'active').length;
  const avgAttendance = Math.round(students.reduce((acc, s) => acc + (s.attendancePercentage || 0), 0) / students.length);
  const highRiskCount = students.filter(s => s.riskLevel === 'high').length;
  const topPerformers = students.filter(s => (s.averageScore || 0) >= 80).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Students</h1>
            <p className="text-muted-foreground mt-1">Manage student records</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportToExcel}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={isAddOpen} onOpenChange={(open) => {
              setIsAddOpen(open);
              if (!open) {
                setEditingStudent(null);
                setFormData({ name: '', email: '', phone: '', rollNumber: '', classId: '' });
              }
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingStudent ? 'Edit Student' : 'Add New Student'}</DialogTitle>
                  <DialogDescription>
                    {editingStudent ? 'Update student information' : 'Enter the student details below'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rollNumber">Roll Number</Label>
                      <Input
                        id="rollNumber"
                        value={formData.rollNumber}
                        onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
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
                  </div>
                  <DialogFooter>
                    <Button type="submit">{editingStudent ? 'Update' : 'Add'} Student</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold">{students.length}</p>
                </div>
                <Users className="h-10 w-10 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Students</p>
                  <p className="text-3xl font-bold text-success">{totalActive}</p>
                </div>
                <UserCheck className="h-10 w-10 text-success/50" />
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
                <TrendingUp className="h-10 w-10 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">At Risk</p>
                  <p className="text-3xl font-bold text-destructive">{highRiskCount}</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-destructive/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, roll number, or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
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
              <Select value={filterRisk} onValueChange={setFilterRisk}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Student Details Preview */}
        {selectedStudent && (
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{selectedStudent.name}</CardTitle>
                    <CardDescription>Roll No: {selectedStudent.rollNumber}</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(null)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedStudent.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedStudent.phone}</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Attendance</p>
                  <div className="flex items-center gap-2">
                    <Progress value={selectedStudent.attendancePercentage} className="h-2 flex-1" />
                    <span className="text-sm font-medium">{selectedStudent.attendancePercentage}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Academic Score</p>
                  <div className="flex items-center gap-2">
                    <Progress value={selectedStudent.averageScore} className="h-2 flex-1" />
                    <span className="text-sm font-medium">{selectedStudent.averageScore}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student Directory</CardTitle>
            <CardDescription>Click on a row to see more details</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden sm:table-cell">Class</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow 
                    key={student.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <TableCell className="font-medium">{student.rollNumber}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{student.email}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {student.className} {student.division && `- ${student.division}`}
                    </TableCell>
                    <TableCell>{student.attendancePercentage}%</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={riskColors[student.riskLevel || 'low']}>
                        {student.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(student)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(student.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Performance Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Distribution</CardTitle>
            <CardDescription>Overview of student performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <GraduationCap className="h-8 w-8 text-success mb-2" />
                <p className="text-2xl font-bold">{topPerformers}</p>
                <p className="text-sm text-muted-foreground">Top Performers (80%+)</p>
              </div>
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                <TrendingUp className="h-8 w-8 text-warning mb-2" />
                <p className="text-2xl font-bold">{students.filter(s => (s.averageScore || 0) >= 50 && (s.averageScore || 0) < 80).length}</p>
                <p className="text-sm text-muted-foreground">Average (50-79%)</p>
              </div>
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
                <p className="text-2xl font-bold">{students.filter(s => (s.averageScore || 0) < 50).length}</p>
                <p className="text-sm text-muted-foreground">Needs Improvement (&lt;50%)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
