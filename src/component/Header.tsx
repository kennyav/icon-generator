import React, { useState } from "react";
import PrimaryLink from './PrimaryLink'
import { signIn, signOut, useSession } from 'next-auth/react'
import Button from './Button';
import { useBuyCredits } from '~/hooks/useBuyCredits';
import { api } from "~/utils/api";

export default function Header() {

   const [isNavOpen, setIsNavOpen] = useState(false);
   const { buyCredits } = useBuyCredits();
   const credits = api.user.getCredits.useQuery();


   const session = useSession();
   const isLoggedIn = !!session.data;

   return (
      <header className="container flex mx-auto px-2 shadow-md justify-between items-center h-16 text-gray-700 dark:bg-gray-300 rounded-md">
         <PrimaryLink href={'/'}>Icon Generator</PrimaryLink>
         <ul className="flex justify-between">
            <li className="ml-5"><PrimaryLink href={"/generate"}>Generate</PrimaryLink></li>
            <li className="ml-5"><PrimaryLink href={"/generatePixar"}>Generate Disney Pixar</PrimaryLink></li>
            {isLoggedIn && <li className="ml-5"><PrimaryLink href={"/collection"}>Collection</PrimaryLink></li>}
         </ul>
         <nav>
            <section className="MOBILE-MENU flex lg:hidden">
               <div
                  className="HAMBURGER-ICON space-y-2"
                  onClick={() => setIsNavOpen((prev) => !prev)}
               >
                  <span className="rounded block h-0.5 w-8 animate-pulse bg-gray-600"></span>
                  <span className="rounded block h-0.5 w-8 animate-pulse bg-gray-600"></span>
                  <span className="rounded block h-0.5 w-8 animate-pulse bg-gray-600"></span>
               </div>

               <div className={isNavOpen ? "showMenuNav" : "hideMenuNav"}>
                  <div
                     className="absolute top-0 right-0 px-8 py-8"
                     onClick={() => setIsNavOpen(false)}
                  >
                     <svg
                        className="h-8 w-8 text-gray-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                     >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                     </svg>
                  </div>
                  <ul className="flex flex-col items-center justify-between gap-4 align-left">
                     {isLoggedIn && <>
                        <p className="text-gray-700">Credits Remaining: {credits.data}</p>
                        <li>
                           <Button
                              variant="primary"
                              onClick={() => {
                                 buyCredits().catch(console.error);
                              }}>
                              Buy Credits
                           </Button>
                        </li>
                        <li>
                           <Button
                              variant="secondary"
                              onClick={() => void signOut()}>
                              Logout
                           </Button>
                        </li>
                     </>}
                     {!isLoggedIn &&
                        <li>
                           <Button
                              variant="primary"
                              onClick={() => void signIn()}>
                              Login
                           </Button>
                        </li>}
                  </ul>
               </div>
            </section>

            <ul className="DESKTOP-MENU hidden space-x-8 lg:flex">
               {isLoggedIn && <>
                  <div className="flex justify-center items-center">
                     <p className="text-gray-700">Credits Remaining: {credits.data}</p>
                  </div>
                  <li>
                     <Button
                        variant="primary"
                        onClick={() => {
                           buyCredits().catch(console.error);
                        }}>
                        Buy Credits
                     </Button>
                  </li>
                  <li>
                     <Button
                        variant="secondary"
                        onClick={() => void signOut()}>
                        Logout
                     </Button>
                  </li>
               </>}
               {!isLoggedIn &&
                  <li>
                     <Button
                        variant="primary"
                        onClick={() => void signIn()}>
                        Login
                     </Button>
                  </li>}
            </ul>
         </nav>
         <style>{`
      .hideMenuNav {
        display: none;
      }
      .showMenuNav {
        display: block;
        position: absolute;
        width: 100%;
        height: 100vh;
        top: 0;
        left: 0;
        background: white;
        z-index: 10;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
      }
    `}</style>
      </header>
   );
}

