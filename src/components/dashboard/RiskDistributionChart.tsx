import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface RiskDistributionProps {
  lowRisk: number;
  mediumRisk: number;
  highRisk: number;
}

export function RiskDistributionChart({ lowRisk, mediumRisk, highRisk }: RiskDistributionProps) {
  const data = [
    { name: 'Low Risk', value: lowRisk, color: 'hsl(142, 76%, 36%)' },
    { name: 'Medium Risk', value: mediumRisk, color: 'hsl(38, 92%, 50%)' },
    { name: 'High Risk', value: highRisk, color: 'hsl(0, 84%, 60%)' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Risk Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
