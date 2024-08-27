import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to ChatGPT Clone</h1>
        <p className="text-xl text-gray-600 mb-6">Experience the power of AI conversation!</p>
        <Button asChild>
          <Link to="/chat">Start Chatting</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
