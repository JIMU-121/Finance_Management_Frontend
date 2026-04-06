import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "rectangle" | "circle" | "text";
}

const Skeleton: React.FC<SkeletonProps> = ({ className = "", variant = "rectangle" }) => {
  const baseClasses = "animate-pulse bg-gray-200 dark:bg-gray-700";
  const variantClasses = {
    rectangle: "rounded-lg",
    circle: "rounded-full text-transparent",
    text: "rounded h-4 w-full text-transparent",
  };

  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />;
};

export default Skeleton;
