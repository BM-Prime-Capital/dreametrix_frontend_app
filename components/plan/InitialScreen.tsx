"use client";
import { CalendarX, Layers, NotebookText } from 'lucide-react';
import { PlanView } from './PlanRouter';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const FeatureCard = ({ icon, title, description, onClick }: FeatureCardProps) => (
  <div 
    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center h-full"
    onClick={onClick}
  >
    <div className="bg-blue-50 p-3 rounded-full mb-4 text-blue-600">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

export default function InitialScreen({ navigateTo }: { navigateTo: (view: PlanView) => void }) {
  const features = [
    {
      title: "Scope and Sequence",
      icon: <CalendarX className="w-5 h-5" />,
      description: "Planification annuelle par matière et niveau",
      onClick: () => navigateTo('scope-sequence-view')
    },
    {
      title: "Unit Plans",
      icon: <Layers className="w-5 h-5" />,
      description: "Modules d'enseignement avec objectifs et ressources",
      onClick: () => navigateTo('unit-plan-view')
    },
    {
      title: "Lesson Plans",
      icon: <NotebookText className="w-5 h-5" />,
      description: "Plans de cours détaillés jour par jour",
      onClick: () => navigateTo('lesson-plan-view')
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Planification Pédagogique</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  );
}