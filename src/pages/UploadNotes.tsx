import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Trash2, Plus, Download, Eye, BookOpen, Users, TrendingUp, FolderOpen, Clock, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useInstitution } from '@/contexts/InstitutionContext';
import { useAuth } from '@/contexts/AuthContext';
import type { StudyNote } from '@/types';
import { format } from 'date-fns';

// Mock uploaded notes
const mockNotes: StudyNote[] = [
  {
    id: '1',
    title: 'Introduction to Calculus',
    subject: 'Mathematics',
    description: 'Covers limits, derivatives and basic integration concepts',
    fileName: 'calculus_intro.pdf',
    fileUrl: '#',
    uploadedBy: 'user1',
    uploadedByName: 'Dr. Smith',
    uploadedAt: '2024-01-15T10:30:00Z',
    classId: 'class1',
    className: 'Class 12-A',
  },
  {
    id: '2',
    title: 'Organic Chemistry - Hydrocarbons',
    subject: 'Chemistry',
    description: 'Complete notes on alkanes, alkenes and alkynes',
    fileName: 'hydrocarbons.pdf',
    fileUrl: '#',
    uploadedBy: 'user1',
    uploadedByName: 'Dr. Smith',
    uploadedAt: '2024-01-10T14:00:00Z',
    classId: 'class1',
    className: 'Class 12-A',
  },
];

const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'Computer Science',
  'History',
  'Geography',
];

export default function UploadNotes() {
  const { classes, students } = useInstitution();
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState<StudyNote[]>(mockNotes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    classId: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a PDF file only',
          variant: 'destructive',
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !formData.title || !formData.subject || !formData.classId) {
      toast({
        title: 'Missing information',
        description: 'Please fill all required fields and select a file',
        variant: 'destructive',
      });
      return;
    }

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 20;
      });
    }, 200);

    setTimeout(() => {
      const selectedClass = classes.find((c) => c.id === formData.classId);
      const newNote: StudyNote = {
        id: Date.now().toString(),
        title: formData.title,
        subject: formData.subject,
        description: formData.description,
        fileName: selectedFile.name,
        fileUrl: URL.createObjectURL(selectedFile),
        uploadedBy: user?.id || '',
        uploadedByName: user?.name || '',
        uploadedAt: new Date().toISOString(),
        classId: formData.classId,
        className: selectedClass ? `${selectedClass.name}${selectedClass.division ? `-${selectedClass.division}` : ''}` : '',
      };

      setNotes([newNote, ...notes]);
      setIsDialogOpen(false);
      setSelectedFile(null);
      setFormData({ title: '', subject: '', description: '', classId: '' });
      setUploadProgress(0);
      
      toast({
        title: 'Notes uploaded successfully',
        description: 'Students can now access these notes',
      });
    }, 1200);
  };

  const handleDelete = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
    toast({
      title: 'Notes deleted',
      description: 'The notes have been removed',
    });
  };

  // Calculate stats
  const totalDownloads = 156; // Mock data
  const studentsReached = Math.round(students.length * 0.8);
  const subjectCounts = notes.reduce((acc, note) => {
    acc[note.subject] = (acc[note.subject] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Upload Notes</h1>
            <p className="mt-1 text-muted-foreground">
              Share study materials with your students
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Upload New Notes
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Upload Study Notes</DialogTitle>
                <DialogDescription>
                  Upload a PDF file with study materials for your students
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Chapter 5 - Electromagnetic Waves"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => setFormData({ ...formData, subject: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="class">Class *</Label>
                  <Select
                    value={formData.classId}
                    onValueChange={(value) => setFormData({ ...formData, classId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                          {cls.division ? `-${cls.division}` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the content..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="file">PDF File *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                  </div>
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="space-y-2">
                      <Progress value={uploadProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground">Uploading... {uploadProgress}%</p>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpload}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-primary" />
                Total Uploads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{notes.length}</div>
              <p className="text-sm text-muted-foreground">study materials</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FolderOpen className="h-5 w-5 text-primary" />
                Subjects Covered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {new Set(notes.map((n) => n.subject)).size}
              </div>
              <p className="text-sm text-muted-foreground">different subjects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" />
                Students Reached
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{studentsReached}</div>
              <p className="text-sm text-muted-foreground">have accessed notes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Download className="h-5 w-5 text-primary" />
                Total Downloads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalDownloads}</div>
              <p className="text-sm text-muted-foreground">across all notes</p>
            </CardContent>
          </Card>
        </div>

        {/* Subject Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Notes by Subject
            </CardTitle>
            <CardDescription>Distribution of your uploaded materials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(subjectCounts).map(([subject, count]) => (
                <div key={subject} className="p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground">{subject}</p>
                  <p className="text-2xl font-bold">{count}</p>
                  <Progress value={(count / notes.length) * 100} className="h-2 mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Upload Tips */}
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tips for Effective Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">1</div>
                <div>
                  <p className="font-medium">Clear Titles</p>
                  <p className="text-sm text-muted-foreground">Use descriptive titles that students can easily search</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">2</div>
                <div>
                  <p className="font-medium">Detailed Descriptions</p>
                  <p className="text-sm text-muted-foreground">Include topics covered and key concepts</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">3</div>
                <div>
                  <p className="font-medium">Organize by Subject</p>
                  <p className="text-sm text-muted-foreground">Proper categorization helps students find resources</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">4</div>
                <div>
                  <p className="font-medium">Regular Updates</p>
                  <p className="text-sm text-muted-foreground">Keep materials current with the syllabus</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes Table */}
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Notes</CardTitle>
            <CardDescription>Manage your uploaded study materials</CardDescription>
          </CardHeader>
          <CardContent>
            {notes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No notes uploaded yet</h3>
                <p className="text-muted-foreground">
                  Click "Upload New Notes" to add study materials
                </p>
                <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Notes
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead className="hidden md:table-cell">File</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notes.map((note) => (
                    <TableRow key={note.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{note.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{note.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{note.subject}</Badge>
                      </TableCell>
                      <TableCell>{note.className}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-sm text-muted-foreground">{note.fileName}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {format(new Date(note.uploadedAt), 'MMM d, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <a href={note.fileUrl} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(note.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
