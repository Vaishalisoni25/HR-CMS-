'use client';


import { useEffect, useState } from "react";
import { useSelector, UseSelector } from "react-redux";
import { useRouter } from "next/navigation";
import SignInForm from "@/components/auth/sign-in-form";

export default function Page() {
  const router = useRouter();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [authChecked, setAuthChecked] = useState(false);
  const loading = useSelector((state: any) => state.auth.loading);

  useEffect (() => {
 if (!loading) {
    if (isAuthenticated) {
      router.push('/dashboard'); // redirect if already logged in
    } else {
      setAuthChecked(true); // show login form if not authenticated
    }
  }
  }, [isAuthenticated, loading]);

   if (!authChecked) {
    return null; 
  }

  return <SignInForm/>;
}
