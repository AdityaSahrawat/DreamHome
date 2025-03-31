// components/CallToAction.tsx
import { Button } from "@/src/components/ui/button";

export const CallToAction = () => {
  return (
    <div className="bg-gray-100 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Can't find what you're looking for?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600">
          Our property experts can help you find the perfect home that meets all your requirements.
        </p>
        <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
          Contact Our Agents
        </Button>
      </div>
    </div>
  );
};