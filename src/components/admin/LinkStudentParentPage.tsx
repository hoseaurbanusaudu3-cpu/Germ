import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Users, Link, Search, User, Hash, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useSchool } from "../../contexts/SchoolContext";

export function LinkStudentParentPage() {
  const { students, parents, linkStudentToParent, unlinkStudentFromParent } = useSchool();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [selectedParent, setSelectedParent] = useState<number | null>(null);
  const [relationship, setRelationship] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredParents = parents.filter(parent =>
    parent.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLink = async () => {
    if (!selectedStudent || !selectedParent || !relationship) {
      toast.error("Please select student, parent, and relationship type");
      return;
    }

    try {
      setIsSubmitting(true);
      linkStudentToParent(selectedStudent, selectedParent, relationship);
      toast.success("Student linked to parent successfully!");
      
      // Reset form
      setSelectedStudent(null);
      setSelectedParent(null);
      setRelationship("");
      setSearchTerm("");
    } catch (error) {
      toast.error("Failed to link student to parent");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnlink = async (studentId: number, parentId: number) => {
    try {
      unlinkStudentFromParent(studentId, parentId);
      toast.success("Student unlinked from parent successfully!");
    } catch (error) {
      toast.error("Failed to unlink student from parent");
    }
  };

  const getExistingLinks = () => {
    const links: Array<{studentId: number, parentId: number, relationship: string}> = [];
    
    students.forEach(student => {
      if (student.parents && student.parents.length > 0) {
        student.parents.forEach(parentLink => {
          links.push({
            studentId: student.id,
            parentId: parentLink.parentId,
            relationship: parentLink.relationship
          });
        });
      }
    });

    return links;
  };

  const existingLinks = getExistingLinks();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Link Students to Parents</h2>
        <p className="text-muted-foreground">
          Manage student-parent relationships and guardianship
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Students or Parents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, admission number, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Link Form */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Student Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Select Student
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select
                value={selectedStudent?.toString() || ""}
                onValueChange={(value: string) => setSelectedStudent(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a student" />
                </SelectTrigger>
                <SelectContent>
                  {filteredStudents.map(student => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{student.firstName} {student.lastName}</div>
                          <div className="text-sm text-muted-foreground">
                            <Badge variant="outline">{student.admissionNumber}</Badge>
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedStudent && (
                <div className="p-4 bg-muted rounded-lg">
                  {(() => {
                    const student = students.find(s => s.id === selectedStudent);
                    return student ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{student.firstName} {student.lastName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-muted-foreground" />
                          <span>{student.admissionNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{student.class}</Badge>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Parent Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Select Parent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select
                value={selectedParent?.toString() || ""}
                onValueChange={(value: string) => setSelectedParent(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a parent" />
                </SelectTrigger>
                <SelectContent>
                  {filteredParents.map(parent => (
                    <SelectItem key={parent.id} value={parent.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{parent.firstName} {parent.lastName}</div>
                          <div className="text-sm text-muted-foreground">{parent.email}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedParent && (
                <div className="p-4 bg-muted rounded-lg">
                  {(() => {
                    const parent = parents.find(p => p.id === selectedParent);
                    return parent ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{parent.firstName} {parent.lastName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{parent.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{parent.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{parent.address}</span>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Relationship Type */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Relationship Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {["Father", "Mother", "Guardian", "Other"].map(type => (
              <Button
                key={type}
                variant={relationship === type.toLowerCase() ? "default" : "outline"}
                onClick={() => setRelationship(type.toLowerCase())}
              >
                {type}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Link Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleLink}
          disabled={!selectedStudent || !selectedParent || !relationship || isSubmitting}
          className="flex items-center gap-2"
        >
          <Link className="h-4 w-4" />
          {isSubmitting ? "Linking..." : "Link Student to Parent"}
        </Button>
      </div>

      {/* Existing Links */}
      {existingLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Existing Student-Parent Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {existingLinks.map((link, index) => {
                const student = students.find(s => s.id === link.studentId);
                const parent = parents.find(p => p.id === link.parentId);
                
                if (!student || !parent) return null;
                
                return (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{student.firstName} {student.lastName}</span>
                        <Badge variant="outline">{student.admissionNumber}</Badge>
                      </div>
                      <Link className="h-4 w-4 text-muted-foreground" />
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{parent.firstName} {parent.lastName}</span>
                        <Badge variant="secondary">{link.relationship}</Badge>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleUnlink(link.studentId, link.parentId)}
                    >
                      Unlink
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
