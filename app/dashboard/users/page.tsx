"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { userClient } from "@/lib/api-client"
import type { User } from "@/lib/types"
import { UsersClient } from "@/components/users-client"
import { UsersSkeleton } from "@/components/users-skeleton"
import { UserFilters } from "@/components/dashboard/users/user-filters"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await userClient.getUsers()
        setUsers(data)
      } catch (err) {
        setError("Failed to load users")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <UsersSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <div className="rounded-md border border-destructive p-4">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    )
  }

  // Filter users based on role and search query
  const filteredUsers = users.filter((user) => {
    const matchesFilter = filter === "all" || user.role === filter
    const matchesSearch =
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <UserFilters
            filter={filter}
            searchQuery={searchQuery}
            setFilter={setFilter}
            setSearchQuery={setSearchQuery}
          />
          <UsersClient initialUsers={filteredUsers} />
        </CardContent>
      </Card>
    </div>
  )
}
