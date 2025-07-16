import { YetiLayout } from "@/components/layout/YetiLayout";
import { BarChart3 } from "lucide-react";
import { useUserButton } from "@/contexts/UserButtonContext";

const YetiAnalytics = () => {
  const userButton = useUserButton();
  return (
    <YetiLayout title="Analytics" icon={BarChart3} userButton={userButton}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">🧊 Yeti Analytics</h1>
          <p className="text-gray-600 mt-2">Monitor your AI performance and usage metrics</p>
        </div>
        
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Analytics Dashboard Coming Soon</h3>
          <p className="text-gray-600">Track your AI usage, performance metrics, and insights.</p>
        </div>
      </div>
    </YetiLayout>
  );
};

export default YetiAnalytics;