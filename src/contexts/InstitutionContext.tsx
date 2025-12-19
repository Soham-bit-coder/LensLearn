import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Institution, Class, Student } from '@/types';

interface InstitutionContextType {
  institution: Institution | null;
  setInstitution: (inst: Institution) => void;
  classes: Class[];
  setClasses: React.Dispatch<React.SetStateAction<Class[]>>;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  addClass: (cls: Omit<Class, 'id'>) => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
}

const InstitutionContext = createContext<InstitutionContextType | undefined>(undefined);

// Initial mock data
const initialClasses: Class[] = [
  { id: '1', name: 'Class 10', division: 'A', institutionId: '1' },
  { id: '2', name: 'Class 10', division: 'B', institutionId: '1' },
  { id: '3', name: 'Class 11', division: 'A', institutionId: '1' },
  { id: '4', name: 'Class 12', division: 'A', institutionId: '1' },
];

const initialStudents: Student[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@school.edu', phone: '9876543210', rollNumber: '001', classId: '1', className: 'Class 10', division: 'A', enrollmentDate: '2024-06-01', status: 'active', riskLevel: 'low', attendancePercentage: 92, averageScore: 85 },
  { id: '2', name: 'Bob Smith', email: 'bob@school.edu', phone: '9876543211', rollNumber: '002', classId: '1', className: 'Class 10', division: 'A', enrollmentDate: '2024-06-01', status: 'active', riskLevel: 'medium', attendancePercentage: 75, averageScore: 68 },
  { id: '3', name: 'Charlie Brown', email: 'charlie@school.edu', phone: '9876543212', rollNumber: '003', classId: '2', className: 'Class 10', division: 'B', enrollmentDate: '2024-06-01', status: 'active', riskLevel: 'high', attendancePercentage: 58, averageScore: 45 },
  { id: '4', name: 'Diana Ross', email: 'diana@school.edu', phone: '9876543213', rollNumber: '004', classId: '3', className: 'Class 11', division: 'A', enrollmentDate: '2024-06-01', status: 'active', riskLevel: 'low', attendancePercentage: 95, averageScore: 91 },
  { id: '5', name: 'Edward King', email: 'edward@school.edu', phone: '9876543214', rollNumber: '005', classId: '4', className: 'Class 12', division: 'A', enrollmentDate: '2024-06-01', status: 'active', riskLevel: 'medium', attendancePercentage: 78, averageScore: 72 },
];

export function InstitutionProvider({ children }: { children: ReactNode }) {
  const [institution, setInstitution] = useState<Institution | null>(() => {
    const saved = localStorage.getItem('institution');
    return saved ? JSON.parse(saved) : { id: '1', name: 'Demo School', type: 'school' };
  });
  
  const [classes, setClasses] = useState<Class[]>(() => {
    const saved = localStorage.getItem('classes');
    return saved ? JSON.parse(saved) : initialClasses;
  });
  
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const saveToStorage = (key: string, data: unknown) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const addClass = (cls: Omit<Class, 'id'>) => {
    const newClass = { ...cls, id: Date.now().toString() };
    setClasses(prev => {
      const updated = [...prev, newClass];
      saveToStorage('classes', updated);
      return updated;
    });
  };

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = { ...student, id: Date.now().toString() };
    setStudents(prev => {
      const updated = [...prev, newStudent];
      saveToStorage('students', updated);
      return updated;
    });
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, ...updates } : s);
      saveToStorage('students', updated);
      return updated;
    });
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => {
      const updated = prev.filter(s => s.id !== id);
      saveToStorage('students', updated);
      return updated;
    });
  };

  const handleSetInstitution = (inst: Institution) => {
    setInstitution(inst);
    saveToStorage('institution', inst);
  };

  return (
    <InstitutionContext.Provider value={{
      institution,
      setInstitution: handleSetInstitution,
      classes,
      setClasses,
      students,
      setStudents,
      addClass,
      addStudent,
      updateStudent,
      deleteStudent,
    }}>
      {children}
    </InstitutionContext.Provider>
  );
}

export function useInstitution() {
  const context = useContext(InstitutionContext);
  if (context === undefined) {
    throw new Error('useInstitution must be used within an InstitutionProvider');
  }
  return context;
}
