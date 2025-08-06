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
  type Row,
  type PaginationState,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  ChevronDownIcon,
  ChevronUpIcon,
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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
interface InventoryCategory {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  hotel: string;
}

interface PaginatedCategoriesResponse {
  count: number;
  results: InventoryCategory[];
}

type CategoryFormValues = Omit<
  InventoryCategory,
  "id" | "created_at" | "hotel"
>;

// Custom Filter Function for Status
const statusFilterFn: FilterFn<InventoryCategory> = (
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

// API Client and Constants
const apiClient = axios.create({
  baseURL: BASE_URL,
});
const HOTEL_ID = import.meta.env.VITE_MICROSERVICE_ITEM_ID;
const CATEGORIES_PER_PAGE = 10;

// Main Component
export default function InventoryCategories() {
  const queryClient = useQueryClient();
  const id = useId();

  // State Management
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: CATEGORIES_PER_PAGE,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<InventoryCategory | null>(null);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");

  // Data Fetching
  const {
    data: categoriesResponse,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<PaginatedCategoriesResponse>({
    queryKey: [
      "inventoryCategories",
      HOTEL_ID,
      pagination.pageIndex + 1,
      sorting,
      columnFilters,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        hotel: HOTEL_ID,
        page: String(pagination.pageIndex + 1),
        page_size: String(pagination.pageSize),
      });

      if (sorting.length > 0) {
        const sortKey = sorting[0].id;
        const sortDir = sorting[0].desc ? "-" : "";
        params.append("ordering", `${sortDir}${sortKey}`);
      }

      const statusFilter = columnFilters.find((f) => f.id === "is_active")
        ?.value as string[] | undefined;
      if (statusFilter?.length) {
        // Assuming the API accepts 'true' or 'false' for boolean filtering
        const isActive = statusFilter.includes("Active");
        params.append("is_active", String(isActive));
      }

      const response = await apiClient.get(`inventory-categories/`, {
        params,
      });
      return response.data;
    },
    keepPreviousData: true,
    enabled: !!HOTEL_ID,
  });

  // Data Mutations
  const createCategoryMutation = useMutation({
    mutationFn: (newCategory: CategoryFormValues) => {
      const payload = { ...newCategory, hotel: HOTEL_ID };
      return apiClient.post("inventory-categories/", payload);
    },
    onSuccess: () => {
      toast.success("Category created successfully!");
      queryClient.invalidateQueries({ queryKey: ["inventoryCategories"] });
      setIsFormOpen(false);
    },
    onError: (err: any) => {
      toast.error(
        `Failed to create category: ${
          err.response?.data?.name?.[0] || err.message
        }`
      );
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({
      id,
      updatedData,
    }: {
      id: string;
      updatedData: Partial<CategoryFormValues>;
    }) => {
      return apiClient.patch(`inventory-categories/${id}/`, updatedData);
    },
    onSuccess: () => {
      toast.success("Category updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["inventoryCategories"] });
      setIsFormOpen(false);
      setSelectedCategory(null);
    },
    onError: (err: any) => {
      toast.error(`Failed to update category: ${err.message}`);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => {
      return apiClient.delete(`inventory-categories/${id}/`);
    },
    onSuccess: () => {
      toast.success("Category deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["inventoryCategories"] });
      setIsDeleteConfirmOpen(false);
      setSelectedCategory(null);
    },
    onError: (err: any) => {
      toast.error(`Failed to delete category: ${err.message}`);
    },
  });

  const handleOpenForm = (category: InventoryCategory | null = null) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleOpenDeleteConfirm = (category: InventoryCategory) => {
    setSelectedCategory(category);
    setDeleteConfirmationInput("");
    setIsDeleteConfirmOpen(true);
  };

  const categoriesForCurrentPage = categoriesResponse?.results ?? [];
  const totalCategoriesCount = categoriesResponse?.count ?? 0;
  const totalPages = Math.ceil(totalCategoriesCount / pagination.pageSize);

  // Table Column Definitions
  const columns = useMemo<ColumnDef<InventoryCategory>[]>(
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
        size: 28,
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <div
            className={cn(
              "flex h-full cursor-pointer items-center justify-between gap-2 select-none"
            )}
            onClick={column.getToggleSortingHandler()}
          >
            Category Name
            {{
              asc: <ChevronUpIcon className="shrink-0 opacity-60" size={16} />,
              desc: (
                <ChevronDownIcon className="shrink-0 opacity-60" size={16} />
              ),
            }[column.getIsSorted() as string] ?? null}
          </div>
        ),
        cell: ({ row }) => (
          <div className="font-medium text-gray-800">{row.original.name}</div>
        ),
        size: 150,
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <div className="max-w-xs truncate" title={row.original.description}>
            {row.original.description}
          </div>
        ),
        size: 200,
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
        size: 100,
        filterFn: statusFilterFn,
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => (
          <div
            className={cn(
              "flex h-full cursor-pointer items-center justify-between gap-2 select-none"
            )}
            onClick={column.getToggleSortingHandler()}
          >
            Date Created
            {{
              asc: <ChevronUpIcon className="shrink-0 opacity-60" size={16} />,
              desc: (
                <ChevronDownIcon className="shrink-0 opacity-60" size={16} />
              ),
            }[column.getIsSorted() as string] ?? null}
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-gray-600">
            {format(new Date(row.original.created_at), "PP")}
          </div>
        ),
        size: 120,
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <RowActions
            row={row}
            onEdit={() => handleOpenForm(row.original)}
            onDelete={() => handleOpenDeleteConfirm(row.original)}
          />
        ),
        size: 60,
        enableHiding: false,
      },
    ],
    []
  );

  const table = useReactTable({
    data: categoriesForCurrentPage,
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

  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    selectedRows.forEach((row) => {
      deleteCategoryMutation.mutate(row.original.id);
    });
    table.resetRowSelection();
  };

  if (isError) {
    return (
      <div className="p-6 text-center text-red-600">
        Error: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Inventory Categories
            </h2>
            <Badge className="px-4 py-1 rounded-full" variant={"outline"}>
              Total Categories:{" "}
              <span className="font-bold text-gray-700 ml-1">
                {totalCategoriesCount}
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
              <Plus className="mr-2 h-4 w-4" /> Add Category
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
                      {table.getSelectedRowModel().rows.length} selected
                      categories.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      onClick={handleDeleteRows}
                      disabled={deleteCategoryMutation.isPending}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {deleteCategoryMutation.isPending && (
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
              disabled={isRefetching || isLoading}
            >
              <Loader2
                className={cn(
                  "mr-2 h-4 w-4",
                  (isRefetching || isLoading) && "animate-spin"
                )}
              />{" "}
              Refresh
            </Button>
          </div>
        </div>

        <div className="bg-background overflow-hidden rounded-md border">
          <Table className="table-fixed">
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id} className="hover:bg-transparent">
                  {hg.headers.map((h) => (
                    <TableHead
                      key={h.id}
                      style={{ width: `${h.getSize()}px` }}
                      className="h-11"
                    >
                      {h.isPlaceholder
                        ? null
                        : flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Loading categories...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="last:py-0">
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
                    No categories found.
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

      <CategoryFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        category={selectedCategory}
        onSubmit={
          selectedCategory
            ? (data) =>
                updateCategoryMutation.mutate({
                  id: selectedCategory.id,
                  updatedData: data,
                })
            : createCategoryMutation.mutate
        }
        isLoading={
          createCategoryMutation.isPending || updateCategoryMutation.isPending
        }
      />

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-800">
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              This action cannot be undone. This will permanently delete the
              category{" "}
              <strong className="text-gray-800">
                "{selectedCategory?.name}"
              </strong>
              .
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <Label
              htmlFor="delete-confirm"
              className="text-sm font-medium text-gray-700"
            >
              Type the category name to confirm:
            </Label>
            <Input
              id="delete-confirm"
              value={deleteConfirmationInput}
              onChange={(e) => setDeleteConfirmationInput(e.target.value)}
              placeholder={selectedCategory?.name}
              autoComplete="off"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => {
                if (selectedCategory) {
                  deleteCategoryMutation.mutate(selectedCategory.id);
                }
              }}
              disabled={
                deleteConfirmationInput !== selectedCategory?.name ||
                deleteCategoryMutation.isPending
              }
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteCategoryMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}{" "}
              Delete Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RowActions({
  row,
  onEdit,
  onDelete,
}: {
  row: Row<InventoryCategory>;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button size="icon" variant="ghost" className="shadow-none">
            <EllipsisIcon size={16} />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface CategoryFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  category: InventoryCategory | null;
  onSubmit: (data: CategoryFormValues) => void;
  isLoading: boolean;
}

function CategoryFormDialog({
  isOpen,
  onOpenChange,
  category,
  onSubmit,
  isLoading,
}: CategoryFormDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setName(category.name);
        setDescription(category.description);
        setIsActive(category.is_active);
      } else {
        setName("");
        setDescription("");
        setIsActive(true);
      }
    }
  }, [category, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description, is_active: isActive });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-gray-800">
            {category ? "Edit Category" : "Create New Category"}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {category
              ? "Update the details for this category."
              : "Fill in the details for the new category."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Category Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
              placeholder="e.g., Cleaning Supplies"
              required
            />
          </div>
          <div>
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
              placeholder="A short description of the category"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {category ? "Save Changes" : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
