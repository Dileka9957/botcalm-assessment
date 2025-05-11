import { Link } from 'react-router-dom';
import { useCallback } from 'react';
import useAuthStore from '@/stores/authStore';

// Import shadcn components
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const AppNavbar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <div className="border-b bg-slate-950 text-white">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Brand */}
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold">
            Book Management
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList className="hidden lg:flex">
              {user && (
                <>
                  <NavigationMenuItem>
                    <Link
                      to="/"
                      className="text-sm font-medium px-4 py-2 hover:text-slate-300 transition-colors"
                    >
                      Books
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link
                      to="/books/add"
                      className="text-sm font-medium px-4 py-2 hover:text-slate-300 transition-colors"
                    >
                      Add Book
                    </Link>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center space-x-2">
            {user ? (
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-white text-white hover:bg-slate-800"
              >
                Logout
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-slate-800"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-slate-800"
                  >
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 bg-slate-950 text-white">
              <nav className="flex flex-col space-y-4 mt-6">
                {user && (
                  <>
                    <SheetClose asChild>
                      <Link
                        to="/"
                        className="px-4 py-2 hover:bg-slate-800 rounded-md"
                      >
                        Books
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        to="/books/add"
                        className="px-4 py-2 hover:bg-slate-800 rounded-md"
                      >
                        Add Book
                      </Link>
                    </SheetClose>
                  </>
                )}
                {user ? (
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="border-white text-white hover:bg-slate-800 mt-4"
                  >
                    Logout
                  </Button>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Link
                        to="/login"
                        className="px-4 py-2 hover:bg-slate-800 rounded-md"
                      >
                        Login
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        to="/register"
                        className="px-4 py-2 hover:bg-slate-800 rounded-md"
                      >
                        Register
                      </Link>
                    </SheetClose>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default AppNavbar;
