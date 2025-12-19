import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowRight, Users, ClipboardCheck, AlertTriangle, FileSpreadsheet } from 'lucide-react';

export default function Index() {
  const features = [
    {
      icon: Users,
      title: 'Student Management',
      description: 'Add, view, and manage student records with ease',
    },
    {
      icon: ClipboardCheck,
      title: 'Automated Attendance',
      description: 'Generate time-limited codes for quick attendance marking',
    },
    {
      icon: AlertTriangle,
      title: 'Risk Prediction',
      description: 'ML-based academic risk analysis for early intervention',
    },
    {
      icon: FileSpreadsheet,
      title: 'Excel Reports',
      description: 'Export attendance and performance reports instantly',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="font-display text-xl font-bold">EduManage</span>
          </div>
          <Link to="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6">
            Modern{' '}
            <span className="text-primary">Education Management</span>{' '}
            System
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A comprehensive solution for schools and colleges to manage students, track attendance, 
            and predict academic risks with intelligent analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Everything You Need
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl font-display font-bold mb-4">
            Ready to Transform Your Institution?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of schools and colleges already using EduManage 
            to streamline their operations.
          </p>
          <Link to="/login">
            <Button size="lg">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-display font-semibold">EduManage</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 EduManage. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
