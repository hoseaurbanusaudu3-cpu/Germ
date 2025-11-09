import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { SimpleClassForm } from "./SimpleClassForm";
import { SimpleSubjectForm } from "./SimpleSubjectForm";
import { Plus } from "lucide-react";

export function TestFormsPage() {
  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);

  // Mock teachers data for testing
  const mockTeachers = [
    { id: 1, firstName: "John", lastName: "Doe" },
    { id: 2, firstName: "Jane", lastName: "Smith" },
    { id: 3, firstName: "Ahmed", lastName: "Hassan" },
  ];

  const handleClassSuccess = () => {
    console.log("Class created successfully!");
    setIsClassDialogOpen(false);
  };

  const handleSubjectSuccess = () => {
    console.log("Subject created successfully!");
    setIsSubjectDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2540] via-[#1E3A5F] to-[#0A2540] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🧪 Form Testing Page
          </h1>
          <p className="text-gray-300">
            Test the new simple forms for typing issues
          </p>
        </div>

        {/* Test Instructions */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">📋 Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="text-white space-y-2">
            <p><strong>✅ What to Test:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Click "Test Create Class" button</li>
              <li>Try typing "JSS 1 A" in the Class Name field</li>
              <li>Type continuously without stopping</li>
              <li>Check if cursor stays in the input field</li>
              <li>Try the same with "Test Create Subject"</li>
            </ul>
            <p className="mt-4"><strong>✅ Expected Result:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Typing should be smooth and continuous</li>
              <li>No jumping to dropdowns</li>
              <li>No single-character limitation</li>
              <li>Works on both desktop and mobile</li>
            </ul>
          </CardContent>
        </Card>

        {/* Test Buttons */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Test Class Form */}
          <Card className="bg-white/10 border-white/20 hover:bg-white/20 transition-all">
            <CardContent className="p-6 text-center space-y-4">
              <div className="text-6xl">🏫</div>
              <h3 className="text-xl font-bold text-white">Test Create Class</h3>
              <p className="text-gray-300 text-sm">
                Test the new class creation form
              </p>
              <Button
                onClick={() => setIsClassDialogOpen(true)}
                className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#0A2540] font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Open Class Form
              </Button>
            </CardContent>
          </Card>

          {/* Test Subject Form */}
          <Card className="bg-white/10 border-white/20 hover:bg-white/20 transition-all">
            <CardContent className="p-6 text-center space-y-4">
              <div className="text-6xl">📚</div>
              <h3 className="text-xl font-bold text-white">Test Create Subject</h3>
              <p className="text-gray-300 text-sm">
                Test the new subject creation form
              </p>
              <Button
                onClick={() => setIsSubjectDialogOpen(true)}
                className="w-full bg-[#1E90FF] hover:bg-[#1E90FF]/90 text-white font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Open Subject Form
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Status Card */}
        <Card className="bg-green-500/20 border-green-500/50">
          <CardContent className="p-4">
            <p className="text-green-300 text-center">
              ✅ <strong>Forms are ready for testing!</strong> Try typing continuously in the input fields.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Class Form Dialog */}
      <Dialog open={isClassDialogOpen} onOpenChange={setIsClassDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Class</DialogTitle>
          </DialogHeader>
          <SimpleClassForm
            onClose={() => setIsClassDialogOpen(false)}
            onSuccess={handleClassSuccess}
            teachers={mockTeachers}
          />
        </DialogContent>
      </Dialog>

      {/* Subject Form Dialog */}
      <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
        <DialogContent className="max-w-2xl bg-[#132C4A] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Subject</DialogTitle>
          </DialogHeader>
          <SimpleSubjectForm
            onClose={() => setIsSubjectDialogOpen(false)}
            onSuccess={handleSubjectSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
