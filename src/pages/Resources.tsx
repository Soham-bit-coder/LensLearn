import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Download, Eye, Search, BookOpen, Calendar, User, Star, Clock, TrendingUp, FolderOpen } from 'lucide-react';
import type { StudyNote } from '@/types';
import { format } from 'date-fns';

// Mock available notes for students
const mockNotes: StudyNote[] = [
  {
    id: '1',
    title: 'Introduction to Calculus',
    subject: 'Mathematics',
    description: 'Covers limits, derivatives and basic integration concepts. Essential for understanding advanced mathematics.',
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
    description: 'Complete notes on alkanes, alkenes and alkynes with reactions and mechanisms.',
    fileName: 'hydrocarbons.pdf',
    fileUrl: '#',
    uploadedBy: 'user1',
    uploadedByName: 'Dr. Smith',
    uploadedAt: '2024-01-10T14:00:00Z',
    classId: 'class1',
    className: 'Class 12-A',
  },
  {
    id: '3',
    title: 'Electromagnetic Waves',
    subject: 'Physics',
    description: 'Properties of EM waves, spectrum, and applications in modern technology.',
    fileName: 'em_waves.pdf',
    fileUrl: '#',
    uploadedBy: 'user2',
    uploadedByName: 'Prof. Johnson',
    uploadedAt: '2024-01-08T09:00:00Z',
    classId: 'class1',
    className: 'Class 12-A',
  },
  {
    id: '4',
    title: 'Data Structures - Arrays and Linked Lists',
    subject: 'Computer Science',
    description: 'Fundamental data structures with implementation examples in C++ and Python.',
    fileName: 'ds_arrays.pdf',
    fileUrl: '#',
    uploadedBy: 'user3',
    uploadedByName: 'Mr. Williams',
    uploadedAt: '2024-01-05T11:30:00Z',
    classId: 'class1',
    className: 'Class 12-A',
  },
  {
    id: '5',
    title: 'English Literature - Shakespeare',
    subject: 'English',
    description: 'Analysis of major works including Hamlet, Macbeth, and Romeo & Juliet.',
    fileName: 'shakespeare.pdf',
    fileUrl: '#',
    uploadedBy: 'user4',
    uploadedByName: 'Ms. Davis',
    uploadedAt: '2024-01-03T15:00:00Z',
    classId: 'class1',
    className: 'Class 12-A',
  },
  {
    id: '6',
    title: 'Trigonometry Formulas',
    subject: 'Mathematics',
    description: 'All trigonometric identities, formulas, and solved examples.',
    fileName: 'trigonometry.pdf',
    fileUrl: '#',
    uploadedBy: 'user1',
    uploadedByName: 'Dr. Smith',
    uploadedAt: '2024-01-02T10:00:00Z',
    classId: 'class1',
    className: 'Class 12-A',
  },
];

const subjects = [
  'All Subjects',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'Computer Science',
  'History',
  'Geography',
];

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredNotes = mockNotes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      selectedSubject === 'All Subjects' || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const subjectCounts = mockNotes.reduce((acc, note) => {
    acc[note.subject] = (acc[note.subject] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Recent downloads (mock)
  const recentDownloads = mockNotes.slice(0, 3);

  // Featured resources (mock)
  const featuredResources = mockNotes.filter(n => n.subject === 'Mathematics' || n.subject === 'Physics').slice(0, 2);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Study Resources</h1>
          <p className="mt-1 text-muted-foreground">
            Access study materials uploaded by your teachers
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-primary" />
                Total Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockNotes.length}</div>
              <p className="text-sm text-muted-foreground">study materials available</p>
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
              <div className="text-3xl font-bold">{Object.keys(subjectCounts).length}</div>
              <p className="text-sm text-muted-foreground">different subjects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3</div>
              <p className="text-sm text-muted-foreground">new uploads</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Download className="h-5 w-5 text-primary" />
                Downloads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">24</div>
              <p className="text-sm text-muted-foreground">total downloads</p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Resources */}
        {featuredResources.length > 0 && (
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Featured Resources
              </CardTitle>
              <CardDescription>Recommended study materials for you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {featuredResources.map((note) => (
                  <div key={note.id} className="flex items-start gap-4 p-4 rounded-lg bg-background border">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{note.title}</h4>
                      <p className="text-sm text-muted-foreground">{note.subject} • {note.uploadedByName}</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline" asChild>
                          <a href={note.fileUrl} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </a>
                        </Button>
                        <Button size="sm" asChild>
                          <a href={note.fileUrl} download={note.fileName}>
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subject Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Resources by Subject
            </CardTitle>
            <CardDescription>Distribution of study materials across subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(subjectCounts).map(([subject, count]) => (
                <div key={subject} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{subject}</span>
                    <span className="text-muted-foreground">{count} resources</span>
                  </div>
                  <Progress value={(count / mockNotes.length) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by subject" />
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
          </CardContent>
        </Card>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No resources found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="flex flex-col transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="outline">{note.subject}</Badge>
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="mt-2 line-clamp-2">{note.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {note.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{note.uploadedByName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(note.uploadedAt), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>{note.className}</span>
                    </div>
                  </div>
                </CardContent>
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" asChild>
                      <a href={note.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </a>
                    </Button>
                    <Button className="flex-1" asChild>
                      <a href={note.fileUrl} download={note.fileName}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Recent Downloads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recently Viewed
            </CardTitle>
            <CardDescription>Your recently accessed resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDownloads.map((note) => (
                <div key={note.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{note.title}</p>
                      <p className="text-xs text-muted-foreground">{note.subject} • {note.uploadedByName}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" asChild>
                    <a href={note.fileUrl} download={note.fileName}>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
