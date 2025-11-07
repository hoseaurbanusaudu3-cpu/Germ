import { useState } from "react";
import { School, User, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader } from "./ui/card";
import schoolLogo from "figma:asset/0f38946e273b623e7cb0b865c2f2fe194a9e92ea.png";

interface LoginPageProps {
  onLogin: (role: string) => void;
  onNavigateToLanding: () => void;
}

export function LoginPage({ onLogin, onNavigateToLanding }: LoginPageProps) {
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);

  const credentials = {
    admin: { id: "admin@graceland.edu.ng", password: "admin2024" },
    teacher: { id: "teacher@graceland.edu.ng", password: "teacher2024" },
    accountant: { id: "accountant@graceland.edu.ng", password: "account2024" },
    parent: { id: "parent@graceland.edu.ng", password: "parent2024" },
  };

  const handleLogin = () => {
    if (role && userId && password) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        onLogin(role);
      }, 1000);
    }
  };

  const handleQuickLogin = (selectedRole: string) => {
    const cred = credentials[selectedRole as keyof typeof credentials];
    setRole(selectedRole);
    setUserId(cred.id);
    setPassword(cred.password);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && role && userId && password) {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2540] via-[#0d3558] to-[#0A2540] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div 
            onClick={onNavigateToLanding}
            className="w-24 h-24 rounded-full bg-white flex items-center justify-center mx-auto mb-4 cursor-pointer hover:shadow-2xl transition-all hover:scale-110 shadow-xl p-2.5 ring-4 ring-[#FFD700]/30"
          >
            <img 
              src={schoolLogo} 
              alt="Graceland Royal Academy Logo" 
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <h1 className="text-3xl text-white mb-2">Graceland Royal Academy</h1>
          <p className="text-[#FFD700] italic">Wisdom & Illumination</p>
        </div>

        {/* Login Card */}
        <Card className="rounded-2xl shadow-2xl border-0 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="bg-white pb-6 pt-8">
            <h2 className="text-center text-[#0A2540]">Portal Login</h2>
            <p className="text-center text-gray-600 text-sm">Select your role and enter credentials</p>
          </CardHeader>
          
          <CardContent className="bg-white p-8 space-y-6" onKeyPress={handleKeyPress}>
            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-[#0A2540]">Select Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger 
                  id="role"
                  className="h-12 rounded-xl border-2 border-gray-200 focus:border-[#FFD700] transition-colors"
                >
                  <SelectValue placeholder="Choose your role" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="admin" className="rounded-lg">Admin</SelectItem>
                  <SelectItem value="teacher" className="rounded-lg">Teacher</SelectItem>
                  <SelectItem value="accountant" className="rounded-lg">Accountant</SelectItem>
                  <SelectItem value="parent" className="rounded-lg">Parent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* User ID / Email */}
            <div className="space-y-2">
              <Label htmlFor="userId" className="text-[#0A2540]">User ID / Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="userId"
                  type="text"
                  placeholder="Enter your ID or email"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="h-12 pl-11 rounded-xl border-2 border-gray-200 focus:border-[#FFD700] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#0A2540]">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pl-11 rounded-xl border-2 border-gray-200 focus:border-[#FFD700] transition-colors"
                />
              </div>
            </div>

            {/* Login Button */}
            <Button
              onClick={handleLogin}
              disabled={!role || !userId || !password || isLoading}
              className="w-full h-12 bg-[#FFD700] text-[#0A2540] hover:bg-[#FFD700]/90 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              {isLoading ? "Logging in..." : "Login to Portal"}
            </Button>

            {/* Back to Home */}
            <div className="text-center pt-4">
              <button
                onClick={onNavigateToLanding}
                className="text-sm text-[#0A2540] hover:text-[#FFD700] transition-colors hover:underline"
              >
                ← Back to Home
              </button>
            </div>

            {/* Test Credentials Toggle */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowCredentials(!showCredentials)}
                className="w-full text-sm text-gray-600 hover:text-[#0A2540] transition-colors"
              >
                {showCredentials ? "Hide" : "Show"} Test Credentials
              </button>
            </div>

            {/* Credentials Display */}
            {showCredentials && (
              <div className="space-y-3 pt-4 animate-in fade-in slide-in-from-top-2">
                <p className="text-xs text-gray-500 text-center mb-3">Click to auto-fill credentials</p>
                
                {Object.entries(credentials).map(([roleKey, cred]) => (
                  <button
                    key={roleKey}
                    onClick={() => handleQuickLogin(roleKey)}
                    className="w-full p-3 bg-gray-50 hover:bg-[#FFD700]/10 border-2 border-gray-200 hover:border-[#FFD700] rounded-xl text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-[#0A2540] capitalize group-hover:text-[#0A2540]">
                        {roleKey}
                      </p>
                      <span className="text-xs text-gray-500 group-hover:text-[#0A2540]">Click to use</span>
                    </div>
                    <p className="text-xs text-gray-600">Email: {cred.id}</p>
                    <p className="text-xs text-gray-600">Password: {cred.password}</p>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Note */}
        <p className="text-center text-white/60 text-sm mt-6">
          Secure login portal for authorized users only
        </p>
      </div>
    </div>
  );
}