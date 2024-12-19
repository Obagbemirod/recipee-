import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface RecipeSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const RecipeSection = ({ title, isOpen, onToggle, children }: RecipeSectionProps) => {
  return (
    <Collapsible>
      <CollapsibleTrigger
        onClick={onToggle}
        className="flex items-center justify-between w-full text-lg font-semibold text-secondary py-2"
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};