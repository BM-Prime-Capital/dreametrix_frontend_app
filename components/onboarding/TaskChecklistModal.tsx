"use client";

import React from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Play,
  X
} from 'lucide-react';
import Link from 'next/link';

interface TaskChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTour: () => void;
}

export function TaskChecklistModal({ isOpen, onClose, onStartTour }: TaskChecklistModalProps) {
  const { 
    state, 
    getRemainingTasks, 
    getCompletedTasks, 
    getProgressPercentage 
  } = useOnboarding();

  if (!state) return null;

  const remainingTasks = getRemainingTasks();
  const completedTasks = getCompletedTasks();
  const progressPercentage = getProgressPercentage();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            Setup Checklist
          </DialogTitle>
          <DialogDescription>
            Complete these tasks to get the most out of your dashboard. 
            You can skip the tour and complete tasks at your own pace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Overview */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">Overall Progress</span>
              <span className="text-sm text-gray-600">
                {completedTasks.length} of {state.tasks.length} completed
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="text-sm text-gray-600 mt-2">
              {progressPercentage}% complete
            </div>
          </div>

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Completed Tasks ({completedTasks.length})
              </h3>
              <div className="space-y-2">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium text-gray-900 line-through">
                          {task.title}
                        </div>
                        <div className="text-sm text-gray-500">{task.description}</div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Completed
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Remaining Tasks */}
          {remainingTasks.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                Remaining Tasks ({remainingTasks.length})
              </h3>
              <div className="space-y-2">
                {remainingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
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
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority} priority
                      </Badge>
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
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              You can complete these tasks at your own pace. 
              The guided tour will help you navigate the platform.
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="text-gray-600 border-gray-300"
              >
                Close
              </Button>
              <Button
                onClick={onStartTour}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Guided Tour
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
