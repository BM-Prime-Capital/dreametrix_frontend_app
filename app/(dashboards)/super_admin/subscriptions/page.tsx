"use client";

import { useState } from "react";
//import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  CreditCard,
  Plus,
  Search,
  Frown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Filter,
  School,
  Calendar,
  Clock,
  Check,
  X,
  Save,
  Loader2,
  RefreshCw,
  Zap
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";

type SubscriptionPlan = {
  id: string;
  name: string;
  price: number;
  billingCycle: "monthly" | "annual";
  features: string[];
  mostPopular: boolean;
};

type Subscription = {
  id: string;
  schoolId: string;
  schoolName: string;
  plan: string;
  status: "active" | "pending" | "canceled" | "expired";
  startDate: string;
  endDate: string;
  billingCycle: "monthly" | "annual";
  price: number;
  paymentMethod: string;
  lastPaymentDate: string;
  nextBillingDate: string;
  studentsLimit: number;
  teachersLimit: number;
  storageLimit: string;
};

export default function SubscriptionsPage() {
  //const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"subscriptions" | "plans">("subscriptions");

  // Sample subscription plans data
  const [plans] = useState<SubscriptionPlan[]>([
    {
      id: "1",
      name: "Basic",
      price: 99,
      billingCycle: "monthly",
      features: [
        "Up to 500 students",
        "Up to 20 teachers",
        "Basic reporting",
        "Email support",
        "5GB storage"
      ],
      mostPopular: false
    },
    {
      id: "2",
      name: "Standard",
      price: 199,
      billingCycle: "monthly",
      features: [
        "Up to 1000 students",
        "Up to 50 teachers",
        "Advanced reporting",
        "Priority support",
        "20GB storage",
        "API access"
      ],
      mostPopular: true
    },
    {
      id: "3",
      name: "Premium",
      price: 299,
      billingCycle: "monthly",
      features: [
        "Unlimited students",
        "Unlimited teachers",
        "Advanced analytics",
        "24/7 support",
        "50GB storage",
        "API access",
        "Custom branding"
      ],
      mostPopular: false
    },
    {
      id: "4",
      name: "Enterprise",
      price: 499,
      billingCycle: "monthly",
      features: [
        "Unlimited everything",
        "Dedicated account manager",
        "Custom integrations",
        "On-premise option",
        "100GB storage",
        "SLA 99.9%"
      ],
      mostPopular: false
    }
  ]);

  // Sample subscriptions data
  const [subscriptions] = useState<Subscription[]>([
    {
      id: "1",
      schoolId: "1",
      schoolName: "Central Elementary School",
      plan: "Standard",
      status: "active",
      startDate: "2023-01-15",
      endDate: "2024-01-15",
      billingCycle: "annual",
      price: 1990,
      paymentMethod: "Credit Card (****4242)",
      lastPaymentDate: "2023-01-15",
      nextBillingDate: "2024-01-15",
      studentsLimit: 1000,
      teachersLimit: 50,
      storageLimit: "20GB"
    },
    {
      id: "2",
      schoolId: "2",
      schoolName: "Sunnyvale High School",
      plan: "Premium",
      status: "active",
      startDate: "2023-03-10",
      endDate: "2023-12-10",
      billingCycle: "monthly",
      price: 299,
      paymentMethod: "Bank Transfer",
      lastPaymentDate: "2023-11-10",
      nextBillingDate: "2023-12-10",
      studentsLimit: 5000,
      teachersLimit: 200,
      storageLimit: "50GB"
    },
    {
      id: "3",
      schoolId: "3",
      schoolName: "Riverside Middle School",
      plan: "Basic",
      status: "pending",
      startDate: "2023-11-01",
      endDate: "2024-11-01",
      billingCycle: "annual",
      price: 990,
      paymentMethod: "Credit Card (****1881)",
      lastPaymentDate: "2023-11-01",
      nextBillingDate: "2024-11-01",
      studentsLimit: 500,
      teachersLimit: 20,
      storageLimit: "5GB"
    },
    {
      id: "4",
      schoolId: "4",
      schoolName: "Westwood Academy",
      plan: "Enterprise",
      status: "active",
      startDate: "2022-09-01",
      endDate: "2023-09-01",
      billingCycle: "annual",
      price: 4990,
      paymentMethod: "Bank Transfer",
      lastPaymentDate: "2022-09-01",
      nextBillingDate: "2023-09-01",
      studentsLimit: 10000,
      teachersLimit: 500,
      storageLimit: "100GB"
    },
    {
      id: "5",
      schoolId: "5",
      schoolName: "Pinecrest Elementary",
      plan: "Standard",
      status: "canceled",
      startDate: "2022-07-15",
      endDate: "2023-07-15",
      billingCycle: "annual",
      price: 1990,
      paymentMethod: "Credit Card (****5555)",
      lastPaymentDate: "2022-07-15",
      nextBillingDate: "2023-07-15",
      studentsLimit: 1000,
      teachersLimit: 50,
      storageLimit: "20GB"
    }
  ]);

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.plan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsPlanModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubscriptionModalOpen(false);
      setSelectedSubscription(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRenewSubscription = async (id: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Renewed subscription:", id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async (id: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Canceled subscription:", id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Subscriptions Management</h1>
          <p className="text-sm text-gray-500">
            Manage all subscriptions and plans in your system
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={() => setActiveTab(activeTab === "subscriptions" ? "plans" : "subscriptions")}
            className="gap-2"
          >
            {activeTab === "subscriptions" ? (
              <>
                <CreditCard className="h-4 w-4" />
                View Plans
              </>
            ) : (
              <>
                <School className="h-4 w-4" />
                View Subscriptions
              </>
            )}
          </Button>
          <Button
            className="gap-2"
            onClick={() => {
              if (activeTab === "subscriptions") {
                setSelectedSubscription(null);
                setIsSubscriptionModalOpen(true);
              } else {
                setIsPlanModalOpen(true);
              }
            }}
          >
            <Plus className="h-4 w-4" />
            {activeTab === "subscriptions" ? "Add Subscription" : "Create Plan"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${activeTab === "subscriptions" ? "border-b-2 border-primary text-primary" : "text-gray-500"}`}
          onClick={() => setActiveTab("subscriptions")}
        >
          <CreditCard className="h-4 w-4" />
          Subscriptions ({subscriptions.length})
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${activeTab === "plans" ? "border-b-2 border-primary text-primary" : "text-gray-500"}`}
          onClick={() => setActiveTab("plans")}
        >
          <Zap className="h-4 w-4" />
          Plans ({plans.length})
        </button>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder={`Search ${activeTab === "subscriptions" ? "subscriptions by school or plan" : "plans by name"}`}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </Card>

      {activeTab === "subscriptions" ? (
        <>
          {/* Subscriptions List */}
          {filteredSubscriptions.length > 0 ? (
            <div className="space-y-4">
              {filteredSubscriptions.map((subscription) => (
                <Card key={subscription.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{subscription.schoolName}</h3>
                        <Badge
                          variant={
                            subscription.status === "active"
                              ? "default"
                              : subscription.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-gray-500" />
                          <span>{subscription.plan} Plan</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>
                            {new Date(subscription.startDate).toLocaleDateString()} -{" "}
                            {new Date(subscription.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>
                            {subscription.billingCycle === "annual" ? "Annual" : "Monthly"} • ${subscription.price}
                            {subscription.billingCycle === "annual" ? "/year" : "/month"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSubscription(subscription);
                          setIsSubscriptionModalOpen(true);
                        }}
                      >
                        Details
                      </Button>
                      {subscription.status === "active" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelSubscription(subscription.id)}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <X className="h-4 w-4 mr-2" />
                          )}
                          Cancel
                        </Button>
                      )}
                      {subscription.status !== "active" && (
                        <Button
                          size="sm"
                          onClick={() => handleRenewSubscription(subscription.id)}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4 mr-2" />
                          )}
                          Renew
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 flex flex-col items-center justify-center gap-4">
              <Frown className="h-12 w-12 text-gray-400" />
              <h3 className="font-medium text-lg">No subscriptions found</h3>
              <p className="text-sm text-gray-500 max-w-md text-center">
                No subscriptions match your search criteria. Try adjusting your search or filters.
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            </Card>
          )}

          {/* Pagination */}
          {filteredSubscriptions.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <Button variant="outline" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="text-sm text-gray-500">
                Page 1 of 1
              </div>
              <Button variant="outline" className="gap-2">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Plans List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`p-6 hover:shadow-md transition-shadow ${plan.mostPopular ? "border-2 border-primary" : ""}`}
              >
                <div className="flex flex-col h-full">
                  {plan.mostPopular && (
                    <div className="text-xs font-medium bg-primary text-primary-foreground px-3 py-1 rounded-full w-fit mb-4">
                      Most Popular
                    </div>
                  )}
                  <h3 className="font-bold text-xl mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-gray-500">/{plan.billingCycle === "annual" ? "year" : "month"}</span>
                  </div>
                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant={plan.mostPopular ? "default" : "outline"}
                      className="w-full"
                      onClick={() => {
                        // Handle plan selection
                      }}
                    >
                      Select Plan
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        // Handle edit
                      }}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Subscription Form Modal */}
      <Modal
        isOpen={isSubscriptionModalOpen}
        onClose={() => {
          setIsSubscriptionModalOpen(false);
          setSelectedSubscription(null);
        }}
        title={selectedSubscription ? "Edit Subscription" : "Create New Subscription"}
        description={
          selectedSubscription 
            ? "Update the subscription details" 
            : "Assign a new subscription to a school"
        }
        size="xl"
      >
        <form onSubmit={handleSubmitSubscription}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* School Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="school">School*</Label>
                  <Input 
                    id="school" 
                    placeholder="Select school" 
                    defaultValue={selectedSubscription?.schoolName || ""} 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="plan">Plan*</Label>
                  <Input 
                    id="plan" 
                    placeholder="Select plan" 
                    defaultValue={selectedSubscription?.plan || ""} 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status*</Label>
                  <Input 
                    id="status" 
                    placeholder="Select status" 
                    defaultValue={selectedSubscription?.status || ""} 
                    required
                  />
                </div>
              </div>

              {/* Billing Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="billingCycle">Billing Cycle*</Label>
                  <Input 
                    id="billingCycle" 
                    placeholder="Select billing cycle" 
                    defaultValue={selectedSubscription?.billingCycle || ""} 
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date*</Label>
                    <Input 
                      id="startDate" 
                      type="date" 
                      defaultValue={selectedSubscription?.startDate || ""} 
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date*</Label>
                    <Input 
                      id="endDate" 
                      type="date" 
                      defaultValue={selectedSubscription?.endDate || ""} 
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price*</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    min="0"
                    step="0.01"
                    placeholder="0.00" 
                    defaultValue={selectedSubscription?.price || ""} 
                    required
                  />
                </div>
              </div>

              {/* Limits */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentsLimit">Students Limit*</Label>
                  <Input 
                    id="studentsLimit" 
                    type="number" 
                    min="0"
                    placeholder="500" 
                    defaultValue={selectedSubscription?.studentsLimit || ""} 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="teachersLimit">Teachers Limit*</Label>
                  <Input 
                    id="teachersLimit" 
                    type="number" 
                    min="0"
                    placeholder="20" 
                    defaultValue={selectedSubscription?.teachersLimit || ""} 
                    required
                  />
                </div>
              </div>

              {/* Payment */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method*</Label>
                  <Input 
                    id="paymentMethod" 
                    placeholder="Credit Card" 
                    defaultValue={selectedSubscription?.paymentMethod || ""} 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastPaymentDate">Last Payment Date</Label>
                  <Input 
                    id="lastPaymentDate" 
                    type="date" 
                    defaultValue={selectedSubscription?.lastPaymentDate || ""} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nextBillingDate">Next Billing Date</Label>
                  <Input 
                    id="nextBillingDate" 
                    type="date" 
                    defaultValue={selectedSubscription?.nextBillingDate || ""} 
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => {
                  setIsSubscriptionModalOpen(false);
                  setSelectedSubscription(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : selectedSubscription ? (
                  <Save className="h-4 w-4 mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {selectedSubscription ? "Update Subscription" : "Create Subscription"}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Plan Form Modal */}
      <Modal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        title="Create New Plan"
        description="Define a new subscription plan for schools"
        size="lg"
      >
        <form onSubmit={handleSubmitPlan}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="planName">Plan Name*</Label>
                  <Input 
                    id="planName" 
                    placeholder="Basic, Premium, etc." 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="billingCycle">Billing Cycle*</Label>
                  <Input 
                    id="billingCycle" 
                    placeholder="Monthly or Annual" 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price*</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    min="0"
                    step="0.01"
                    placeholder="0.00" 
                    required
                  />
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 md:col-span-2">
                <Label>Features*</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input placeholder="Feature description" />
                    <Button variant="outline" type="button">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="border rounded-lg p-2 min-h-[100px]">
                    <p className="text-sm text-gray-500">Added features will appear here</p>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="mostPopular" />
                  <Label htmlFor="mostPopular">Mark as Most Popular</Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => setIsPlanModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Create Plan
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}