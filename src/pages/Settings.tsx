import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useInstitution } from '@/contexts/InstitutionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Building, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { institution, setInstitution } = useInstitution();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: institution?.name || '',
    type: institution?.type || 'school',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInstitution({
      id: institution?.id || '1',
      name: formData.name,
      type: formData.type === 'college' ? 'college' : 'school',
    });
    toast({ title: 'Settings saved successfully' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-display font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your institution details</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Institution Details
            </CardTitle>
            <CardDescription>
              Update your school or college information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Institution Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your school/college name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Institution Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="school">School</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About EduManage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>EduManage is a comprehensive management system designed for schools and colleges.</p>
            <p>Features include:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Student management with full CRUD operations</li>
              <li>Automated attendance with time-limited codes</li>
              <li>ML-based risk prediction for students</li>
              <li>Excel export for all reports</li>
              <li>Role-based access for Admin, Faculty, and Students</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
