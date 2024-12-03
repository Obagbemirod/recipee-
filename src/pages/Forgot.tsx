import { zodResolver } from "@hookform/resolvers/zod";


const Forgot = () => {


  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Change Password</h2>
          <p className="text-muted-foreground mt-2">
            Enter your New Password and follow the instructions to reset your password...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Forgot;
