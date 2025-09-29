'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  MessageSquare,
  ThumbsUp,
  BarChart3,
  Calendar,
  Filter
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type MetricCard = {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
};

type TicketTrend = {
  period: string;
  open: number;
  resolved: number;
  satisfaction: number;
};

type AgentPerformance = {
  name: string;
  ticketsResolved: number;
  avgResponseTime: string;
  satisfactionRate: number;
  status: 'online' | 'away' | 'offline';
};

const METRICS: MetricCard[] = [
  {
    title: 'Total Tickets',
    value: '1,247',
    change: '+12%',
    trend: 'up',
    icon: MessageSquare,
  },
  {
    title: 'Avg Response Time',
    value: '2.4h',
    change: '-18%',
    trend: 'down',
  icon: Clock,
  },
  {
    title: 'Resolution Rate',
    value: '94.2%',
    change: '+5%',
    trend: 'up',
    icon: CheckCircle,
  },
  {
    title: 'Customer Satisfaction',
    value: '4.7/5',
    change: '+0.3',
    trend: 'up',
    icon: ThumbsUp,
  },
];

const TICKET_TRENDS: TicketTrend[] = [
  { period: 'Jan', open: 45, resolved: 52, satisfaction: 4.5 },
  { period: 'Feb', open: 38, resolved: 48, satisfaction: 4.6 },
  { period: 'Mar', open: 42, resolved: 45, satisfaction: 4.4 },
  { period: 'Apr', open: 51, resolved: 49, satisfaction: 4.7 },
  { period: 'May', open: 48, resolved: 54, satisfaction: 4.8 },
  { period: 'Jun', open: 35, resolved: 41, satisfaction: 4.9 },
];

const AGENT_PERFORMANCE: AgentPerformance[] = [
  {
    name: 'Sarah Johnson',
    ticketsResolved: 127,
    avgResponseTime: '1.2h',
    satisfactionRate: 4.9,
    status: 'online',
  },
  {
    name: 'Mike Chen',
    ticketsResolved: 98,
    avgResponseTime: '2.1h',
    satisfactionRate: 4.7,
    status: 'online',
  },
  {
    name: 'Lisa Rodriguez',
    ticketsResolved: 89,
    avgResponseTime: '1.8h',
    satisfactionRate: 4.8,
    status: 'away',
  },
  {
    name: 'David Kim',
    ticketsResolved: 76,
    avgResponseTime: '3.2h',
    satisfactionRate: 4.5,
    status: 'offline',
  },
];

const COMMON_ISSUES = [
  { issue: 'Password Reset', count: 45, trend: '+12%' },
  { issue: 'Gradebook Questions', count: 38, trend: '-5%' },
  { issue: 'Class Creation', count: 32, trend: '+8%' },
  { issue: 'Parent Communication', count: 29, trend: '+15%' },
  { issue: 'Assignment Issues', count: 24, trend: '-2%' },
];

export default function SupportDashboard() {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      case 'neutral': return <div className="h-4 w-4" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'neutral': return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Support Analytics</h1>
          <p className="text-muted-foreground">Monitor support performance and trends</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  {getTrendIcon(metric.trend)}
                  <span className={`ml-1 ${getTrendColor(metric.trend)}`}>
                    {metric.change}
                  </span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">Agent Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="issues">Common Issues</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ticket Volume Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Ticket Volume Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {TICKET_TRENDS.map((trend, index) => (
                    <div key={trend.period} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gray-100 rounded-t flex flex-col" style={{ height: '200px' }}>
                        <div 
                          className="bg-blue-500 rounded-t w-full"
                          style={{ 
                            height: `${(trend.resolved / Math.max(...TICKET_TRENDS.map(t => t.resolved))) * 160}px`,
                            marginTop: 'auto'
                          }}
                        />
                        <div 
                          className="bg-orange-400 w-full"
                          style={{ 
                            height: `${(trend.open / Math.max(...TICKET_TRENDS.map(t => t.open))) * 40}px`
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground mt-2">{trend.period}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded" />
                    <span>Resolved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-400 rounded" />
                    <span>Open</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Time Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Response Time Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Under 1 hour</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }} />
                      </div>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">1-4 hours</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '25%' }} />
                      </div>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">4-24 hours</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '8%' }} />
                      </div>
                      <span className="text-sm font-medium">8%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Over 24 hours</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '2%' }} />
                      </div>
                      <span className="text-sm font-medium">2%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {AGENT_PERFORMANCE.map((agent) => (
                  <div key={agent.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {agent.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(agent.status)} rounded-full border-2 border-white`} />
                      </div>
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{agent.status}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-8 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Tickets Resolved</p>
                        <p className="font-semibold">{agent.ticketsResolved}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Response</p>
                        <p className="font-semibold">{agent.avgResponseTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Satisfaction</p>
                        <p className="font-semibold">{agent.satisfactionRate}/5</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Satisfaction Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-end justify-between gap-2">
                  {TICKET_TRENDS.map((trend) => (
                    <div key={trend.period} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-500 rounded-t"
                        style={{ 
                          height: `${(trend.satisfaction / 5) * 160}px`
                        }}
                      />
                      <span className="text-xs text-muted-foreground mt-2">{trend.period}</span>
                      <span className="text-xs font-medium">{trend.satisfaction}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peak Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { hour: '9-10 AM', tickets: 45, percentage: 85 },
                  { hour: '1-2 PM', tickets: 38, percentage: 72 },
                  { hour: '3-4 PM', tickets: 35, percentage: 66 },
                  { hour: '11-12 PM', tickets: 28, percentage: 53 },
                  { hour: '8-9 AM', tickets: 22, percentage: 42 },
                ].map((peak) => (
                  <div key={peak.hour} className="flex items-center justify-between">
                    <span className="text-sm">{peak.hour}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${peak.percentage}%` }} 
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{peak.tickets}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Most Common Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {COMMON_ISSUES.map((issue, index) => (
                  <div key={issue.issue} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <span className="font-medium">{issue.issue}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">
                        {issue.count} tickets
                      </Badge>
                      <span className={`text-sm ${
                        issue.trend.startsWith('+') ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {issue.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}