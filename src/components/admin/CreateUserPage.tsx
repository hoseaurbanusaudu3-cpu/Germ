import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { UserPlus, Mail, Shield, Hash, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useSchool } from "../../contexts/SchoolContext";

export function CreateUserPage() {
  const { addUser, teachers, students } = useSchool();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student" as "admin" | "teacher" | "accountant" | "student" | "parent",
    linkedId: "",
    status: "active" as "active" | "inactive"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getLinkedOptions = () => {
    switch (formData.role) {
      case "teacher":
        return teachers.filter(t => t.status === "active").map(t => ({
          value: t.id.toString(),
          label: `${t.firstName} ${t.lastName} (${t.employeeId})`
        }));
      case "student":
        return students.filter(s => s.status === "active").map(s => ({
          value: s.id.toString(),
          label: `${s.firstName} ${s.lastName} (${s.admissionNumber})`
        }));
      default:
        return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (["teacher", "student"].includes(formData.role) && !formData.linkedId) {
      toast.error(`Please select a ${formData.role} to link this account to`);
      return;
    }

    try {
      setIsSubmitting(true);
      
      const newUser = {
        id: Date.now(),
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        linkedId: formData.linkedId ? parseInt(formData.linkedId) : undefined,
        status: formData.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      addUser(newUser);
      
      toast.success("User account created successfully!");
      
      // Reset form
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "student",
        linkedId: "",
        status: "active"
      });

    } catch (error) {
      toast.error("Failed to create user account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create User Account</h2>
        <p className="text-muted-foreground">
          Create a new user account for school staff or students
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Account Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@school.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">User Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: string) => handleInputChange("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      <Badge variant="default">Administrator</Badge>
                    </SelectItem>
                    <SelectItem value="teacher">
                      <Badge variant="secondary">Teacher</Badge>
                    </SelectItem>
                    <SelectItem value="accountant">
                      <Badge variant="outline">Accountant</Badge>
                    </SelectItem>
                    <SelectItem value="student">
                      <Badge variant="secondary">Student</Badge>
                    </SelectItem>
                    <SelectItem value="parent">
                      <Badge variant="outline">Parent</Badge>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Account Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: string) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      <Badge variant="default">Active</Badge>
                    </SelectItem>
                    <SelectItem value="inactive">
                      <Badge variant="secondary">Inactive</Badge>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {["teacher", "student"].includes(formData.role) && (
              <div className="space-y-2">
                <Label htmlFor="linkedId">Link to {formData.role === "teacher" ? "Teacher" : "Student"} *</Label>
                <Select
                  value={formData.linkedId}
                  onValueChange={(value: string) => handleInputChange("linkedId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${formData.role} to link`} />
                  </SelectTrigger>
                  <SelectContent>
                    {getLinkedOptions().map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Create User Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
