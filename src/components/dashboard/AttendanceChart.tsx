import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface AttendanceChartProps {
  present: number;
  absent: number;
  late: number;
}

export function AttendanceChart({ present, absent, late }: AttendanceChartProps) {
  const data = [
    { name: 'Present', value: present, color: 'hsl(142, 76%, 36%)' },
    { name: 'Absent', value: absent, color: 'hsl(0, 84%, 60%)' },
    { name: 'Late', value: late, color: 'hsl(38, 92%, 50%)' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Today's Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
