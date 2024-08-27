import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to ChatGPT Clone</h1>
        <p className="text-xl text-gray-600 mb-6">Experience the power of AI conversation!</p>
        <Button asChild className="bg-usermsg hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
          <Link to="/chat">Start Chatting</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
