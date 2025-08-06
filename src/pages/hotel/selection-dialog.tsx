// --- src/components/ui/selection-dialog.tsx ---
"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface Item {
  id: string;
  name: string;
}

interface SelectionDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  items: Item[];
  selectedIds: Set<string>;
  onSelectionChange: (id: string, isSelected: boolean) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function SelectionDialog({
  isOpen,
  onOpenChange,
  title,
  items = [],
  selectedIds,
  onSelectionChange,
  onSave,
  isSaving,
}: SelectionDialogProps) {
  const handleSelectAll = (isChecked: boolean) => {
    items.forEach((item) => onSelectionChange(item.id, isChecked));
  };

  const areAllSelected = items.length > 0 && selectedIds.size === items.length;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center space-x-2 border-b pb-3 mb-3">
            <Checkbox
              id="select-all"
              checked={areAllSelected}
              onCheckedChange={handleSelectAll}
              className="border-[#d6d5d5] border-[1.5px] data-[state=checked]:bg-[#d6d5d5] data-[state=checked]:text-transparent"
            />
            <Label htmlFor="select-all" className="font-bold">
              Select All
            </Label>
          </div>
          <ScrollArea className="h-72">
            <div className="space-y-3 pr-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    className="border-[#d6d5d5] border-[1.5px] data-[state=checked]:bg-[#d6d5d5] data-[state=checked]:text-transparent"
                    id={item.id}
                    checked={selectedIds.has(item.id)}
                    onCheckedChange={(isChecked) =>
                      onSelectionChange(item.id, !!isChecked)
                    }
                  />
                  <Label htmlFor={item.id} className="w-full">
                    {item.name}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
