import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import Button from "~/component/Button";
import FormGroup from "~/component/FormGroup";
import { Input } from "~/component/Input";
import { api } from "~/utils/api";
import Image from "next/image";


const GeneratePage: NextPage = () => {
   const [form, setForm] = useState({
      prompt: "",
   });
   const [imageUrl, setImageUrl] = useState('');

   const generateIcon = api.generate.generateIcon.useMutation({
      onSuccess(data) {
         console.log("mutation finished", data.imageUrl);
         if (!data.imageUrl) return;
         setImageUrl(data.imageUrl);
      }
   });

   function handleFormSubmit(e: React.FormEvent) {
      e.preventDefault();
      // TODO: submit form data to the backend
      generateIcon.mutate({
         prompt: form.prompt,
      });

      setForm({
         prompt: "",
      });
   }

   function updateForm(key: string) {
      return function (e: React.ChangeEvent<HTMLInputElement>) {
         setForm(prev => ({
            ...prev,
            [key]: e.target.value,
         }))
      }
   }


   const session = useSession();
   const isLoggedIn = !!session.data;


   return (
      <>
         <Head>
            <title>Create T3 App</title>
            <meta name="description" content="Generated by create-t3-app" />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <main className="flex min-h-screen flex-col items-center justify-center">
            {!isLoggedIn && (
               <Button
                  varient="primary"
                  onClick={() => {
                     signIn().catch(console.error)
                  }}>
                  Login
               </Button>
            )}
            {session.data?.user?.name}
            <form
               className="flex flex-col gap-4"
               onSubmit={handleFormSubmit}
            >
               <FormGroup>
                  <label>Prompt</label>
                  <Input
                     value={form.prompt}
                     onChange={updateForm("prompt")
                     } />
               </FormGroup>
               <Button varient="primary">Submit</Button>
            </form>
            <Image
               src={imageUrl}
               alt="an image of your generated prompt"
               height="100"
               width="100" />
         </main>
      </>
   );
};

export default GeneratePage;

