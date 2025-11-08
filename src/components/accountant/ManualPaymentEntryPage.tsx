import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { DollarSign, Search, Plus, Edit, Trash2, Save, X, Receipt, CreditCard, Banknote } from "lucide-react";
import { toast } from "sonner";
import { useSchool } from "../../contexts/SchoolContext";

interface PaymentEntry {
  id: number;
  studentId: number;
  studentName: string;
  className: string;
  amount: number;
  paymentMethod: "cash" | "bank_transfer" | "cheque";
  paymentDate: string;
  termId: number;
  sessionId: number;
  referenceNumber?: string;
  bankName?: string;
  notes?: string;
  recordedBy: string;
  recordedAt: string;
}

export function ManualPaymentEntryPage() {
  const { students, classes, currentTerm, currentAcademicYear, currentUser, addPayment } = useSchool();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    amount: "",
    paymentMethod: "cash" as "cash" | "bank_transfer" | "cheque",
    paymentDate: new Date().toISOString().split('T')[0],
    referenceNumber: "",
    bankName: "",
    notes: ""
  });

  // Mock payment history (in real app, this would come from backend)
  const [paymentHistory, setPaymentHistory] = useState<PaymentEntry[]>([]);

  // Filter students based on search
  const filteredStudents = students.filter(student => 
    student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStudentSelect = (student: any) => {
    setSelectedStudent(student);
    setSearchQuery("");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      amount: "",
      paymentMethod: "cash",
      paymentDate: new Date().toISOString().split('T')[0],
      referenceNumber: "",
      bankName: "",
      notes: ""
    });
    setSelectedStudent(null);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!selectedStudent) {
      toast.error("Please select a student");
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (formData.paymentMethod === "bank_transfer" && !formData.referenceNumber) {
      toast.error("Please enter reference number for bank transfer");
      return;
    }

    const studentClass = classes.find(c => c.id === selectedStudent.classId);
    
    const newPayment: PaymentEntry = {
      id: isEditing ? editingId! : Date.now(),
      studentId: selectedStudent.id,
      studentName: `${selectedStudent.firstName} ${selectedStudent.lastName}`,
      className: studentClass?.name || "N/A",
      amount: parseFloat(formData.amount),
      paymentMethod: formData.paymentMethod,
      paymentDate: formData.paymentDate,
      termId: currentTerm?.id || 0,
      sessionId: currentAcademicYear?.id || 0,
      referenceNumber: formData.referenceNumber || undefined,
      bankName: formData.bankName || undefined,
      notes: formData.notes || undefined,
      recordedBy: currentUser?.name || "Accountant",
      recordedAt: new Date().toISOString()
    };

    if (isEditing) {
      setPaymentHistory(prev => 
        prev.map(p => p.id === editingId ? newPayment : p)
      );
      toast.success("Payment record updated successfully");
    } else {
      setPaymentHistory(prev => [newPayment, ...prev]);
      
      // Add to SchoolContext
      addPayment({
        id: newPayment.id,
        studentId: newPayment.studentId,
        amount: newPayment.amount,
        paymentMethod: newPayment.paymentMethod,
        paymentDate: newPayment.paymentDate,
        termId: newPayment.termId,
        sessionId: newPayment.sessionId,
        referenceNumber: newPayment.referenceNumber,
        status: "completed",
        recordedBy: newPayment.recordedBy,
        notes: newPayment.notes
      });

      toast.success("Payment recorded successfully");
    }

    resetForm();
  };

  const handleEdit = (payment: PaymentEntry) => {
    setSelectedStudent(students.find(s => s.id === payment.studentId));
    setFormData({
      amount: payment.amount.toString(),
      paymentMethod: payment.paymentMethod,
      paymentDate: payment.paymentDate,
      referenceNumber: payment.referenceNumber || "",
      bankName: payment.bankName || "",
      notes: payment.notes || ""
    });
    setIsEditing(true);
    setEditingId(payment.id);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this payment record?")) {
      setPaymentHistory(prev => prev.filter(p => p.id !== id));
      toast.success("Payment record deleted");
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "cash":
        return <Banknote className="h-4 w-4" />;
      case "bank_transfer":
        return <CreditCard className="h-4 w-4" />;
      case "cheque":
        return <Receipt className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const totalRecorded = paymentHistory.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Manual Payment Entry</h2>
        <p className="text-muted-foreground">
          Record cash and bank transfer payments manually
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recorded Today</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{paymentHistory
                .filter(p => p.paymentDate === new Date().toISOString().split('T')[0])
                .reduce((sum, p) => sum + p.amount, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {paymentHistory.filter(p => p.paymentDate === new Date().toISOString().split('T')[0]).length} payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Payments</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{paymentHistory
                .filter(p => p.paymentMethod === "cash")
                .reduce((sum, p) => sum + p.amount, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {paymentHistory.filter(p => p.paymentMethod === "cash").length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bank Transfers</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{paymentHistory
                .filter(p => p.paymentMethod === "bank_transfer")
                .reduce((sum, p) => sum + p.amount, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {paymentHistory.filter(p => p.paymentMethod === "bank_transfer").length} transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Entry Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {isEditing ? "Edit Payment Record" : "New Payment Entry"}
          </CardTitle>
          <CardDescription>
            Enter payment details for cash or bank transfer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Student Selection */}
          <div className="space-y-2">
            <Label>Select Student *</Label>
            {selectedStudent ? (
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedStudent.admissionNumber} • {classes.find(c => c.id === selectedStudent.classId)?.name}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedStudent(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or admission number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {searchQuery && (
                  <div className="border rounded-lg max-h-48 overflow-y-auto">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map(student => (
                        <div
                          key={student.id}
                          className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                          onClick={() => handleStudentSelect(student)}
                        >
                          <p className="font-medium">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {student.admissionNumber} • {classes.find(c => c.id === student.classId)?.name}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="p-4 text-center text-muted-foreground">No students found</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₦) *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => handleInputChange("paymentMethod", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Date */}
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Payment Date *</Label>
              <Input
                id="paymentDate"
                type="date"
                value={formData.paymentDate}
                onChange={(e) => handleInputChange("paymentDate", e.target.value)}
              />
            </div>

            {/* Reference Number (for bank transfers) */}
            {formData.paymentMethod === "bank_transfer" && (
              <div className="space-y-2">
                <Label htmlFor="referenceNumber">Reference Number *</Label>
                <Input
                  id="referenceNumber"
                  placeholder="TRX123456789"
                  value={formData.referenceNumber}
                  onChange={(e) => handleInputChange("referenceNumber", e.target.value)}
                />
              </div>
            )}

            {/* Bank Name (for bank transfers) */}
            {formData.paymentMethod === "bank_transfer" && (
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  placeholder="e.g., First Bank"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange("bankName", e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes about this payment..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? "Update Payment" : "Record Payment"}
            </Button>
            {(isEditing || selectedStudent) && (
              <Button variant="outline" onClick={resetForm}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payment Records</CardTitle>
          <CardDescription>
            View and manage manually recorded payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paymentHistory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Recorded By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentHistory.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{payment.studentName}</TableCell>
                    <TableCell>{payment.className}</TableCell>
                    <TableCell className="font-semibold">₦{payment.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        {getPaymentMethodIcon(payment.paymentMethod)}
                        {payment.paymentMethod.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {payment.referenceNumber || "-"}
                    </TableCell>
                    <TableCell className="text-sm">{payment.recordedBy}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(payment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(payment.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No payment records yet</p>
              <p className="text-sm text-muted-foreground">Start by recording a new payment above</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
