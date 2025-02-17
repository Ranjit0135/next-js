"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        sign In as {session.user.email}
        <button onClick={() => signOut()}>signOut</button>;
      </>
    );
  }

  return (
    <>
      not sign in
      <br />
      <button
        className=" bg-orange-500 p-3 px-3 py-1 m-4 rounded"
        onClick={() => signIn()}
      >
        Sign In
      </button>
    </>
  );
}
