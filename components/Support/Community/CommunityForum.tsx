'use client';

import { useState, useMemo } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, Users, Clock, CheckCircle, Pin, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ForumPost = {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    role: 'teacher' | 'admin' | 'moderator';
    reputation: number;
  };
  category: string;
  tags: string[];
  replies: number;
  views: number;
  likes: number;
  dislikes: number;
  solved: boolean;
  pinned: boolean;
  created_at: Date;
  last_activity: Date;
};

const CATEGORIES = [
  { id: 'all', name: 'All Topics', icon: MessageSquare },
  { id: 'general', name: 'General', icon: Users },
  { id: 'classes', name: 'Classes', icon: Users },
  { id: 'gradebook', name: 'Gradebook', icon: CheckCircle },
  { id: 'assignments', name: 'Assignments', icon: MessageSquare },
  { id: 'attendance', name: 'Attendance', icon: Clock },
  { id: 'tips', name: 'Tips & Tricks', icon: TrendingUp },
];

const FORUM_POSTS: ForumPost[] = [
  {
    id: '1',
    title: 'Best practices for organizing digital assignments',
    content: 'I\'m looking for advice on how to best organize digital assignments in the platform...',
    author: {
      name: 'Sarah Johnson',
      role: 'teacher',
      reputation: 1250,
    },
    category: 'assignments',
    tags: ['organization', 'digital', 'workflow'],
    replies: 12,
    views: 234,
    likes: 18,
    dislikes: 1,
    solved: true,
    pinned: true,
    created_at: new Date('2024-01-15'),
    last_activity: new Date('2024-01-20'),
  },
  {
    id: '2',
    title: 'How to handle late submissions effectively?',
    content: 'What are your strategies for managing students who consistently submit work late?',
    author: {
      name: 'Mike Chen',
      role: 'teacher',
      reputation: 890,
    },
    category: 'assignments',
    tags: ['late-work', 'policies', 'classroom-management'],
    replies: 8,
    views: 156,
    likes: 15,
    dislikes: 0,
    solved: false,
    pinned: false,
    created_at: new Date('2024-01-18'),
    last_activity: new Date('2024-01-19'),
  },
  {
    id: '3',
    title: 'Gradebook calculation seems off - help needed',
    content: 'I\'m having trouble with weighted grades not calculating correctly...',
    author: {
      name: 'Lisa Rodriguez',
      role: 'teacher',
      reputation: 650,
    },
    category: 'gradebook',
    tags: ['calculations', 'weighted-grades', 'troubleshooting'],
    replies: 5,
    views: 89,
    likes: 7,
    dislikes: 0,
    solved: true,
    pinned: false,
    created_at: new Date('2024-01-17'),
    last_activity: new Date('2024-01-18'),
  },
];

export default function CommunityForum() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'solved'>('recent');

  const filteredPosts = useMemo(() => {
    let posts = FORUM_POSTS.filter(post => {
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });

    // Sort posts
    switch (sortBy) {
      case 'popular':
        posts.sort((a, b) => (b.likes + b.views) - (a.likes + a.views));
        break;
      case 'solved':
        posts.sort((a, b) => Number(b.solved) - Number(a.solved));
        break;
      case 'recent':
      default:
        posts.sort((a, b) => b.last_activity.getTime() - a.last_activity.getTime());
        break;
    }

    // Pinned posts first
    posts.sort((a, b) => Number(b.pinned) - Number(a.pinned));

    return posts;
  }, [selectedCategory, searchQuery, sortBy]);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700';
      case 'moderator': return 'bg-purple-100 text-purple-700';
      case 'teacher': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Community Forum</h1>
          <p className="text-muted-foreground">Share knowledge and get help from fellow educators</p>
        </div>
        <Button>Ask Question</Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {CATEGORIES.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'ghost'}
                    className="w-full justify-start gap-2"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <Icon className="h-4 w-4" />
                    {category.name}
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Forum Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Posts</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Active Users</span>
                <span className="font-medium">89</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Solved Today</span>
                <span className="font-medium">12</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="solved">Solved</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Posts List */}
          <div className="space-y-3">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {post.author.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {post.pinned && <Pin className="h-4 w-4 text-orange-500" />}
                          <h3 className="font-medium hover:text-primary cursor-pointer">
                            {post.title}
                          </h3>
                          {post.solved && (
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Solved
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {post.content}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <span>{post.author.name}</span>
                            <Badge className={`text-xs ${getRoleBadgeColor(post.author.role)}`}>
                              {post.author.role}
                            </Badge>
                            <span>• {post.author.reputation} rep</span>
                          </div>
                          <span>• {formatTimeAgo(post.last_activity)}</span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {post.replies}
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {post.likes}
                          </div>
                          <span>{post.views} views</span>
                        </div>
                      </div>
                      
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No discussions found</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to start a conversation in this category!
              </p>
              <Button>Ask Question</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}