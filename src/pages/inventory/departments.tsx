"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Users,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Clock,
  Award,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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

// Extended department data with dummy information
interface ExtendedDepartmentData {
  manager: string;
  employeeCount: number;
  budget: number;
  location: string;
  phone: string;
  email: string;
  operatingHours: string;
  recentAchievements: string[];
  keyMetrics: {
    satisfaction: number;
    efficiency: number;
    revenue: number;
  };
  upcomingTasks: string[];
  criticalIssues: string[];
}

type DepartmentFormValues = Omit<Department, "id" | "created_at" | "hotel">;

const BASE_URL = import.meta.env.VITE_HOTEL_BASE_URL;

// --- API Client and Constants ---
const apiClient = axios.create({
  baseURL: BASE_URL,
});

const HOTEL_ID = import.meta.env.VITE_HOTEL_ID;

// --- Dummy Data Generator ---
const generateDummyData = (department: Department): ExtendedDepartmentData => {
  const baseData = {
    "Front Office": {
      manager: "Sarah Johnson",
      employeeCount: 12,
      budget: 150000,
      location: "Main Lobby",
      phone: "+255 123 456 789",
      email: "frontoffice@hotel.com",
      operatingHours: "24/7",
      recentAchievements: [
        "Achieved 98% guest satisfaction rating",
        "Reduced check-in time by 30%",
        "Implemented new PMS system",
      ],
      keyMetrics: { satisfaction: 98, efficiency: 92, revenue: 2500000 },
      upcomingTasks: [
        "Staff training on new booking system",
        "Quarterly guest feedback review",
        "Update room inventory system",
      ],
      criticalIssues: [],
    },
    Housekeeping: {
      manager: "Maria Rodriguez",
      employeeCount: 25,
      budget: 120000,
      location: "Service Floor B1",
      phone: "+255 123 456 790",
      email: "housekeeping@hotel.com",
      operatingHours: "6:00 AM - 10:00 PM",
      recentAchievements: [
        "Zero hygiene violations in last inspection",
        "Reduced cleaning time per room by 15%",
        "Introduced eco-friendly cleaning products",
      ],
      keyMetrics: { satisfaction: 95, efficiency: 88, revenue: 0 },
      upcomingTasks: [
        "Deep cleaning of conference rooms",
        "Inventory audit",
        "Staff wellness program implementation",
      ],
      criticalIssues: [
        "Shortage of cleaning supplies",
        "Two staff members on sick leave",
      ],
    },
    "Food & Beverage": {
      manager: "Chef Antonio Rossi",
      employeeCount: 18,
      budget: 200000,
      location: "Restaurant & Kitchen",
      phone: "+255 123 456 791",
      email: "fnb@hotel.com",
      operatingHours: "6:00 AM - 11:00 PM",
      recentAchievements: [
        "Launched new seasonal menu",
        "Increased restaurant revenue by 25%",
        "Obtained food safety certification",
      ],
      keyMetrics: { satisfaction: 89, efficiency: 85, revenue: 1800000 },
      upcomingTasks: [
        "Menu revision for winter season",
        "Staff certification renewal",
        "Kitchen equipment maintenance",
      ],
      criticalIssues: [
        "Delayed food delivery from suppliers",
        "Kitchen equipment needs repair",
      ],
    },
    Maintenance: {
      manager: "John Thompson",
      employeeCount: 8,
      budget: 80000,
      location: "Technical Room B2",
      phone: "+255 123 456 792",
      email: "maintenance@hotel.com",
      operatingHours: "24/7 On-call",
      recentAchievements: [
        "99.5% equipment uptime",
        "Completed HVAC system upgrade",
        "Reduced energy consumption by 12%",
      ],
      keyMetrics: { satisfaction: 91, efficiency: 94, revenue: 0 },
      upcomingTasks: [
        "Quarterly safety inspection",
        "Pool equipment maintenance",
        "Fire safety system check",
      ],
      criticalIssues: [],
    },
  };

  // Return specific data if available, otherwise generate generic data
  if (baseData[department.name as keyof typeof baseData]) {
    return baseData[department.name as keyof typeof baseData];
  }

  // Generate generic dummy data for other departments
  return {
    manager: `Manager ${department.code}`,
    employeeCount: Math.floor(Math.random() * 20) + 5,
    budget: Math.floor(Math.random() * 200000) + 50000,
    location: `Floor ${Math.floor(Math.random() * 5) + 1}`,
    phone: `+255 123 456 ${Math.floor(Math.random() * 900) + 100}`,
    email: `${department.code.toLowerCase()}@hotel.com`,
    operatingHours: "9:00 AM - 6:00 PM",
    recentAchievements: [
      "Completed quarterly training",
      "Improved efficiency metrics",
      "Successfully handled peak season",
    ],
    keyMetrics: {
      satisfaction: Math.floor(Math.random() * 20) + 80,
      efficiency: Math.floor(Math.random() * 20) + 75,
      revenue: Math.floor(Math.random() * 1000000),
    },
    upcomingTasks: [
      "Monthly department review",
      "Staff performance evaluations",
      "Process optimization review",
    ],
    criticalIssues:
      Math.random() > 0.7 ? ["Minor equipment maintenance needed"] : [],
  };
};

