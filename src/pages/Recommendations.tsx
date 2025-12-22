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
  Clock,
  Award,
  Brain,
  Calendar,
  CheckCircle,
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

  // Calculate overall progress
  const overallScore = Math.round(mockRecommendations.reduce((acc, r) => acc + r.score, 0) / mockRecommendations.length);

  // Study plan (mock data)
  const studyPlan = [
    { day: 'Monday', subject: 'Mathematics', duration: '2 hours', focus: 'Algebra basics' },
    { day: 'Tuesday', subject: 'Physics', duration: '1.5 hours', focus: 'Mechanics' },
    { day: 'Wednesday', subject: 'Mathematics', duration: '2 hours', focus: 'Geometry' },
    { day: 'Thursday', subject: 'Physics', duration: '1.5 hours', focus: 'Thermodynamics' },
    { day: 'Friday', subject: 'Chemistry', duration: '1 hour', focus: 'Organic reactions' },
  ];

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
        <div className="grid gap-4 md:grid-cols-4">
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

          <Card className="border-success/50 bg-success/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="h-5 w-5 text-success" />
                Overall Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{overallScore}%</div>
              <p className="text-sm text-muted-foreground">average across all subjects</p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Study Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Suggested Study Plan
            </CardTitle>
            <CardDescription>Recommended weekly schedule for improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {studyPlan.map((plan) => (
                <div key={plan.day} className="p-4 rounded-lg border">
                  <p className="font-semibold text-primary">{plan.day}</p>
                  <p className="text-sm font-medium mt-1">{plan.subject}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                    <Clock className="h-3 w-3" />
                    {plan.duration}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Focus: {plan.focus}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Target</p>
                    <p className="text-2xl font-bold text-primary">75%</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="resources">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                    <TabsTrigger value="tips">Study Tips</TabsTrigger>
                    <TabsTrigger value="progress">Progress</TabsTrigger>
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

                  <TabsContent value="progress" className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Score</span>
                        <span className="font-medium">{selectedSubject.score}%</span>
                      </div>
                      <Progress value={selectedSubject.score} className="h-3" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Target Score</span>
                        <span className="font-medium">75%</span>
                      </div>
                      <Progress value={75} className="h-3" />
                    </div>
                    <div className="p-4 rounded-lg bg-muted">
                      <p className="font-medium">Improvement Needed</p>
                      <p className="text-3xl font-bold text-primary">
                        +{Math.max(0, 75 - selectedSubject.score)}%
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedSubject.score >= 75 
                          ? 'Great job! You\'ve already reached the target!'
                          : `Focus on ${selectedSubject.subject} to reach your target score`}
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI-Powered Insights
            </CardTitle>
            <CardDescription>Personalized recommendations based on your performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 rounded-lg border bg-destructive/5 border-destructive/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-5 w-5 text-destructive" />
                  <span className="font-medium">Priority Focus</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Mathematics needs immediate attention. Start with Khan Academy's algebra basics.
                </p>
              </div>
              <div className="p-4 rounded-lg border bg-warning/5 border-warning/20">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-warning" />
                  <span className="font-medium">Study Time</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Allocate at least 2 hours daily for weak subjects. Best time: early morning.
                </p>
              </div>
              <div className="p-4 rounded-lg border bg-success/5 border-success/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="font-medium">Strong Areas</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  English and Computer Science are excellent. Use these strengths to build confidence.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
