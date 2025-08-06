"use client";
import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Loader2, MoreHorizontal } from "lucide-react";

// --- Shadcn UI Components ---
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch"; // Import the Switch component
import { cn } from "@/lib/utils"; // Import cn for conditional classes

// --- Type Definitions ---
interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  is_active: boolean;
  created_at: string;
  hotel: string;
}

interface PaginatedDepartmentsResponse {
  count: number;
  results: Department[];
}

// Include is_active in the form values
type DepartmentFormValues = Omit<Department, "id" | "created_at" | "hotel">;

// --- API Client and Constants ---
const apiClient = axios.create({
  baseURL: "http://192.168.110.207:8020/api/v1",
});
const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;

// --- Main Component ---
export default function HotelDepartments() {
  const queryClient = useQueryClient();

  // --- State Management ---
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");

  // --- Data Fetching ---
  const {
    data: departmentsResponse,
    isLoading,
    isError,
    error,
  } = useQuery<PaginatedDepartmentsResponse>({
    queryKey: ["departments", HOTEL_ID],
    queryFn: async () => {
      const params = new URLSearchParams({ hotel_id: HOTEL_ID });
      const response = await apiClient.get(`/departments/`, { params });
      return response.data;
    },
    enabled: !!HOTEL_ID,
  });

  // --- Data Mutations ---
  const createDepartmentMutation = useMutation({
    mutationFn: (newDepartment: DepartmentFormValues) => {
      const payload = { ...newDepartment, hotel: HOTEL_ID };
      return apiClient.post("/departments/", payload);
    },
    onSuccess: () => {
      toast.success("Department created successfully!");
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      setIsFormOpen(false);
    },
    onError: (err: any) => {
      toast.error(
        `Failed to create department: ${
          err.response?.data?.name?.[0] || err.message
        }`
      );
    },
  });

  const updateDepartmentMutation = useMutation({
    mutationFn: ({
      id,
      updatedData,
    }: {
      id: string;
      updatedData: Partial<DepartmentFormValues>;
    }) => {
      return apiClient.patch(`/departments/${id}/`, updatedData);
    },
    onSuccess: () => {
      toast.success("Department updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      setIsFormOpen(false);
      setSelectedDepartment(null);
    },
    onError: (err: any) => {
      toast.error(`Failed to update department: ${err.message}`);
    },
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: (id: string) => {
      return apiClient.delete(`/departments/${id}/`);
    },
    onSuccess: () => {
      toast.success("Department deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      setIsDeleteConfirmOpen(false);
      setSelectedDepartment(null);
    },
    onError: (err: any) => {
      toast.error(`Failed to delete department: ${err.message}`);
    },
  });

  // --- Event Handlers ---
  const handleOpenForm = (department: Department | null = null) => {
    setSelectedDepartment(department);
    setIsFormOpen(true);
  };

  const handleOpenDeleteConfirm = (department: Department) => {
    setSelectedDepartment(department);
    setDeleteConfirmationInput("");
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (selectedDepartment) {
      deleteDepartmentMutation.mutate(selectedDepartment.id);
    }
  };

  // --- Table Column Definitions ---
  const columns = useMemo<ColumnDef<Department>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Department Name",
        cell: ({ row }) => (
          <div className="font-medium">{row.original.name}</div>
        ),
      },
      {
        accessorKey: "code",
        header: "Code",
        cell: ({ row }) => <div>{row.original.code}</div>,
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <div className="text-sm text-gray-600 max-w-xs truncate">
            {row.original.description}
          </div>
        ),
      },
      {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={row.original.is_active ? "default" : "destructive"}>
            {row.original.is_active ? "Active" : "Inactive"}
          </Badge>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Date Created",
        cell: ({ row }) => (
          <div>{format(new Date(row.original.created_at), "PP")}</div>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleOpenForm(row.original)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleOpenDeleteConfirm(row.original)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: departmentsResponse?.results ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  });

  const isDeleteButtonDisabled =
    deleteConfirmationInput !== selectedDepartment?.name;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Hotel Departments</h2>
        <Button onClick={() => handleOpenForm()}>
          <Plus className="mr-2 h-4 w-4" /> Add Department
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Departments</CardTitle>
          <CardDescription>
            Create, edit, and delete hotel departments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
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
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-red-500"
                    >
                      Error: {error.message}
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className={cn(
                        "transition-colors",
                        row.original.is_active
                          ? "bg-white hover:bg-green-50/50"
                          : "bg-red-50 hover:bg-red-100/50"
                      )}
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
                      No departments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <DepartmentFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        department={selectedDepartment}
        onSubmit={
          selectedDepartment
            ? (data) =>
                updateDepartmentMutation.mutate({
                  id: selectedDepartment.id,
                  updatedData: data,
                })
            : createDepartmentMutation.mutate
        }
        isLoading={
          createDepartmentMutation.isPending ||
          updateDepartmentMutation.isPending
        }
      />

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              department <strong>"{selectedDepartment?.name}"</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="delete-confirm" className="text-sm font-medium">
              Please type the department name to confirm:
            </Label>
            <Input
              id="delete-confirm"
              value={deleteConfirmationInput}
              onChange={(e) => setDeleteConfirmationInput(e.target.value)}
              className="mt-2"
              placeholder={selectedDepartment?.name}
              autoComplete="off"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleDelete}
              disabled={
                isDeleteButtonDisabled || deleteDepartmentMutation.isPending
              }
              variant="destructive"
            >
              {deleteDepartmentMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- Sub-component for the Create/Edit Form Dialog ---
interface DepartmentFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  department: Department | null;
  onSubmit: (data: Partial<DepartmentFormValues>) => void;
  isLoading: boolean;
}

function DepartmentFormDialog({
  isOpen,
  onOpenChange,
  department,
  onSubmit,
  isLoading,
}: DepartmentFormDialogProps) {
  const [formState, setFormState] = useState<Partial<DepartmentFormValues>>({
    name: "",
    code: "",
    description: "",
    is_active: true,
  });

  useEffect(() => {
    if (department) {
      setFormState({
        name: department.name,
        code: department.code,
        description: department.description,
        is_active: department.is_active,
      });
    } else {
      // Default for new department
      setFormState({ name: "", code: "", description: "", is_active: true });
    }
  }, [department, isOpen]);

  const handleChange = (
    field: keyof DepartmentFormValues,
    value: string | boolean
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formState);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {department ? "Edit Department" : "Create New Department"}
          </DialogTitle>
          <DialogDescription>
            {department
              ? "Update the details for this department."
              : "Fill in the details for the new department."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Department Name</Label>
            <Input
              id="name"
              value={formState.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g., Maintenance"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Department Code</Label>
            <Input
              id="code"
              value={formState.code}
              onChange={(e) => handleChange("code", e.target.value)}
              placeholder="e.g., DPT-MNT"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formState.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="A short description of the department's responsibilities"
            />
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="is_active"
              checked={formState.is_active}
              onCheckedChange={(checked) => handleChange("is_active", checked)}
            />
            <Label htmlFor="is_active" className="cursor-pointer">
              {formState.is_active
                ? "Department is Active"
                : "Department is Inactive"}
            </Label>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {department ? "Save Changes" : "Create Department"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
