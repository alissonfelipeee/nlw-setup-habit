import { Header } from "./components/Header";
import { UserProvider } from "./context/UserContext";
import { Home } from "./pages/Home";

export function App() {
  return (
    <UserProvider>
      <div className="w-screen h-screen flex flex-col gap-8">
        <Header />
        <Home />
      </div>
    </UserProvider>
  );
}
