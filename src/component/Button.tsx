import React from 'react'

export default function Button(props: React.ComponentPropsWithoutRef<"button">) {
  return (
    <button {...props} className="bg-blue-400 hover:bg-blue-600 rounded-md px-4 py-2">
      {props.children}
    </button>
  )
}
