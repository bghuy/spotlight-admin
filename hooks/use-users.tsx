"use client"

import { useState } from "react"
import type { User } from "@/lib/types"
import { updateUserRole, updateUserStatus } from "@/lib/actions"
import { toast } from "@/hooks/use-toast"

export function useUsers(initialUsers: User[]) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})
  const [filter, setFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const handleUpdateRole = async (id: string, role: User["role"]) => {
    setIsLoading((prev) => ({ ...prev, [id]: true }))

    try {
      const result = await updateUserRole(id, role)

      if (result.success) {
        setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, role } : user)))
        toast({
          title: "Role updated",
          description: `User role has been updated to ${role}.`,
        })
      } else {
        throw new Error(result.error || "Failed to update user role")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "An error occurred while updating the user role.",
        variant: "destructive",
      })
    } finally {
      setIsLoading((prev) => ({ ...prev, [id]: false }))
    }
  }

  const handleUpdateStatus = async (id: string, status: User["status"]) => {
    setIsLoading((prev) => ({ ...prev, [id]: true }))

    try {
      const result = await updateUserStatus(id, status)

      if (result.success) {
        setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, status } : user)))
        toast({
          title: "Status updated",
          description: `User status has been updated to ${status}.`,
        })
      } else {
        throw new Error(result.error || "Failed to update user status")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "An error occurred while updating the user status.",
        variant: "destructive",
      })
    } finally {
      setIsLoading((prev) => ({ ...prev, [id]: false }))
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesFilter = filter === "all" || user.role === filter
    const matchesSearch =
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  return {
    users: filteredUsers,
    isLoading,
    filter,
    searchQuery,
    setFilter,
    setSearchQuery,
    handleUpdateRole,
    handleUpdateStatus,
  }
}
