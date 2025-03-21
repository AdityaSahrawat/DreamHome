import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { ReactNode } from "react";

type ActionButtonProps = {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  fullWidth?: boolean;
};

const ActionButton = ({
  variant = "primary",
  size = "default",
  className,
  children,
  href,
  onClick,
  icon,
  fullWidth = false,
}: ActionButtonProps) => {
  const baseClasses = cn(
    "rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow",
    fullWidth && "w-full",
    className
  );

  const content = (
    <>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </>
  );

  if (href) {
    return (
      <a href={href} className="inline-block">
        <Button
          variant={variant === "primary" ? "default" : variant}
          size={size}
          className={baseClasses}
        >
          {content}
        </Button>
      </a>
    );
  }

  return (
    <Button
      variant={variant === "primary" ? "default" : variant}
      size={size}
      onClick={onClick}
      className={baseClasses}
    >
      {content}
    </Button>
  );
};

export default ActionButton;