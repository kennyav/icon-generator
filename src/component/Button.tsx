import React from 'react'
import clsx from 'clsx';
import Spinner from './Spinner';

export default function Button(
  props: React.ComponentPropsWithoutRef<"button"> & { 
    varient: "primary" | "secondary" 
    isLoading?: boolean
  }) {

  const color = 
  (props.varient ?? "primary") === "primary"
    ? "bg-blue-400 hover:bg-blue-600"
    : "bg-gray-400 hover:bg-gray-600";
  return (
    <button {...props} className={clsx("flex gap-2 items-center justify-center rounded px-4 py-2 disabled:bg-gray-600", color)}>
      {props.isLoading && <Spinner />}
      {props.children}
    </button>
  )
}
