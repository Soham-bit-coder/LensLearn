import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Upload, FileText, Trash2, Plus, Download, Eye } from 'lucide-react';
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
  const { classes } = useInstitution();
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState<StudyNote[]>(mockNotes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
    
    toast({
      title: 'Notes uploaded successfully',
      description: 'Students can now access these notes',
    });
  };

  const handleDelete = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
    toast({
      title: 'Notes deleted',
      description: 'The notes have been removed',
    });
  };

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
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Uploads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{notes.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Subjects Covered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {new Set(notes.map((n) => n.subject)).size}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Classes Served</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {new Set(notes.map((n) => n.classId)).size}
              </div>
            </CardContent>
          </Card>
        </div>

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
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Class</TableHead>
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
                            <p className="text-xs text-muted-foreground">{note.fileName}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{note.subject}</Badge>
                      </TableCell>
                      <TableCell>{note.className}</TableCell>
                      <TableCell>
                        {format(new Date(note.uploadedAt), 'MMM d, yyyy')}
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
