import { useState } from "react";
import { Search, Edit, Trash2, Eye, UserPlus, Link as LinkIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { toast } from "sonner@2.0.3";

interface ManageParentsPageProps {
  onNavigateToLink?: () => void;
}

export function ManageParentsPage({ onNavigateToLink }: ManageParentsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const parents = [
    { 
      id: 1, 
      name: "Mr. Mohammed Ali", 
      email: "mohammed.ali@example.com", 
      phone: "08012345678", 
      linkedChildren: 2,
      status: "Active" 
    },
    { 
      id: 2, 
      name: "Dr. Yusuf Ibrahim", 
      email: "yusuf.ibrahim@example.com", 
      phone: "08023456789", 
      linkedChildren: 1,
      status: "Active" 
    },
    { 
      id: 3, 
      name: "Mrs. Hassan Zainab", 
      email: "hassan.zainab@example.com", 
      phone: "08034567890", 
      linkedChildren: 3,
      status: "Active" 
    },
    { 
      id: 4, 
      name: "Alhaji Abubakar Musa", 
      email: "abubakar.musa@example.com", 
      phone: "08045678901", 
      linkedChildren: 0,
      status: "Active" 
    },
  ];

  const handleEdit = (parentId: number) => {
    toast.info(`Editing parent ID: ${parentId}`);
  };

  const handleDelete = (parentId: number) => {
    toast.error(`Parent ID: ${parentId} removed`);
  };

  const handleView = (parentId: number) => {
    toast.info(`Viewing details for parent ID: ${parentId}`);
  };

  const handleLinkChild = () => {
    if (onNavigateToLink) {
      onNavigateToLink();
    } else {
      toast.info("Navigating to Link Student-Parent page");
    }
  };

  const filteredParents = parents.filter(parent =>
    parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-white mb-2">Manage Parents</h1>
        <p className="text-[#C0C8D3]">View, edit, and manage all registered parents/guardians</p>
      </div>

      <Card className="rounded-xl bg-[#132C4A] border border-white/10 shadow-lg">
        <CardHeader className="p-5 border-b border-white/10">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#C0C8D3]" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or phone..."
                className="h-12 pl-10 rounded-xl border border-white/10 bg-[#0F243E] text-white"
              />
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <Button 
                onClick={handleLinkChild}
                className="h-12 bg-[#28A745] hover:bg-[#28A745]/90 text-white rounded-xl shadow-md hover:scale-105 transition-all whitespace-nowrap"
              >
                <LinkIcon className="w-5 h-5 mr-2" />
                Link Child(ren)
              </Button>
              
              <Button className="h-12 bg-[#1E90FF] hover:bg-[#00BFFF] text-white rounded-xl shadow-md hover:scale-105 transition-all whitespace-nowrap">
                <UserPlus className="w-5 h-5 mr-2" />
                Add New
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-[#1E90FF] to-[#00BFFF] border-none hover:bg-gradient-to-r">
                  <TableHead className="text-white">Parent/Guardian Name</TableHead>
                  <TableHead className="text-white">Email</TableHead>
                  <TableHead className="text-white">Phone</TableHead>
                  <TableHead className="text-white">Linked Children</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParents.map((parent) => (
                  <TableRow key={parent.id} className="bg-[#0F243E] border-b border-white/5 hover:bg-[#132C4A]">
                    <TableCell className="text-white">{parent.name}</TableCell>
                    <TableCell className="text-[#C0C8D3]">{parent.email}</TableCell>
                    <TableCell className="text-[#C0C8D3]">{parent.phone}</TableCell>
                    <TableCell>
                      <Badge className={parent.linkedChildren > 0 ? "bg-[#28A745] text-white border-0" : "bg-[#DC3545] text-white border-0"}>
                        {parent.linkedChildren} {parent.linkedChildren === 1 ? "child" : "children"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-[#28A745] text-white border-0">
                        {parent.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          onClick={() => handleView(parent.id)}
                          size="sm"
                          className="h-8 w-8 p-0 bg-[#1E90FF] hover:bg-[#00BFFF] rounded-lg"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={handleLinkChild}
                          size="sm"
                          className="h-8 w-8 p-0 bg-[#28A745] hover:bg-[#28A745]/90 rounded-lg"
                          title="Link to Child"
                        >
                          <LinkIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleEdit(parent.id)}
                          size="sm"
                          className="h-8 w-8 p-0 bg-[#FFC107] hover:bg-[#FFC107]/90 rounded-lg"
                          title="Edit Parent"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(parent.id)}
                          size="sm"
                          className="h-8 w-8 p-0 bg-[#DC3545] hover:bg-[#DC3545]/90 rounded-lg"
                          title="Delete Parent"
                        >
                          <Trash2 className="w-4 h-4" />
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-xl bg-[#132C4A] border border-white/10 shadow-lg">
          <CardContent className="p-4">
            <p className="text-[#C0C8D3] mb-1">Total Parents</p>
            <p className="text-white">240</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl bg-[#132C4A] border border-white/10 shadow-lg">
          <CardContent className="p-4">
            <p className="text-[#C0C8D3] mb-1">With Linked Children</p>
            <p className="text-[#28A745]">213</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl bg-[#132C4A] border border-white/10 shadow-lg">
          <CardContent className="p-4">
            <p className="text-[#C0C8D3] mb-1">Without Links</p>
            <p className="text-[#FFC107]">27</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl bg-[#132C4A] border border-white/10 shadow-lg">
          <CardContent className="p-4">
            <p className="text-[#C0C8D3] mb-1">Active</p>
            <p className="text-[#1E90FF]">240</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
