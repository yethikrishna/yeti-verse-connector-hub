import { ReactNode } from "react";
import { YetiLayout } from "@/components/layout/YetiLayout";
import { Mic2 } from "lucide-react";

interface YetiVocoderProps {
  userButton?: ReactNode;
}

const YetiVocoder = ({ userButton }: YetiVocoderProps) => {
  return (
    <YetiLayout title="Voice Studio" icon={Mic2} userButton={userButton}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">🧊 Yeti Voice Studio</h1>
          <p className="text-gray-600 mt-2">Advanced voice synthesis and audio processing</p>
        </div>
        
        <div className="text-center py-12">
          <Mic2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Voice Studio Coming Soon</h3>
          <p className="text-gray-600">Create, edit, and enhance audio with AI-powered tools.</p>
        </div>
      </div>
    </YetiLayout>
  );
};

export default YetiVocoder;