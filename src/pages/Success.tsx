import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    jumbleberry: any;
  }
}

const Success = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const transactionId = searchParams.get('transaction_id') || '';
  const orderValue = searchParams.get('order_value') || '';

  useEffect(() => {
    // Track the purchase event with Jumbleberry
    if (window.jumbleberry && transactionId && orderValue) {
      window.jumbleberry("track", "Purchase", { 
        transaction_id: transactionId,
        order_value: orderValue
      });
    }
  }, [transactionId, orderValue]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-accent">
      <div className="w-full max-w-md space-y-8 text-center">
        <img 
          src="/lovable-uploads/4aa0753d-5079-4050-99bb-ff490ee12bb4.png" 
          alt="Recipee Logo" 
          className="mx-auto w-48 mb-8"
        />
        <div className="bg-white p-8 rounded-lg shadow-lg space-y-4">
          <h1 className="text-4xl font-bold text-secondary">Thank You!</h1>
          <p className="text-xl text-muted-foreground">Your purchase was successful.</p>
        </div>
      </div>
    </div>
  );
};

export default Success;