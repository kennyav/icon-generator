import clsx from 'clsx'
import type { LinkProps } from 'next/link'
import Link from 'next/link'
import React from 'react'

export default function PrimaryLinkButton(props: LinkProps & { children: React.ReactNode; className?: string }) {

   const { className, ...propsWithoutClassName } = props;
   return (
      <Link
         className={clsx(
            "rounded bg-blue-400 px-4 py-2 hover:bg-blue-600",
            className ?? "")}
         {...propsWithoutClassName}
      >
         {props.children}
      </Link>
   )
}
