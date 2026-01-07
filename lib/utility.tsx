import React from "react"
import type { Components } from "react-markdown"
import { cn } from "@/lib/utils"

export function markdownComponents(): Components {
  return {
    h1: ({ node, ...props }) => (
      <h1
        className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mt-8 mb-4"
        {...props}
      />
    ),

    h2: ({ node, ...props }) => (
      <h2
        className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-10 mb-4"
        {...props}
      />
    ),

    h3: ({ node, ...props }) => (
      <h3
        className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3"
        {...props}
      />
    ),

    h4: ({ node, ...props }) => (
      <h4
        className="scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-2"
        {...props}
      />
    ),

    p: ({ node, ...props }) => (
      <p
        className="leading-7 text-foreground [&:not(:first-child)]:mt-4"
        {...props}
      />
    ),

    a: ({ node, href, ...props }) => (
      <a
        href={href}
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
        {...props}
      />
    ),

    blockquote: ({ node, ...props }) => (
      <blockquote
        className="mt-6 border-l-2 pl-6 italic text-muted-foreground"
        {...props}
      />
    ),

    ul: ({ node, ...props }) => (
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props} />
    ),

    ol: ({ node, ...props }) => (
      <ol className="my-6 ml-6 list-decimal [&>li]:mt-2" {...props} />
    ),

    li: ({ node, ...props }) => (
      <li className="text-foreground" {...props} />
    ),

    hr: () => <hr className="my-8 border-muted" />,

    img: ({ node, ...props }) => (
      <img
        className="rounded-lg border my-6 max-w-full"
        alt={props.alt ?? ""}
        {...props}
      />
    ),

    table: ({ node, ...props }) => (
      <div className="my-6 w-full overflow-y-auto">
        <table className="w-full border-collapse" {...props} />
      </div>
    ),

    thead: ({ node, ...props }) => (
      <thead className="bg-muted" {...props} />
    ),

    tr: ({ node, ...props }) => (
      <tr
        className="border-b transition-colors hover:bg-muted/50"
        {...props}
      />
    ),

    th: ({ node, ...props }) => (
      <th
        className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
        {...props}
      />
    ),

    td: ({ node, ...props }) => (
      <td className="p-4 align-middle" {...props} />
    ),
  }
}
