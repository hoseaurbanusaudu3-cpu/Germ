import { useState } from "react";
import { Search, Edit, Trash2, Eye, KeyRound, UserCog, Download, Upload, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { toast } from "sonner@2.0.3";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

export function ManageUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [resetViaEmail, setResetViaEmail] = useState(true);
  const [resetViaSMS, setResetViaSMS] = useState(false);

  const users = [
    { 
      id: 1, 
      role: "Admin", 
      name: "Dr. Ibrahim Yusuf", 
      username: "iyusuf001", 
      email: "ibrahim@graceland.edu.ng", 
      phone: "08012345678", 
      status: "Active", 
      lastLogin: "2025-10-30 14:23" 
    },
    { 
      id: 2, 
      role: "Teacher", 
      name: "Mrs. Fatima Hassan", 
      username: "fhassan002", 
      email: "fatima.hassan@graceland.edu.ng", 
      phone: "08023456789", 
      status: "Active", 
      lastLogin: "2025-10-31 09:15" 
    },
    { 
      id: 3, 
      role: "Accountant", 
      name: "Mr. Abubakar Musa", 
      username: "amusa003", 
      email: "abubakar.musa@graceland.edu.ng", 
      phone: "08034567890", 
      status: "Active", 
      lastLogin: "2025-10-31 08:45" 
    },
    { 
      id: 4, 
      role: "Parent", 
      name: "Alhaji Mohammed Ali", 
      username: "mali004", 
      email: "mohammed.ali@example.com", 
      phone: "08045678901", 
      status: "Active", 
      lastLogin: "2025-10-29 18:30" 
    },
    { 
      id: 5, 
      role: "Teacher", 
      name: "Mr. Yusuf Ibrahim", 
      username: "yibrahim005", 
      email: "yusuf.ibrahim@graceland.edu.ng", 
      phone: "08056789012", 
      status: "Inactive", 
      lastLogin: "2025-10-15 12:00" 
    },
  ];

  const handleResetPassword = (user: any) => {
    setSelectedUser(user);
    setShowResetDialog(true);
  };

  const confirmResetPassword = () => {
    const method = resetViaEmail && resetViaSMS 
      ? "Email & SMS" 
      : resetViaEmail 
      ? "Email" 
      : resetViaSMS 
      ? "SMS" 
      : "not sent";

    toast.success(`Password reset link sent to ${selectedUser.name} via ${method}`);
    setShowResetDialog(false);
    setSelectedUser(null);
  };

  const handleDeactivate = (user: any) => {
    setSelectedUser(user);
    setShowDeactivateDialog(true);
  };

  const confirmDeactivate = () => {
    const action = selectedUser.status === "Active" ? "deactivated" : "activated";
    toast.success(`User ${selectedUser.name} ${action} successfully`);
    setShowDeactivateDialog(false);
    setSelectedUser(null);
  };

  const handleEdit = (userId: number) => {
    toast.info(`Editing user ID: ${userId}`);
  };

  const handleView = (userId: number) => {
    toast.info(`Viewing details for user ID: ${userId}`);
  };

  const handleResendCredentials = (userId: number) => {
    toast.success("Credentials resent successfully");
  };

  const handleBulkImport = () => {
    toast.info("CSV import functionality");
  };

  const handleExport = () => {
    toast.success("User list exported");
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case "Admin": return "bg-[#DC3545]";
      case "Teacher": return "bg-[#1E90FF]";
      case "Accountant": return "bg-[#FFC107]";
      case "Parent": return "bg-[#28A745]";
      default: return "bg-[#C0C8D3]";
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-white mb-2">Manage Users</h1>
        <p className="text-[#C0C8D3]">View, edit, and manage all system users</p>
      </div>

      <Card className="rounded-xl bg-[#132C4A] border border-white/10 shadow-lg">
        <CardHeader className="p-5 border-b border-white/10">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#C0C8D3]" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, username, or email..."
                className="h-12 pl-10 rounded-xl border border-white/10 bg-[#0F243E] text-white"
              />
            </div>

            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="h-12 w-full sm:w-36 rounded-xl border border-white/10 bg-[#0F243E] text-white">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent className="bg-[#0F243E] border-white/10">
                  <SelectItem value="all" className="text-white hover:bg-[#1E90FF]">All Roles</SelectItem>
                  <SelectItem value="Admin" className="text-white hover:bg-[#1E90FF]">Admin</SelectItem>
                  <SelectItem value="Teacher" className="text-white hover:bg-[#1E90FF]">Teacher</SelectItem>
                  <SelectItem value="Accountant" className="text-white hover:bg-[#1E90FF]">Accountant</SelectItem>
                  <SelectItem value="Parent" className="text-white hover:bg-[#1E90FF]">Parent</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-12 w-full sm:w-36 rounded-xl border border-white/10 bg-[#0F243E] text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-[#0F243E] border-white/10">
                  <SelectItem value="all" className="text-white hover:bg-[#1E90FF]">All Status</SelectItem>
                  <SelectItem value="Active" className="text-white hover:bg-[#1E90FF]">Active</SelectItem>
                  <SelectItem value="Inactive" className="text-white hover:bg-[#1E90FF]">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                onClick={handleBulkImport}
                className="h-12 bg-[#FFC107] hover:bg-[#FFC107]/90 text-white rounded-xl shadow-md hover:scale-105 transition-all whitespace-nowrap"
              >
                <Upload className="w-5 h-5 mr-2" />
                Import (CSV)
              </Button>

              <Button 
                onClick={handleExport}
                className="h-12 bg-[#1E90FF] hover:bg-[#00BFFF] text-white rounded-xl shadow-md hover:scale-105 transition-all whitespace-nowrap"
              >
                <Download className="w-5 h-5 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-[#1E90FF] to-[#00BFFF] border-none hover:bg-gradient-to-r">
                  <TableHead className="text-white">Role</TableHead>
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Username</TableHead>
                  <TableHead className="text-white">Email</TableHead>
                  <TableHead className="text-white">Phone</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Last Login</TableHead>
                  <TableHead className="text-white text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="bg-[#0F243E] border-b border-white/5 hover:bg-[#132C4A]">
                    <TableCell>
                      <Badge className={`${getRoleBadgeColor(user.role)} text-white border-0`}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">{user.name}</TableCell>
                    <TableCell className="text-[#C0C8D3] font-mono text-sm">{user.username}</TableCell>
                    <TableCell className="text-[#C0C8D3] text-sm">{user.email}</TableCell>
                    <TableCell className="text-[#C0C8D3]">{user.phone}</TableCell>
                    <TableCell>
                      <Badge className={user.status === "Active" ? "bg-[#28A745] text-white border-0" : "bg-[#DC3545] text-white border-0"}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#C0C8D3] text-sm">{user.lastLogin}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        <Button
                          onClick={() => handleView(user.id)}
                          size="sm"
                          className="h-8 w-8 p-0 bg-[#1E90FF] hover:bg-[#00BFFF] rounded-lg"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleEdit(user.id)}
                          size="sm"
                          className="h-8 w-8 p-0 bg-[#FFC107] hover:bg-[#FFC107]/90 rounded-lg"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleResetPassword(user)}
                          size="sm"
                          className="h-8 w-8 p-0 bg-[#00BFFF] hover:bg-[#00BFFF]/90 rounded-lg"
                          title="Reset Password"
                        >
                          <KeyRound className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeactivate(user)}
                          size="sm"
                          className={`h-8 w-8 p-0 rounded-lg ${
                            user.status === "Active" 
                              ? "bg-[#DC3545] hover:bg-[#DC3545]/90" 
                              : "bg-[#28A745] hover:bg-[#28A745]/90"
                          }`}
                          title={user.status === "Active" ? "Deactivate" : "Activate"}
                        >
                          <UserCog className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="rounded-xl bg-[#132C4A] border border-white/10 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-[#1E90FF]" />
              <p className="text-[#C0C8D3] text-sm">Total Users</p>
            </div>
            <p className="text-white text-xl">347</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl bg-[#132C4A] border border-white/10 shadow-lg">
          <CardContent className="p-4">
            <p className="text-[#C0C8D3] mb-1 text-sm">Admins</p>
            <p className="text-[#DC3545] text-xl">12</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl bg-[#132C4A] border border-white/10 shadow-lg">
          <CardContent className="p-4">
            <p className="text-[#C0C8D3] mb-1 text-sm">Teachers</p>
            <p className="text-[#1E90FF] text-xl">87</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl bg-[#132C4A] border border-white/10 shadow-lg">
          <CardContent className="p-4">
            <p className="text-[#C0C8D3] mb-1 text-sm">Accountants</p>
            <p className="text-[#FFC107] text-xl">8</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl bg-[#132C4A] border border-white/10 shadow-lg">
          <CardContent className="p-4">
            <p className="text-[#C0C8D3] mb-1 text-sm">Parents</p>
            <p className="text-[#28A745] text-xl">240</p>
          </CardContent>
        </Card>
      </div>

      {/* Reset Password Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="bg-[#132C4A] border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Reset Password</DialogTitle>
            <DialogDescription className="text-[#C0C8D3]">
              Send password reset instructions to {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-3 bg-[#0F243E] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1E90FF]/20 flex items-center justify-center">
                  <UserCog className="w-4 h-4 text-[#1E90FF]" />
                </div>
                <div>
                  <p className="text-white text-sm">{selectedUser?.name}</p>
                  <p className="text-[#C0C8D3] text-xs">{selectedUser?.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-white">Send reset link via:</Label>
              <div className="flex items-center justify-between p-3 bg-[#0F243E] rounded-lg">
                <span className="text-white text-sm">Email</span>
                <Switch checked={resetViaEmail} onCheckedChange={setResetViaEmail} />
              </div>
              <div className="flex items-center justify-between p-3 bg-[#0F243E] rounded-lg">
                <span className="text-white text-sm">SMS</span>
                <Switch checked={resetViaSMS} onCheckedChange={setResetViaSMS} />
              </div>
            </div>

            <div className="p-3 bg-[#FFC107]/10 border border-[#FFC107]/30 rounded-lg">
              <p className="text-xs text-[#C0C8D3]">
                ⚠️ The reset link will expire in 1 hour. User will be required to create a new password.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => setShowResetDialog(false)}
              className="bg-[#DC3545] hover:bg-[#DC3545]/90 text-white rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmResetPassword}
              disabled={!resetViaEmail && !resetViaSMS}
              className="bg-[#28A745] hover:bg-[#28A745]/90 text-white rounded-xl"
            >
              Reset & Notify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate/Activate Confirmation Dialog */}
      <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <AlertDialogContent className="bg-[#132C4A] border border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              {selectedUser?.status === "Active" ? "Deactivate User?" : "Activate User?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#C0C8D3]">
              {selectedUser?.status === "Active" 
                ? `Are you sure you want to deactivate ${selectedUser?.name}? They will no longer be able to access the system.`
                : `Are you sure you want to activate ${selectedUser?.name}? They will regain access to the system.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#0F243E] text-white border-white/10 hover:bg-[#132C4A]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeactivate}
              className={selectedUser?.status === "Active" 
                ? "bg-[#DC3545] hover:bg-[#DC3545]/90" 
                : "bg-[#28A745] hover:bg-[#28A745]/90"
              }
            >
              {selectedUser?.status === "Active" ? "Deactivate" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
