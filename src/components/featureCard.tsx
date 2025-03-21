import { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
  delay?: number;
  cta?: {
    text: string;
    href: string;
  };
}

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  className, 
  delay = 0,
  cta 
}: FeatureCardProps) => {
  return (
    <div 
      className={cn(
        "glass-card p-8 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slide-up group",
        className
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-xl text-primary mb-6 group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      
      {cta && (
        <a 
          href={cta.href}
          className="inline-flex items-center text-primary font-medium hover:underline mt-2"
        >
          {cta.text}
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </a>
      )}
    </div>
  );
};

export default FeatureCard;