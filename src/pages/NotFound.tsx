import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">頁面不存在</h2>
          <p className="text-muted-foreground">
            抱歉，您所訪問的頁面不存在或已被移動
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          <Button asChild variant="outline">
            <Link to="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              回到首頁
            </Link>
          </Button>
          <Button 
            onClick={() => window.history.back()}
            variant="ghost"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回上頁
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
