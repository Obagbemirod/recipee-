import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { SubscriptionTable } from "@/components/admin/SubscriptionTable";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export default function AdminDashboard() {
  const [subscriptionData, setSubscriptionData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/");
        return;
      }

      // Check if user is admin (you should implement proper admin check)
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      // For now, we'll use a simple check. In production, implement proper admin validation
      if (!profile?.is_admin) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have permission to view this page.",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
      fetchSubscriptionData();
    };

    checkAdminStatus();
  }, [navigate]);

  const fetchSubscriptionData = async () => {
    try {
      const { data: subscriptions, error } = await supabase
        .from("subscriptions")
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .eq("status", "active");

      if (error) throw error;

      const aggregatedData = subscriptions.reduce((acc: any, curr: any) => {
        const plan = curr.plan_id;
        if (!acc[plan]) {
          acc[plan] = {
            name: plan,
            value: 0,
            users: []
          };
        }
        acc[plan].value += 1;
        acc[plan].users.push({
          ...curr,
          user_name: curr.profiles?.full_name,
          user_email: curr.profiles?.email
        });
        return acc;
      }, {});

      setSubscriptionData(Object.values(aggregatedData));
      setIsLoading(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch subscription data",
      });
      setIsLoading(false);
    }
  };

  if (!isAdmin || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {subscriptionData.map((plan) => (
          <Card key={plan.name}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{plan.value}</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Subscription Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subscriptionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {subscriptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Details</CardTitle>
        </CardHeader>
        <CardContent>
          <SubscriptionTable data={subscriptionData} />
        </CardContent>
      </Card>
    </div>
  );
}