// --- Main Component ---
export default function HotelDepartments() {
  const queryClient = useQueryClient();

  // --- State Management ---
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
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
      const response = await apiClient.get(`departments/`, { params });
      return response.data;
    },
    enabled: !!HOTEL_ID,
  });

  // --- Data Mutations ---
  const createDepartmentMutation = useMutation({
    mutationFn: (newDepartment: DepartmentFormValues) => {
      const payload = { ...newDepartment, hotel: HOTEL_ID };
      return apiClient.post("departments/", payload);
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
      return apiClient.patch(`departments/${id}/`, updatedData);
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
      return apiClient.delete(`departments/${id}/`);
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
  const toggleRow = (departmentId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(departmentId)) {
      newExpandedRows.delete(departmentId);
    } else {
      newExpandedRows.add(departmentId);
    }
    setExpandedRows(newExpandedRows);
  };

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

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        Inactive
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "TZS",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const departments = departmentsResponse?.results ?? [];
  const allDummyData = departments.map((dept) => ({
    ...dept,
    dummyData: generateDummyData(dept),
  }));

  const isDeleteButtonDisabled =
    deleteConfirmationInput !== selectedDepartment?.name;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2
          className="text-3xl font-bold tracking-tight"
          style={{ color: "#0A0A0A" }}
        >
          Hotel Departments
        </h2>
        <Button
          style={{ backgroundColor: "#155DFC" }}
          onClick={() => handleOpenForm()}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Department
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Overview</CardTitle>
          <CardDescription>
            Click on any row to view detailed information about the department
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-100">
                  <TableHead className="w-8"></TableHead>
                  <TableHead>Department Name</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      <p className="mt-2">Loading departments...</p>
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-red-500"
                    >
                      Error: {error?.message || "Failed to load departments"}
                    </TableCell>
                  </TableRow>
                ) : departments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No departments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  allDummyData.map((department) => (
                    <>
                      {/* Main Table Row */}
                      <TableRow
                        key={department.id}
                        className={cn(
                          "cursor-pointer transition-colors",
                          department.is_active
                            ? "bg-white hover:bg-muted/50"
                            : "bg-red-50 hover:bg-red-100/50"
                        )}
                        onClick={() => toggleRow(department.id)}
                      >
                        <TableCell>
                          {expandedRows.has(department.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </TableCell>
                        <TableCell
                          className="font-medium"
                          style={{ color: "#0A0A0A" }}
                        >
                          {department.name}
                        </TableCell>
                        <TableCell>{department.dummyData.manager}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            {department.dummyData.employeeCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(department.is_active)}
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleOpenForm(department)}
                              >
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleOpenDeleteConfirm(department)
                                }
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>

                      {/* Accordion Content */}
                      {expandedRows.has(department.id) && (
                        <TableRow>
                          <TableCell colSpan={6} className="p-0">
                            <div className="px-6 py-4 bg-muted/20 border-t">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                  <h4 className="font-semibold text-lg">
                                    Basic Information
                                  </h4>
                                  <div className="space-y-3">
                                    <div className="flex items-start space-x-2">
                                      <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                                      <div>
                                        <p className="text-sm font-medium">
                                          Location
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          {department.dummyData.location}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                      <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                                      <div>
                                        <p className="text-sm font-medium">
                                          Phone
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          {department.dummyData.phone}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                      <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                                      <div>
                                        <p className="text-sm font-medium">
                                          Email
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          {department.dummyData.email}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                      <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
                                      <div>
                                        <p className="text-sm font-medium">
                                          Operating Hours
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          {department.dummyData.operatingHours}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                      <DollarSign className="h-4 w-4 mt-1 text-muted-foreground" />
                                      <div>
                                        <p className="text-sm font-medium">
                                          Annual Budget
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          {formatCurrency(
                                            department.dummyData.budget
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Description & Metrics */}
                                <div className="space-y-4">
                                  <h4 className="font-semibold text-lg">
                                    Description & Metrics
                                  </h4>
                                  <div className="space-y-3">
                                    <div>
                                      <p className="text-sm font-medium mb-1">
                                        Department Description
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {department.description}
                                      </p>
                                    </div>

                                    <Separator />

                                    <div>
                                      <p className="text-sm font-medium mb-2">
                                        Key Performance Metrics
                                      </p>
                                      <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                          <span className="text-sm">
                                            Guest Satisfaction
                                          </span>
                                          <Badge variant="outline">
                                            {
                                              department.dummyData.keyMetrics
                                                .satisfaction
                                            }
                                            %
                                          </Badge>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="text-sm">
                                            Operational Efficiency
                                          </span>
                                          <Badge variant="outline">
                                            {
                                              department.dummyData.keyMetrics
                                                .efficiency
                                            }
                                            %
                                          </Badge>
                                        </div>
                                        {department.dummyData.keyMetrics
                                          .revenue > 0 && (
                                          <div className="flex justify-between items-center">
                                            <span className="text-sm">
                                              Revenue (Annual)
                                            </span>
                                            <Badge variant="outline">
                                              {formatCurrency(
                                                department.dummyData.keyMetrics
                                                  .revenue
                                              )}
                                            </Badge>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Tasks & Issues */}
                                <div className="space-y-4">
                                  <h4 className="font-semibold text-lg">
                                    Tasks & Issues
                                  </h4>
                                  <div className="space-y-3">
                                    <div>
                                      <div className="flex items-center space-x-2 mb-2">
                                        <Award className="h-4 w-4 text-green-600" />
                                        <p className="text-sm font-medium">
                                          Recent Achievements
                                        </p>
                                      </div>
                                      <ul className="space-y-1">
                                        {department.dummyData.recentAchievements.map(
                                          (achievement, index) => (
                                            <li
                                              key={index}
                                              className="text-sm text-muted-foreground flex items-start"
                                            >
                                              <span className="inline-block w-1.5 h-1.5 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                              {achievement}
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>

                                    <div>
                                      <div className="flex items-center space-x-2 mb-2">
                                        <TrendingUp className="h-4 w-4 text-blue-600" />
                                        <p className="text-sm font-medium">
                                          Upcoming Tasks
                                        </p>
                                      </div>
                                      <ul className="space-y-1">
                                        {department.dummyData.upcomingTasks.map(
                                          (task, index) => (
                                            <li
                                              key={index}
                                              className="text-sm text-muted-foreground flex items-start"
                                            >
                                              <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                              {task}
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>

                                    {department.dummyData.criticalIssues
                                      .length > 0 && (
                                      <div>
                                        <div className="flex items-center space-x-2 mb-2">
                                          <AlertCircle className="h-4 w-4 text-red-600" />
                                          <p className="text-sm font-medium text-red-600">
                                            Critical Issues
                                          </p>
                                        </div>
                                        <ul className="space-y-1">
                                          {department.dummyData.criticalIssues.map(
                                            (issue, index) => (
                                              <li
                                                key={index}
                                                className="text-sm text-red-600 flex items-start"
                                              >
                                                <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                                {issue}
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary Statistics */}
          {departments.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">
                        {allDummyData.reduce(
                          (sum, dept) => sum + dept.dummyData.employeeCount,
                          0
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total Employees
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">
                        {formatCurrency(
                          allDummyData.reduce(
                            (sum, dept) => sum + dept.dummyData.budget,
                            0
                          )
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total Budget
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">
                        {Math.round(
                          allDummyData.reduce(
                            (sum, dept) =>
                              sum + dept.dummyData.keyMetrics.satisfaction,
                            0
                          ) / allDummyData.length
                        )}
                        %
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Avg Satisfaction
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-2xl font-bold">
                        {allDummyData.reduce(
                          (sum, dept) =>
                            sum + dept.dummyData.criticalIssues.length,
                          0
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Critical Issues
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
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
