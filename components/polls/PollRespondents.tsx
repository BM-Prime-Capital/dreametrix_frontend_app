"use client";

import { useEffect, useState } from "react";
import { getRespondents, getNonRespondents } from "./api";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Mail, Send, UserCheck, UserX, Bell, Download } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type Respondent = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  responseTime?: string;
};

type PollRespondentsProps = {
  pollId: number;
  onBack: () => void;
};

const responseRateColor = (rate: number) => {
  if (rate >= 75) return "bg-emerald-500";
  if (rate >= 50) return "bg-amber-500";
  return "bg-red-500";
};

export default function PollRespondents({ pollId, onBack }: PollRespondentsProps) {
  const [respondents, setRespondents] = useState<Respondent[]>([]);
  const [nonRespondents, setNonRespondents] = useState<Respondent[]>([]);
  const [loading, setLoading] = useState(true);
  const { tenantDomain, accessToken } = useRequestInfo();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [r, nr] = await Promise.all([
          getRespondents(pollId, tenantDomain, accessToken),
          getNonRespondents(pollId, tenantDomain, accessToken)
        ]);
        // Add mock data for demo
        const respondentsWithData = r.map((res: any) => ({
          ...res,
          avatar: `https://i.pravatar.cc/150?u=${res.email}`,
          responseTime: `${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`
        }));
        const nonRespondentsWithData = nr.map((res: any) => ({
          ...res,
          avatar: `https://i.pravatar.cc/150?u=${res.email}`
        }));
        setRespondents(respondentsWithData);
        setNonRespondents(nonRespondentsWithData);
      } catch (error) {
        console.error("Error fetching respondents", error);
      } finally {
        setLoading(false);
      }
    };
    if (pollId && tenantDomain && accessToken) fetchData();
  }, [pollId, tenantDomain, accessToken]);

  const totalParticipants = respondents.length + nonRespondents.length;
  const responseRate = totalParticipants > 0 ? Math.round((respondents.length / totalParticipants) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-blue-600">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-50 p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onBack}
            className="rounded-full border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Participants du sondage</h1>
            <p className="text-blue-600">Analyse des répondants et non-répondants</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
            <Mail className="h-4 w-4 mr-2" />
            Relancer
          </Button>
          <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Taux de réponse</p>
              <h3 className="text-3xl font-bold mt-1">{responseRate}%</h3>
            </div>
            <div className={`p-3 rounded-lg ${responseRateColor(responseRate)} bg-opacity-10`}>
              <UserCheck className={`h-6 w-6 ${responseRateColor(responseRate)}`} />
            </div>
          </div>
          <Progress 
            value={responseRate} 
            className={`mt-4 h-2 bg-gray-100 ${responseRateColor(responseRate)}`}
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Répondants</p>
              <h3 className="text-3xl font-bold mt-1 text-emerald-600">{respondents.length}</h3>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50">
              <UserCheck className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {respondents.length > 0 ? 
              `Dernière réponse: ${respondents[0]?.responseTime || 'N/A'}` : 
              'Aucune réponse encore'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Non-répondants</p>
              <h3 className="text-3xl font-bold mt-1 text-red-600">{nonRespondents.length}</h3>
            </div>
            <div className="p-3 rounded-lg bg-red-50">
              <UserX className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <Button variant="link" className="mt-2 text-blue-600 hover:text-blue-700 p-0 h-auto">
            <Send className="h-4 w-4 mr-2" />
            Envoyer un rappel
          </Button>
        </div>
      </div>

      {/* Participants List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Respondents */}
        <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Badge className="bg-emerald-100 text-emerald-800">
                <UserCheck className="h-4 w-4 mr-2" />
                Répondants ({respondents.length})
              </Badge>
            </h2>
            <Badge variant="outline" className="border-emerald-200 text-emerald-600">
              {responseRate}% de participation
            </Badge>
          </div>
          
          <div className="space-y-4">
            {respondents.length > 0 ? (
              respondents.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 hover:bg-blue-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={s.avatar} />
                      <AvatarFallback>{s.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{s.name}</p>
                      <p className="text-sm text-gray-500">{s.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-blue-200 text-blue-600">
                    {s.responseTime}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <UserX className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                Aucun répondant pour le moment
              </div>
            )}
          </div>
        </div>

        {/* Non-Respondents */}
        <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Badge className="bg-red-100 text-red-800">
                <UserX className="h-4 w-4 mr-2" />
                Non-répondants ({nonRespondents.length})
              </Badge>
            </h2>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
              <Bell className="h-4 w-4 mr-2" />
              Rappeler tous
            </Button>
          </div>
          
          <div className="space-y-4">
            {nonRespondents.length > 0 ? (
              nonRespondents.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 hover:bg-blue-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={s.avatar} />
                      <AvatarFallback>{s.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{s.name}</p>
                      <p className="text-sm text-gray-500">{s.email}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <UserCheck className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                Tous les participants ont répondu !
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}