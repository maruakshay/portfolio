"use client"
import Chat from "@/components/chat"
import { Suspense } from "react"

export default function ChatPage() {
  return (
    <div className="w-full h-screen bg-[#f8fafc]">
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center">Loading chat…</div>}>
        <Chat />
      </Suspense>
    </div>
  )
}