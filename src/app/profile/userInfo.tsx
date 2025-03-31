// components/UserInfoCard.tsx
import { Card, CardHeader, CardContent, CardTitle } from "@/src/components/ui/card";
import { UserCircle } from "lucide-react";

type User = {
  id: string;
  name?: string;
  email: string;
  role: string;
  branch_id?: number;
  contact?: string | null;
};

export default function UserInfoCard({ user }: { user: User }) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <UserCircle className="h-5 w-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500 text-sm">Name</p>
            <p className="font-medium">{user.name || "Not provided"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Contact</p>
            <p className="font-medium">{user.contact || 'Not provided'}</p>
          </div>
          {user.role !== 'owner' && user.branch_id && (
            <div>
              <p className="text-gray-500 text-sm">Branch ID</p>
              <p className="font-medium">{user.branch_id}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}