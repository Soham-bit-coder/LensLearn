export type UserRole = 'admin' | 'faculty' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Institution {
  id: string;
  name: string;
  type: 'school' | 'college';
}

export interface Class {
  id: string;
  name: string;
  division?: string;
  institutionId: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  rollNumber: string;
  classId: string;
  className: string;
  division?: string;
  enrollmentDate: string;
  status: 'active' | 'inactive';
  riskLevel?: 'low' | 'medium' | 'high';
  attendancePercentage?: number;
  averageScore?: number;
}

export interface AttendanceSession {
  id: string;
  classId: string;
  className: string;
  division?: string;
  date: string;
  code: string;
  expiresAt: string;
  facultyId: string;
  facultyName: string;
  subject: string;
  status: 'active' | 'expired' | 'closed';
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  markedAt: string;
  status: 'present' | 'absent' | 'late';
}

export interface RiskPrediction {
  studentId: string;
  studentName: string;
  rollNumber: string;
  className: string;
  attendanceScore: number;
  academicScore: number;
  participationScore: number;
  overallRisk: 'low' | 'medium' | 'high';
  riskPercentage: number;
  factors: string[];
  recommendations: string[];
}

export interface DashboardStats {
  totalStudents: number;
  presentToday: number;
  atRiskStudents: number;
  averageAttendance: number;
}

export interface StudyNote {
  id: string;
  title: string;
  subject: string;
  description: string;
  fileName: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: string;
  classId: string;
  className: string;
}

export interface SubjectRecommendation {
  subject: string;
  score: number;
  status: 'weak' | 'average' | 'strong';
  resources: {
    title: string;
    type: 'video' | 'article' | 'practice' | 'book';
    url: string;
    description: string;
  }[];
  tips: string[];
}
