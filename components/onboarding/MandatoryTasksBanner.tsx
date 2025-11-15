"use client";

import React, { useState } from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  X,
  Play
} from 'lucide-react';
import Link from 'next/link';

interface MandatoryTasksBannerProps {
  className?: string;
}

export function MandatoryTasksBanner({ className = "" }: MandatoryTasksBannerProps) {
  const { 
    state, 
    isLoading, 
    getRemainingTasks, 
    getProgressPercentage,
    startTour 
  } = useOnboarding();
  
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isLoading || !state || state.hasCompletedOnboarding || isDismissed) {
    return null;
  }

  const remainingTasks = getRemainingTasks();
  const progressPercentage = getProgressPercentage();

  if (remainingTasks.length === 0) {
    return null;
  }

  const handleStartTour = () => {
    startTour();
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4" />;
      case 'medium':
        return <Clock className="h-4 w-4" />;
      case 'low':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card className={`bg-blue-50 border-blue-200 shadow-sm ${className}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">
                Complete Your Setup
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {state.completedTasks.length} of {state.tasks.length} tasks completed
              </span>
              <div className="w-24">
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartTour}
              className="text-blue-600 border-blue-300 hover:bg-blue-100"
            >
              <Play className="h-4 w-4 mr-1" />
              Take Tour
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-3">
            <div className="text-sm text-gray-600 mb-3">
              Complete these tasks to get the most out of your dashboard:
            </div>
            
            <div className="space-y-2">
              {remainingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1 rounded-full ${getPriorityColor(task.priority)}`}>
                      {getPriorityIcon(task.priority)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{task.title}</div>
                      <div className="text-sm text-gray-500">{task.description}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {task.action.type === 'navigate' && task.action.target ? (
                      <Link href={task.action.target}>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {task.action.label}
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        {task.action.label}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-blue-200">
              <div className="text-xs text-gray-500">
                You can dismiss this banner, but tasks will remain available in your dashboard.
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDismiss}
                  className="text-gray-600 border-gray-300"
                >
                  Dismiss
                </Button>
                <Button
                  size="sm"
                  onClick={handleStartTour}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Start Guided Tour
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
