import { GoogleLogo } from "phosphor-react";
import { FormEvent, useContext } from "react";
import { Context } from "../context/UserContext";

export function SignInForm() {
  const { SignIn } = useContext(Context);

  function handleGoogleSignIn(event: FormEvent) {
    event.preventDefault();
    SignIn();
  }

  return (
    <form className="w-full flex flex-col mt-6">
      <p className="font-semibold leading-tight">
        Faça login com sua conta do Google para começar
      </p>

      <button
        type="submit"
        className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-transparent border-2 border-zinc-500 hover:bg-zinc-800 hover:border-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-backgroud"
        onClick={handleGoogleSignIn}
      >
        <GoogleLogo size={20} weight="bold" />
        Entrar com Google
      </button>
    </form>
  );
}
