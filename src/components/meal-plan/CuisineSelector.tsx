import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { COUNTRIES_AND_CUISINES } from "@/data/countriesAndCuisines";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";

interface CuisineSelectorProps {
  form: UseFormReturn<any>;
}

export const CuisineSelector = ({ form }: CuisineSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const filteredCountries = COUNTRIES_AND_CUISINES.filter((country) =>
    country.label.toLowerCase().includes(searchValue.toLowerCase()) ||
    country.cuisine.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <FormField
      control={form.control}
      name="cuisine"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Select Your Cuisine</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {field.value
                    ? COUNTRIES_AND_CUISINES.find(
                        (country) => country.value === field.value
                      )?.label
                    : "Select cuisine..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command shouldFilter={false}>
                <CommandInput 
                  placeholder="Search cuisine..." 
                  value={searchValue}
                  onValueChange={setSearchValue}
                />
                <CommandEmpty>No cuisine found.</CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-auto">
                  {filteredCountries.map((country) => (
                    <CommandItem
                      key={country.value}
                      value={country.value}
                      onSelect={() => {
                        form.setValue("cuisine", country.value);
                        setOpen(false);
                        setSearchValue("");
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.value === country.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {country.label} - {country.cuisine}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};