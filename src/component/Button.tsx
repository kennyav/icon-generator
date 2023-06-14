import React from 'react'
import clsx from 'clsx';

export default function Button(props: React.ComponentPropsWithoutRef<"button"> & { varient: 'primary' | 'secondary' }) {

  const color = 
  (props.varient ?? "primary") === 'primary'
    ? 'bg-blue-400 hover:bg-blue-600'
    : 'bg-gray-400 hover:bg-gray-600';
  return (
    <button {...props} className={clsx("rounded px-4 py-2", color)}>
      {props.children}
    </button>
  )
}
