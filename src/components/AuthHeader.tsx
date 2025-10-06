"use client"

import { useSession } from "next-auth/react"
import { hybridLogout } from '@/src/lib/logout';
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/src/components/ui/button"

export default function AuthHeader() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt="Profile"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
          )}
          <span className="text-sm font-medium">
            Welcome, {session.user?.name}
          </span>
        </div>
        <Button
          onClick={() => hybridLogout({ redirect: true })}
          variant="outline"
          size="sm"
        >
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <Link href="/login">
        <Button variant="outline" size="sm">
          Sign In
        </Button>
      </Link>
      <Link href="/register">
        <Button size="sm">
          Sign Up
        </Button>
      </Link>
    </div>
  )
}
