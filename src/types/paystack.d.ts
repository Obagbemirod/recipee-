export interface PaystackConfig {
  email: string;
  amount: number;
  publicKey: string;
  ref: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
  metadata?: {
    custom_fields: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
  };
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: PaystackConfig) => {
        openIframe: () => void;
      };
    };
  }
}

export {};