import Link, { LinkProps } from 'next/link'
import React from 'react'

export default function PrimaryLink(props: LinkProps & { children: React.ReactNode }) {
   return (
      <Link {...props} className="hover:text-cyan-500">
         {props.children}
      </Link>
   )
}
