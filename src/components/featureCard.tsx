import { ReactNode } from "react";
import { cn } from "@/src/lib/utils";
import { ArrowRight } from "lucide-react";

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
        "group relative glass-card p-8 rounded-3xl border border-gray-200/50 bg-white/80 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 animate-slide-up overflow-hidden",
        className
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Gradient Background on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
      
      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Icon Container */}
      <div className="relative w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl text-primary mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
        <div className="relative group-hover:text-blue-600 transition-colors">
          {icon}
        </div>
      </div>
      
      {/* Content */}
      <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        {description}
      </p>
      
      {/* CTA Link */}
      {cta && (
        <a 
          href={cta.href}
          className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all duration-300 group/link"
        >
          <span>{cta.text}</span>
          <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
        </a>
      )}
      
      {/* Bottom Border Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
    </div>
  );
};

export default FeatureCard;