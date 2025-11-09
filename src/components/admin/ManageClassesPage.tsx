import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Plus, Search, Edit, Users, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { useSchool, Class, Teacher } from "../../contexts/SchoolContext";

const ManageClassesPage = () => {
  const { classes, teachers, addClass, updateClass, fetchClasses, fetchTeachers } = useSchool();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentClass, setCurrentClass] = useState<Class | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    level: "",
    section: "",
    classTeacherId: undefined as number | undefined,
    capacity: 0,
    status: "Active",
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (classItem: Class) => {
    setIsEditing(true);
    setCurrentClass(classItem);
    setFormData({
      name: classItem.name,
      level: classItem.level,
      section: classItem.section,
      classTeacherId: classItem.classTeacherId,
      capacity: classItem.capacity,
      status: classItem.status,
    });
    setIsFormOpen(true);
  };

  const handleAddNewClick = () => {
    setIsEditing(false);
    setCurrentClass(null);
    setFormData({
      name: "",
      level: "",
      section: "",
      classTeacherId: undefined,
      capacity: 0,
      status: "Active",
    });
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setIsEditing(false);
    setCurrentClass(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const classData = {
        ...formData,
        capacity: Number(formData.capacity),
        classTeacherId: formData.classTeacherId ? Number(formData.classTeacherId) : undefined,
      };

      if (isEditing && currentClass) {
        await updateClass(currentClass.id, classData);
        toast.success("Class updated successfully");
      } else {
        await addClass(classData);
        toast.success("Class added successfully");
      }
      setIsFormOpen(false);
      fetchClasses();
    } catch (error) {
      toast.error("Failed to save class");
      console.error(error);
    }
  };

  const filteredClasses = classes.filter((classItem) =>
    classItem.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Classes</CardTitle>
          <CardDescription>
            View, add, and edit school classes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search classes..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleAddNewClick}>
              <Plus className="mr-2" /> Add New Class
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClasses.map((classItem) => (
              <Card key={classItem.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{classItem.name}</CardTitle>
                      <CardDescription>{classItem.level} - Section {classItem.section}</CardDescription>
                    </div>
                    <Badge variant={classItem.status === "Active" ? "default" : "destructive"}>
                      {classItem.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>Capacity: {classItem.capacity}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>
                      Class Teacher:{" "}
                      {teachers.find(t => t.id === classItem.classTeacherId)?.firstName || "Not Assigned"}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => handleEditClick(classItem)}
                  >
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>{isEditing ? "Edit Class" : "Add New Class"}</CardTitle>
              <CardDescription>
                {isEditing
                  ? "Update the details of the existing class."
                  : "Fill in the details for the new class."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Class Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Select
                      name="level"
                      value={formData.level}
                      onValueChange={(value) => handleSelectChange("level", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nursery">Nursery</SelectItem>
                        <SelectItem value="Primary">Primary</SelectItem>
                        <SelectItem value="JSS">JSS</SelectItem>
                        <SelectItem value="SSS">SSS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="section">Section</Label>
                    <Input
                      id="section"
                      name="section"
                      value={formData.section}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="classTeacherId">Class Teacher</Label>
                    <Select
                      name="classTeacherId"
                      value={formData.classTeacherId?.toString()}
                      onValueChange={(value) => handleSelectChange("classTeacherId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id.toString()}>
                            {teacher.firstName} {teacher.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      name="status"
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit">{isEditing ? "Update" : "Save"}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export { ManageClassesPage };
export default ManageClassesPage;
