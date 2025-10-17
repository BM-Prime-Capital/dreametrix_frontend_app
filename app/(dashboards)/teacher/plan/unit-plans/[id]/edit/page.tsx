"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Clock, Target } from 'lucide-react';
import { UnitPlanService } from '@/services/plan-service';
import { localStorageKey } from '@/constants/global';
import type { UnitPlan } from '@/lib/types';

// ✅ Import dynamique de ReactQuill (Next.js safe)
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function UnitPlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // 🔐 Auth & Tenant
  const accessToken: any =
    typeof window !== 'undefined' ? localStorage.getItem(localStorageKey.ACCESS_TOKEN) : null;
  const tenantData: any =
    typeof window !== 'undefined' ? localStorage.getItem(localStorageKey.TENANT_DATA) : null;
  const { primary_domain } = tenantData ? JSON.parse(tenantData) : { primary_domain: '' };
  const tenantPrimaryDomain = `https://${primary_domain}`;

  // 🎯 États
  const [unitPlan, setUnitPlan] = useState<UnitPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // 🧩 États indépendants pour les champs éditables
  const [bigIdea, setBigIdea] = useState('');
  const [essentialQuestions, setEssentialQuestions] = useState('');
  const [learningObjectives, setLearningObjectives] = useState('');
  const [activities, setActivities] = useState('');

  // ⚙️ Chargement du UnitPlan
  useEffect(() => {
    const fetchUnitPlan = async () => {
      try {
        setIsLoading(true);
        const data = await UnitPlanService.get(tenantPrimaryDomain, accessToken, id);
        setUnitPlan(data);
        setBigIdea(data.big_idea || '');
        setEssentialQuestions(data.essential_questions || '');
        setLearningObjectives(data.learning_objectives || '');
        setActivities(data.activities || '');
      } catch (err) {
        console.error('Error loading unit plan:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id && accessToken && tenantPrimaryDomain) fetchUnitPlan();
  }, [id, accessToken, tenantPrimaryDomain]);

  const handleBack = () => router.push('/teacher/plan/unit-plans');
  const handleEdit = () => setIsEditing(!isEditing);

  // 💾 Sauvegarde des modifications
  const handleSave = async () => {
    if (!unitPlan) return;

    const updated = {
      ...unitPlan,
      big_idea: bigIdea,
      essential_questions: essentialQuestions,
      learning_objectives: learningObjectives,
      activities: activities,
    };

    setUnitPlan(updated);

    try {
      await UnitPlanService.update(tenantPrimaryDomain, accessToken, id, updated);
      alert('✅ Changes saved successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving unit plan:', err);
      alert('Failed to save changes.');
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      [{ font: [] }],
      [{ align: [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean'],
    ],
  };

  if (isLoading) return <p className="text-center py-20">Loading...</p>;
  if (!unitPlan) return <p className="text-center text-red-500">No data found</p>;

  return (
    <div className="w-full space-y-8">
      {/* HEADER */}
      <header className="bg-[#3e81d4] px-4 py-3 rounded-md flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Unit Plan Details</h1>
        <div className="flex gap-2">
          <Button onClick={handleBack} variant="outline" className="bg-white/20 text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          {isEditing ? (
            <Button onClick={handleSave} className="bg-green-600 text-white hover:bg-green-700">
              Save
            </Button>
          ) : (
            <Button onClick={handleEdit} variant="secondary">
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          )}
        </div>
      </header>

      {/* TITLE */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{unitPlan.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Badge>{unitPlan.subject_name}</Badge>
            <Badge variant="outline">{unitPlan.grade}</Badge>
            <Clock className="h-4 w-4" /> {unitPlan.duration_weeks} weeks
          </div>
        </CardContent>
      </Card>

      {/* BIG IDEA & QUESTIONS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" /> Central Concepts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Big Idea */}
          <h4 className="font-semibold mb-2">Big Idea</h4>
          {isEditing ? (
            <ReactQuill theme="snow" modules={quillModules} value={bigIdea} onChange={setBigIdea} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: bigIdea || '<p>No content</p>' }} />
          )}

          {/* Essential Questions */}
          <h4 className="font-semibold mt-6 mb-2">Essential Questions</h4>
          {isEditing ? (
            <ReactQuill theme="snow" modules={quillModules} value={essentialQuestions} onChange={setEssentialQuestions} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: essentialQuestions || '<p>No content</p>' }} />
          )}
        </CardContent>
      </Card>

      {/* OBJECTIVES & ACTIVITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Objectives */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Objectives</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <ReactQuill theme="snow" modules={quillModules} value={learningObjectives} onChange={setLearningObjectives} />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: learningObjectives || '<p>No objectives</p>' }} />
            )}
          </CardContent>
        </Card>

        {/* Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Activities & Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <ReactQuill theme="snow" modules={quillModules} value={activities} onChange={setActivities} />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: activities || '<p>No activities</p>' }} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
