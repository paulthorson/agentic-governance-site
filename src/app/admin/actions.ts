"use server";

import {signIn, signOut} from "@/auth";

export async function signInWithGoogle(formData?: FormData) {
  const callbackUrl =
    (formData?.get("callbackUrl") as string | null) || "/admin";
  await signIn("google", {redirectTo: callbackUrl});
}

export async function signOutAdmin() {
  await signOut({redirectTo: "/admin/login"});
}
