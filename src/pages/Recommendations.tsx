import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Video,
  FileText,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Target,
  BookMarked,
} from 'lucide-react';
import type { SubjectRecommendation } from '@/types';

// Mock data for student's subject performance
const mockRecommendations: SubjectRecommendation[] = [
  {
    subject: 'Mathematics',
    score: 45,
    status: 'weak',
    resources: [
      {
        title: 'Khan Academy - Algebra Basics',
        type: 'video',
        url: 'https://khanacademy.org/math/algebra',
        description: 'Free comprehensive video tutorials on algebra fundamentals',
      },
      {
        title: 'Math is Fun - Practice Problems',
        type: 'practice',
        url: 'https://mathisfun.com/algebra',
        description: 'Interactive practice problems with step-by-step solutions',
      },
      {
        title: 'Professor Leonard YouTube Channel',
        type: 'video',
        url: 'https://youtube.com/professorleonard',
        description: 'In-depth lecture-style math tutorials',
      },
    ],
    tips: [
      'Practice at least 10 problems daily',
      'Focus on understanding concepts rather than memorizing formulas',
      'Review mistakes and understand where you went wrong',
      'Form a study group with classmates',
    ],
  },
  {
    subject: 'Physics',
    score: 52,
    status: 'weak',
    resources: [
      {
        title: 'Physics Classroom',
        type: 'article',
        url: 'https://physicsclassroom.com',
        description: 'Comprehensive physics tutorials with animations',
      },
      {
        title: 'Walter Lewin MIT Lectures',
        type: 'video',
        url: 'https://youtube.com/walterlewin',
        description: 'Legendary MIT physics lectures',
      },
      {
        title: 'HC Verma - Concepts of Physics',
        type: 'book',
        url: '#',
        description: 'Recommended textbook for building strong fundamentals',
      },
    ],
    tips: [
      'Visualize physical phenomena using diagrams',
      'Understand the derivations, not just final formulas',
      'Solve numerical problems after understanding theory',
      'Relate physics concepts to real-world examples',
    ],
  },
  {
    subject: 'Chemistry',
    score: 68,
    status: 'average',
    resources: [
      {
        title: 'Organic Chemistry Tutor',
        type: 'video',
        url: 'https://youtube.com/organicchemistrytutor',
        description: 'Clear explanations of chemistry concepts',
      },
      {
        title: 'ChemLibreTexts',
        type: 'article',
        url: 'https://chem.libretexts.org',
        description: 'Free online chemistry textbook',
      },
    ],
    tips: [
      'Create flashcards for chemical reactions',
      'Practice balancing equations regularly',
      'Use molecular models for understanding structures',
    ],
  },
  {
    subject: 'English',
    score: 82,
    status: 'strong',
    resources: [
      {
        title: 'Grammarly Blog',
        type: 'article',
        url: 'https://grammarly.com/blog',
        description: 'Advanced writing tips and grammar guides',
      },
    ],
    tips: [
      'Continue reading diverse literature',
      'Practice writing essays on various topics',
    ],
  },
  {
    subject: 'Computer Science',
    score: 78,
    status: 'strong',
    resources: [
      {
        title: 'freeCodeCamp',
        type: 'practice',
        url: 'https://freecodecamp.org',
        description: 'Interactive coding challenges and projects',
      },
    ],
    tips: [
      'Build personal projects to apply concepts',
      'Contribute to open source projects',
    ],
  },
];

const getStatusColor = (status: SubjectRecommendation['status']) => {
  switch (status) {
    case 'weak':
      return 'destructive';
    case 'average':
      return 'secondary';
    case 'strong':
      return 'default';
  }
};

const getResourceIcon = (type: string) => {
  switch (type) {
    case 'video':
      return Video;
    case 'article':
      return FileText;
    case 'practice':
      return Target;
    case 'book':
      return BookMarked;
    default:
      return BookOpen;
  }
};

export default function Recommendations() {
  const [selectedSubject, setSelectedSubject] = useState<SubjectRecommendation | null>(
    mockRecommendations.find((r) => r.status === 'weak') || mockRecommendations[0]
  );

  const weakSubjects = mockRecommendations.filter((r) => r.status === 'weak');
  const averageSubjects = mockRecommendations.filter((r) => r.status === 'average');
  const strongSubjects = mockRecommendations.filter((r) => r.status === 'strong');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Study Recommendations
          </h1>
          <p className="mt-1 text-muted-foreground">
            Personalized resources and tips to improve your weak subjects
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingDown className="h-5 w-5 text-destructive" />
                Needs Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{weakSubjects.length}</div>
              <p className="text-sm text-muted-foreground">subjects below 55%</p>
            </CardContent>
          </Card>

          <Card className="border-secondary/50 bg-secondary/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-secondary-foreground" />
                Average Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{averageSubjects.length}</div>
              <p className="text-sm text-muted-foreground">subjects between 55-75%</p>
            </CardContent>
          </Card>

          <Card className="border-primary/50 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                Excellent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{strongSubjects.length}</div>
              <p className="text-sm text-muted-foreground">subjects above 75%</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Subject List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Your Subjects</CardTitle>
              <CardDescription>Click on a subject to see recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockRecommendations.map((rec) => (
                <button
                  key={rec.subject}
                  onClick={() => setSelectedSubject(rec)}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${
                    selectedSubject?.subject === rec.subject
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{rec.subject}</span>
                    <Badge variant={getStatusColor(rec.status)}>{rec.status}</Badge>
                  </div>
                  <div className="mt-2">
                    <Progress value={rec.score} className="h-2" />
                    <span className="text-xs text-muted-foreground">{rec.score}%</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Recommendations Detail */}
          {selectedSubject && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{selectedSubject.subject}</CardTitle>
                    <CardDescription>
                      Current Score: {selectedSubject.score}% •{' '}
                      <Badge variant={getStatusColor(selectedSubject.status)}>
                        {selectedSubject.status}
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="resources">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                    <TabsTrigger value="tips">Study Tips</TabsTrigger>
                  </TabsList>

                  <TabsContent value="resources" className="mt-4 space-y-3">
                    {selectedSubject.resources.map((resource, idx) => {
                      const Icon = getResourceIcon(resource.type);
                      return (
                        <div
                          key={idx}
                          className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{resource.title}</h4>
                            <p className="text-sm text-muted-foreground">{resource.description}</p>
                            <Badge variant="outline" className="mt-2">
                              {resource.type}
                            </Badge>
                          </div>
                          {resource.url !== '#' && (
                            <Button variant="ghost" size="icon" asChild>
                              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </TabsContent>

                  <TabsContent value="tips" className="mt-4 space-y-3">
                    {selectedSubject.tips.map((tip, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-lg border p-4"
                      >
                        <Lightbulb className="h-5 w-5 text-amber-500 shrink-0" />
                        <p>{tip}</p>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
