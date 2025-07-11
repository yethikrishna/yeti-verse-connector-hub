import { YetiLayout } from "@/components/layout/YetiLayout";
import { Image } from "lucide-react";

const YetiImageStudio = () => {
  return (
    <YetiLayout title="Image Studio" icon={Image}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">🧊 Yeti Image Studio</h1>
          <p className="text-gray-600 mt-2">AI-powered image generation and editing suite</p>
        </div>
        
        <div className="text-center py-12">
          <Image className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Image Studio Coming Soon</h3>
          <p className="text-gray-600">Generate, edit, and enhance images with advanced AI tools.</p>
        </div>
      </div>
    </YetiLayout>
  );
};

export default YetiImageStudio;