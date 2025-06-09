"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/libs/utils";

const standards = [
  {
    category: "Mathématiques",
    items: [
      { value: "CCSS.MATH.CONTENT.6.EE.A.1", label: "6.EE.A.1 - Expressions et équations" },
      { value: "CCSS.MATH.CONTENT.7.EE.B.3", label: "7.EE.B.3 - Résolution de problèmes" }
    ]
  },
  {
    category: "Français",
    items: [
      { value: "CCSS.ELA-LITERACY.RL.6.1", label: "RL.6.1 - Compréhension de texte" }
    ]
  }
];

interface StandardsSelectorProps {
  selectedStandards: string[];
  onSelect: (standards: string[]) => void;
}

export default function StandardsSelector({ selectedStandards, onSelect }: StandardsSelectorProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          {selectedStandards.length > 0 
            ? `${selectedStandards.length} standard(s) sélectionné(s)`
            : "Sélectionner des standards"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher un standard..." />
          <CommandEmpty>Aucun standard trouvé.</CommandEmpty>
          {standards.map((group) => (
            <CommandGroup key={group.category} heading={group.category}>
              {group.items.map((standard) => (
                <CommandItem
                  key={standard.value}
                  value={standard.value}
                  onSelect={() => {
                    const newSelection = selectedStandards.includes(standard.value)
                      ? selectedStandards.filter(v => v !== standard.value)
                      : [...selectedStandards, standard.value];
                    onSelect(newSelection);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedStandards.includes(standard.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {standard.label}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </Command>
      </PopoverContent>
    </Popover>
  );
}