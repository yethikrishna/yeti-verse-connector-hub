import { ReactNode } from "react";
import { YetiLayout } from "@/components/layout/YetiLayout";
import { Users } from "lucide-react";

interface YetiTeamsProps {
  userButton?: ReactNode;
}

const YetiTeams = ({ userButton }: YetiTeamsProps) => {
  return (
    <YetiLayout title="Teams" icon={Users} userButton={userButton}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">🧊 Yeti Teams</h1>
          <p className="text-gray-600 mt-2">Manage your team collaboration and permissions</p>
        </div>
        
        <div className="text-center py-12">
          <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Teams Feature Coming Soon</h3>
          <p className="text-gray-600">Collaborate with your team members on Yeti AI projects.</p>
        </div>
      </div>
    </YetiLayout>
  );
};

export default YetiTeams;