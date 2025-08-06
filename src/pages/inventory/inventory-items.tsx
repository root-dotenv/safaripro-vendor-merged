"use client";
import { useState, useMemo, useEffect, useId } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getFacetedUniqueValues,
  getPaginationRowModel,
  useReactTable,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";
import { toast } from "sonner";
import {
  Columns3Icon,
  EllipsisIcon,
  FilterIcon,
  Loader2,
  Plus,
  Edit,
  Trash2,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { BiPrinter } from "react-icons/bi";
import { Switch } from "@/components/ui/switch";

// Type Definitions
interface InventoryItem {
  id: string;
  name: string;
  description: string | null;
  quantity_instock: number;
  unit: string;
  reorder_level: number;
  quantity_in_reorder: number;
  cost_per_unit: string;
  category: string;
  hotel: string;
  is_active: boolean;
  created_at: string;
}

interface InventoryCategory {
  id: string;
  name: string;
}

interface PaginatedItemsResponse {
  count: number;
  results: InventoryItem[];
}

type ItemFormValues = Omit<InventoryItem, "id" | "created_at" | "hotel">;

// Custom Filter Function for Status
const statusFilterFn: FilterFn<InventoryItem> = (
  row,
  columnId,
  filterValue: string[]
) => {
  if (!filterValue?.length) return true;
  const status = row.getValue(columnId) as boolean;
  const statusString = status ? "Active" : "Inactive";
  return filterValue.includes(statusString);
};

const BASE_URL = import.meta.env.VITE_HOTEL_BASE_URL;
const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;

// API Client and Constants
const apiClient = axios.create({
  baseURL: BASE_URL,
});

const ITEMS_PER_PAGE = 10;

// Main Component
export default function InventoryItems() {
  const queryClient = useQueryClient();
  const id = useId();

  // State Management
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: ITEMS_PER_PAGE,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");

  // Data Fetching for Items
  const {
    data: itemsResponse,
    isLoading: isLoadingItems,
    isError: isItemsError,
    error: itemsError,
    refetch,
    isRefetching,
  } = useQuery<PaginatedItemsResponse>({
    queryKey: [
      "inventoryItems",
      HOTEL_ID,
      pagination.pageIndex + 1,
      pagination.pageSize,
      sorting,
      columnFilters,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        hotel_id: HOTEL_ID,
        page: String(pagination.pageIndex + 1),
        page_size: String(pagination.pageSize),
      });

      if (sorting.length > 0) {
        params.append(
          "ordering",
          `${sorting[0].desc ? "-" : ""}${sorting[0].id}`
        );
      }

      const statusFilter = columnFilters.find((f) => f.id === "is_active")
        ?.value as string[] | undefined;
      if (statusFilter?.length) {
        const isActive = statusFilter.includes("Active");
        params.append("is_active", String(isActive));
      }

      const response = await apiClient.get(`inventory-items/`, { params });
      return response.data;
    },
    keepPreviousData: true,
    enabled: !!HOTEL_ID,
  });

  // Data Fetching for Categories (to populate dropdown)
  const { data: categories, isLoading: isLoadingCategories } = useQuery<{
    results: InventoryCategory[];
  }>({
    queryKey: ["inventoryCategories", HOTEL_ID],
    queryFn: async () => {
      const params = new URLSearchParams({
        hotel: HOTEL_ID,
        page_size: "1000",
      }); // Fetch all categories
      const response = await apiClient.get(`inventory-categories/`, {
        params,
      });
      return response.data;
    },
    enabled: !!HOTEL_ID,
  });

  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories?.results.forEach((cat) => map.set(cat.id, cat.name));
    return map;
  }, [categories]);

  // Data Mutations
  const createItemMutation = useMutation({
    mutationFn: (newItem: ItemFormValues) => {
      const payload = { ...newItem, hotel: HOTEL_ID };
      return apiClient.post("inventory-items/", payload);
    },
    onSuccess: () => {
      toast.success("Item created successfully!");
      queryClient.invalidateQueries({ queryKey: ["inventoryItems"] });
      setIsFormOpen(false);
    },
    onError: (err: any) => {
      toast.error(
        `Failed to create item: ${err.response?.data?.name?.[0] || err.message}`
      );
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({
      id,
      updatedData,
    }: {
      id: string;
      updatedData: Partial<ItemFormValues>;
    }) => {
      return apiClient.patch(`inventory-items/${id}/`, updatedData);
    },
    onSuccess: () => {
      toast.success("Item updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["inventoryItems"] });
      setIsFormOpen(false);
      setSelectedItem(null);
    },
    onError: (err: any) => {
      toast.error(`Failed to update item: ${err.message}`);
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`inventory-items/${id}/`),
    onSuccess: () => {
      toast.success("Item deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["inventoryItems"] });
      setIsDeleteConfirmOpen(false);
      setSelectedItem(null);
    },
    onError: (err: any) => {
      toast.error(`Failed to delete item: ${err.message}`);
    },
  });

  const handleOpenForm = (item: InventoryItem | null = null) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleOpenDeleteConfirm = (item: InventoryItem) => {
    setSelectedItem(item);
    setDeleteConfirmationInput("");
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    selectedRows.forEach((row) => {
      deleteItemMutation.mutate(row.original.id);
    });
    table.resetRowSelection();
  };

  const itemsForCurrentPage = itemsResponse?.results ?? [];
  const totalItemsCount = itemsResponse?.count ?? 0;
  const totalPages = Math.ceil(totalItemsCount / pagination.pageSize);

  const columns = useMemo<ColumnDef<InventoryItem>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="border-[#d6d5d5] border-[1.5px] data-[state=checked]:bg-[#d6d5d5] data-[state=checked]:text-transparent"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="border-[#d6d5d5] border-[1.5px] data-[state=checked]:bg-[#d6d5d5] data-[state=checked]:text-transparent"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: "Item Name",
        cell: ({ row }) => (
          <div className="font-medium">{row.original.name}</div>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => categoryMap.get(row.original.category) || "N/A",
      },
      {
        accessorKey: "quantity_instock",
        header: "Stock",
      },
      {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            className={cn(
              row.original.is_active
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-yellow-100 text-yellow-800 border-yellow-200"
            )}
          >
            {row.original.is_active ? "Active" : "Inactive"}
          </Badge>
        ),
        filterFn: statusFilterFn,
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <RowActions
            onEdit={() => handleOpenForm(row.original)}
            onDelete={() => handleOpenDeleteConfirm(row.original)}
          />
        ),
      },
    ],
    [categoryMap]
  );

  const table = useReactTable({
    data: itemsForCurrentPage,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    state: { sorting, columnFilters, pagination },
    pageCount: totalPages,
  });

  const uniqueStatusValues = useMemo(() => ["Active", "Inactive"], []);
  const selectedStatuses =
    (table.getColumn("is_active")?.getFilterValue() as string[]) ?? [];

  const handleStatusChange = (checked: boolean, value: string) => {
    const currentFilter =
      (table.getColumn("is_active")?.getFilterValue() as string[]) ?? [];
    let newFilter;
    if (checked) {
      newFilter = [...currentFilter, value];
    } else {
      newFilter = currentFilter.filter((v) => v !== value);
    }
    table
      .getColumn("is_active")
      ?.setFilterValue(newFilter.length ? newFilter : undefined);
  };

  if (isItemsError) {
    return (
      <div className="p-6 text-center text-red-600">
        Error: {(itemsError as Error).message}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Inventory Items
            </h2>
            <Badge className="px-4 py-1 rounded-full" variant={"outline"}>
              Total Items:{" "}
              <span className="font-bold text-gray-700 ml-1">
                {totalItemsCount}
              </span>
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => window.print()}>
              <BiPrinter className="mr-1" /> Print
            </Button>
            <Button
              onClick={() => handleOpenForm()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <FilterIcon className="-ms-1 opacity-60" size={16} />
                  Status
                  {selectedStatuses.length > 0 && (
                    <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                      {selectedStatuses.length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto min-w-36 p-3" align="start">
                <div className="space-y-3">
                  <div className="text-muted-foreground text-xs font-medium">
                    Filter by status
                  </div>
                  <div className="space-y-3">
                    {uniqueStatusValues.map((value) => (
                      <div key={value} className="flex items-center gap-2">
                        <Checkbox
                          id={`status-${value}`}
                          checked={selectedStatuses.includes(value)}
                          onCheckedChange={(checked) =>
                            handleStatusChange(!!checked, value)
                          }
                        />
                        <Label
                          htmlFor={`status-${value}`}
                          className="font-normal"
                        >
                          {value}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Columns3Icon className="-ms-1 opacity-60" size={16} /> View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                {table
                  .getAllColumns()
                  .filter((c) => c.getCanHide())
                  .map((c) => (
                    <DropdownMenuCheckboxItem
                      key={c.id}
                      className="capitalize"
                      checked={c.getIsVisible()}
                      onCheckedChange={(v) => c.toggleVisibility(!!v)}
                      onSelect={(e) => e.preventDefault()}
                    >
                      {c.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-3">
            {table.getSelectedRowModel().rows.length > 0 && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Trash2 className="-ms-1 opacity-60" size={16} /> Delete (
                    {table.getSelectedRowModel().rows.length})
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl text-gray-800">
                      Confirm Deletion
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      This will permanently delete{" "}
                      {table.getSelectedRowModel().rows.length} selected items.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      onClick={handleDeleteRows}
                      disabled={deleteItemMutation.isPending}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {deleteItemMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}{" "}
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isRefetching || isLoadingItems}
            >
              <Loader2
                className={cn(
                  "mr-2 h-4 w-4",
                  (isRefetching || isLoadingItems) && "animate-spin"
                )}
              />{" "}
              Refresh
            </Button>
          </div>
        </div>

        <div className="bg-background overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id} className="hover:bg-transparent">
                  {hg.headers.map((h) => (
                    <TableHead key={h.id} className="h-11">
                      {h.isPlaceholder
                        ? null
                        : flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoadingItems ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Loading items...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No items found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="w-full flex items-center justify-end gap-4 mt-4">
          <div className="text-muted-foreground text-sm whitespace-nowrap">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <Pagination className="w-auto">
            <PaginationContent>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronFirstIcon size={16} />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeftIcon size={16} />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronRightIcon size={16} />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronLastIcon size={16} />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      <ItemFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        item={selectedItem}
        categories={categories?.results ?? []}
        isLoadingCategories={isLoadingCategories}
        onSubmit={
          selectedItem
            ? (data) =>
                updateItemMutation.mutate({
                  id: selectedItem.id,
                  updatedData: data,
                })
            : createItemMutation.mutate
        }
        isLoading={createItemMutation.isPending || updateItemMutation.isPending}
      />

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-800">
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              This will permanently delete the item{" "}
              <strong className="text-gray-800">"{selectedItem?.name}"</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <Label
              htmlFor="delete-confirm"
              className="text-sm font-medium text-gray-700"
            >
              Type the item name to confirm:
            </Label>
            <Input
              id="delete-confirm"
              value={deleteConfirmationInput}
              onChange={(e) => setDeleteConfirmationInput(e.target.value)}
              placeholder={selectedItem?.name}
              autoComplete="off"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => {
                if (selectedItem) {
                  deleteItemMutation.mutate(selectedItem.id);
                }
              }}
              disabled={
                deleteConfirmationInput !== selectedItem?.name ||
                deleteItemMutation.isPending
              }
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteItemMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}{" "}
              Delete Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RowActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <EllipsisIcon size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface ItemFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  item: InventoryItem | null;
  categories: InventoryCategory[];
  isLoadingCategories: boolean;
  onSubmit: (data: Partial<ItemFormValues>) => void;
  isLoading: boolean;
}

function ItemFormDialog({
  isOpen,
  onOpenChange,
  item,
  categories,
  isLoadingCategories,
  onSubmit,
  isLoading,
}: ItemFormDialogProps) {
  const [formState, setFormState] = useState<Partial<ItemFormValues>>({});

  useEffect(() => {
    if (isOpen) {
      if (item) {
        setFormState(item);
      } else {
        setFormState({
          is_active: true,
          reorder_level: 0,
          quantity_instock: 0,
          quantity_in_reorder: 0,
        });
      }
    }
  }, [item, isOpen]);

  const handleChange = (field: keyof ItemFormValues, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formState);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {item ? "Edit Inventory Item" : "Create New Inventory Item"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 py-4">
          <div className="col-span-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formState.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="category">Category</Label>
            <Select
              onValueChange={(value) => handleChange("category", value)}
              value={formState.category}
              required
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoadingCategories ? "Loading..." : "Select a category"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={formState.quantity_instock || ""}
              onChange={(e) =>
                handleChange("quantity_instock", parseInt(e.target.value))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              value={formState.unit || ""}
              onChange={(e) => handleChange("unit", e.target.value)}
              placeholder="e.g., pcs, kgs"
              required
            />
          </div>
          <div>
            <Label htmlFor="cost">Cost (TZS)</Label>
            <Input
              id="cost"
              type="number"
              value={formState.cost_per_unit || ""}
              onChange={(e) => handleChange("cost_per_unit", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="reorder">Reorder Level</Label>
            <Input
              id="reorder"
              type="number"
              min="0"
              max="10"
              value={formState.reorder_level || ""}
              onChange={(e) =>
                handleChange("reorder_level", parseInt(e.target.value))
              }
              required
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formState.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
          <div className="col-span-2 flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formState.is_active}
              onCheckedChange={(checked) => handleChange("is_active", checked)}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>
          <DialogFooter className="col-span-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {item ? "Save Changes" : "Create Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
