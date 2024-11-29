import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";

interface AllergiesSectionProps {
  form: UseFormReturn<any>;
}

export const AllergiesSection = ({ form }: AllergiesSectionProps) => {
  const [showOther, setShowOther] = useState(false);
  const [otherAllergy, setOtherAllergy] = useState("");

  const allergiesList = [
    { id: "none", label: "None" },
    { id: "nuts", label: "Nuts" },
    { id: "dairy", label: "Dairy" },
    { id: "shellfish", label: "Shellfish" },
    { id: "gluten", label: "Gluten" },
    { id: "soy", label: "Soy" },
    { id: "eggs", label: "Eggs" },
    { id: "fish", label: "Fish" },
  ];

  const handleNoneSelection = (checked: boolean) => {
    if (checked) {
      // If "None" is selected, clear all other selections
      form.setValue("allergies", ["none"]);
      setShowOther(false);
      setOtherAllergy("");
    }
  };

  const handleOtherAllergyChange = (value: string) => {
    setOtherAllergy(value);
    const currentAllergies = form.getValues("allergies") || [];
    const filteredAllergies = currentAllergies.filter((a: string) => !a.startsWith("other:"));
    if (value) {
      form.setValue("allergies", [...filteredAllergies, `other:${value}`]);
    } else {
      form.setValue("allergies", filteredAllergies);
    }
  };

  const handleAllergyChange = (id: string, checked: boolean) => {
    const currentAllergies = form.getValues("allergies") || [];
    
    if (id === "none" && checked) {
      handleNoneSelection(checked);
      return;
    }

    // If selecting any other allergy, remove "none" if it exists
    const allergiesWithoutNone = currentAllergies.filter((a: string) => a !== "none");
    
    const updatedAllergies = checked
      ? [...allergiesWithoutNone, id]
      : allergiesWithoutNone.filter((a: string) => a !== id);
    
    form.setValue("allergies", updatedAllergies);
  };

  return (
    <FormField
      control={form.control}
      name="allergies"
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel>Allergies & Restrictions</FormLabel>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {allergiesList.map((item) => (
              <FormField
                key={item.id}
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(item.id)}
                        onCheckedChange={(checked) => handleAllergyChange(item.id, checked as boolean)}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {item.label}
                    </FormLabel>
                  </FormItem>
                )}
              />
            ))}
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={showOther}
                  onCheckedChange={(checked) => {
                    setShowOther(checked as boolean);
                    if (!checked) {
                      handleOtherAllergyChange("");
                    }
                  }}
                />
              </FormControl>
              <FormLabel className="font-normal">
                Other
              </FormLabel>
            </FormItem>
          </div>
          {showOther && (
            <Input
              className="mt-4"
              placeholder="Enter other allergies"
              value={otherAllergy}
              onChange={(e) => handleOtherAllergyChange(e.target.value)}
            />
          )}
        </FormItem>
      )}
    />
  );
};