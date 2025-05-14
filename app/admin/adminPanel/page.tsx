"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // Added DialogDescription
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import RoleBasedAccess from "@/app/components/RoleBasedAccess";
import { Loader2 } from "lucide-react"; // Import for loading spinner
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
}

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Fetch all users when component mounts
  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/users");
        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.statusText}`);
        }
        const data = await response.json();
        setUsers(data);
        setError(null);
      } catch (err: any) {
        setError(`Error loading users: ${err.message}`);
        console.error("Failed to load users:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  // Handle user role change
  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!newRole) {
      toast.error("Role selection required");
      return;
    }

    try {
      setIsUpdating(true);
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update user role");
      }

      // Update local state with the new role
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      // Show success message
      toast.success("Role updated");

      // Close the dialog
      setSelectedUser(null);
    } catch (err: any) {
      // Display an error toast with a descriptive message
      toast.error(`Error updating role: ${err.message}`);
      console.error("Role update failed:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const openRoleDialog = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
  };

  return (
    <RoleBasedAccess allowedRoles={["admin"]} fallback={<NotAuthorized />}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Admin Panel</h1>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <p className="text-red-700">{error}</p>
            <Button
              variant="outline"
              className="mt-2 text-sm"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              // Handle empty state
              <div className="py-8 text-center text-muted-foreground">
                <p>No users found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {/* Handle image loading errors with onError */}
                          {user.image && (
                            <img
                              className="h-10 w-10 rounded-full bg-muted object-cover"
                              src={user.image}
                              alt={`${user.name}'s avatar`}
                              onError={(e) => {
                                // Replace broken image with a fallback
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          )}
                          <div className={user.image ? "ml-4" : ""}>
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || "Unnamed User"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "editor"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRoleDialog(user)}
                        >
                          Edit Role
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Fixed dialog structure - moved DialogFooter inside DialogContent */}
        {selectedUser && (
          <Dialog
            open={!!selectedUser}
            onOpenChange={(open) => !open && setSelectedUser(null)}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Change User Role</DialogTitle>
                <DialogDescription>
                  Update the permission level for this user
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-2">
                  {selectedUser.image && (
                    <img
                      className="h-12 w-12 rounded-full bg-muted object-cover"
                      src={selectedUser.image}
                      alt={`${selectedUser.name}'s avatar`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}
                  <div>
                    <p className="font-medium">{selectedUser.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Select Role
                  </label>
                  <Select
                    value={selectedRole}
                    onValueChange={(value) => setSelectedRole(value)}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSelectedUser(null)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    handleRoleChange(selectedUser.id, selectedRole)
                  }
                  disabled={isUpdating || selectedRole === selectedUser.role}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </RoleBasedAccess>
  );
}

function NotAuthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2 text-gray-600">
          You do not have permission to view this page.
        </p>
        <div className="mt-6">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
