// - - - src/pages/inventory/departments.tsx
"use client";

import { useState } from "react";
import {
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Types
interface Department {
  id: string;
  name: string;
  manager: string;
  employeeCount: number;
  status: "Active" | "Inactive" | "Under Review";
  budget: number;
  location: string;
  phone: string;
  email: string;
  description: string;
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

// Mock data
const mockDepartments: Department[] = [
  {
    id: "1",
    name: "Front Office",
    manager: "Sarah Johnson",
    employeeCount: 12,
    status: "Active",
    budget: 150000,
    location: "Main Lobby",
    phone: "+255 123 456 789",
    email: "frontoffice@hotel.com",
    description:
      "Responsible for guest check-in/check-out, reservations, and guest services. The first point of contact for all guests.",
    operatingHours: "24/7",
    recentAchievements: [
      "Achieved 98% guest satisfaction rating",
      "Reduced check-in time by 30%",
      "Implemented new PMS system",
    ],
    keyMetrics: {
      satisfaction: 98,
      efficiency: 92,
      revenue: 2500000,
    },
    upcomingTasks: [
      "Staff training on new booking system",
      "Quarterly guest feedback review",
      "Update room inventory system",
    ],
    criticalIssues: [],
  },
  {
    id: "2",
    name: "Housekeeping",
    manager: "Maria Rodriguez",
    employeeCount: 25,
    status: "Active",
    budget: 120000,
    location: "Service Floor B1",
    phone: "+255 123 456 790",
    email: "housekeeping@hotel.com",
    description:
      "Maintains cleanliness and hygiene standards throughout the hotel, including guest rooms, public areas, and back-of-house facilities.",
    operatingHours: "6:00 AM - 10:00 PM",
    recentAchievements: [
      "Zero hygiene violations in last inspection",
      "Reduced cleaning time per room by 15%",
      "Introduced eco-friendly cleaning products",
    ],
    keyMetrics: {
      satisfaction: 95,
      efficiency: 88,
      revenue: 0,
    },
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
  {
    id: "3",
    name: "Food & Beverage",
    manager: "Chef Antonio Rossi",
    employeeCount: 18,
    status: "Under Review",
    budget: 200000,
    location: "Restaurant & Kitchen",
    phone: "+255 123 456 791",
    email: "fnb@hotel.com",
    description:
      "Manages all food and beverage operations including restaurant service, room service, banquets, and bar operations.",
    operatingHours: "6:00 AM - 11:00 PM",
    recentAchievements: [
      "Launched new seasonal menu",
      "Increased restaurant revenue by 25%",
      "Obtained food safety certification",
    ],
    keyMetrics: {
      satisfaction: 89,
      efficiency: 85,
      revenue: 1800000,
    },
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
  {
    id: "4",
    name: "Maintenance",
    manager: "John Thompson",
    employeeCount: 8,
    status: "Active",
    budget: 80000,
    location: "Technical Room B2",
    phone: "+255 123 456 792",
    email: "maintenance@hotel.com",
    description:
      "Responsible for preventive and corrective maintenance of all hotel facilities, equipment, and infrastructure.",
    operatingHours: "24/7 On-call",
    recentAchievements: [
      "99.5% equipment uptime",
      "Completed HVAC system upgrade",
      "Reduced energy consumption by 12%",
    ],
    keyMetrics: {
      satisfaction: 91,
      efficiency: 94,
      revenue: 0,
    },
    upcomingTasks: [
      "Quarterly safety inspection",
      "Pool equipment maintenance",
      "Fire safety system check",
    ],
    criticalIssues: [],
  },
];

export default function HotelDepartments() {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (departmentId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(departmentId)) {
      newExpandedRows.delete(departmentId);
    } else {
      newExpandedRows.add(departmentId);
    }
    setExpandedRows(newExpandedRows);
  };

  const getStatusBadge = (status: Department["status"]) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Active
          </Badge>
        );
      case "Inactive":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Inactive
          </Badge>
        );
      case "Under Review":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Under Review
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "TZS",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2
          className="text-3xl font-bold tracking-tight"
          style={{ color: "#0A0A0A" }}
        >
          Hotel Departments
        </h2>
        <Button style={{ backgroundColor: "#155DFC" }}>Add Department</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Overview</CardTitle>
          <p className="text-sm text-muted-foreground">
            Click on any row to view detailed information about the department
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow style={{ backgroundColor: "#DBEAFF" }}>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>Department Name</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDepartments.map((department) => (
                  <>
                    {/* Main Table Row */}
                    <TableRow
                      key={department.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
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
                      <TableCell>{department.manager}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          {department.employeeCount}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(department.status)}</TableCell>
                    </TableRow>

                    {/* Accordion Content */}
                    {expandedRows.has(department.id) && (
                      <TableRow>
                        <TableCell colSpan={5} className="p-0">
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
                                        {department.location}
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
                                        {department.phone}
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
                                        {department.email}
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
                                        {department.operatingHours}
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
                                        {formatCurrency(department.budget)}
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
                                          {department.keyMetrics.satisfaction}%
                                        </Badge>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm">
                                          Operational Efficiency
                                        </span>
                                        <Badge variant="outline">
                                          {department.keyMetrics.efficiency}%
                                        </Badge>
                                      </div>
                                      {department.keyMetrics.revenue > 0 && (
                                        <div className="flex justify-between items-center">
                                          <span className="text-sm">
                                            Revenue (Annual)
                                          </span>
                                          <Badge variant="outline">
                                            {formatCurrency(
                                              department.keyMetrics.revenue
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
                                      {department.recentAchievements.map(
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
                                      {department.upcomingTasks.map(
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

                                  {department.criticalIssues.length > 0 && (
                                    <div>
                                      <div className="flex items-center space-x-2 mb-2">
                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                        <p className="text-sm font-medium text-red-600">
                                          Critical Issues
                                        </p>
                                      </div>
                                      <ul className="space-y-1">
                                        {department.criticalIssues.map(
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
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Summary Statistics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {mockDepartments.reduce(
                        (sum, dept) => sum + dept.employeeCount,
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
                        mockDepartments.reduce(
                          (sum, dept) => sum + dept.budget,
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
                        mockDepartments.reduce(
                          (sum, dept) => sum + dept.keyMetrics.satisfaction,
                          0
                        ) / mockDepartments.length
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
                      {mockDepartments.reduce(
                        (sum, dept) => sum + dept.criticalIssues.length,
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
        </CardContent>
      </Card>
    </div>
  );
}
