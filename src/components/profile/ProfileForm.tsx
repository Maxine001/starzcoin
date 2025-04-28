
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';

export type ProfileFormValues = {
  email: string;
  walletAddress: string;
  coinType: string;
};

interface ProfileFormProps {
  defaultValues: ProfileFormValues;
  onSubmit: (data: ProfileFormValues) => void;
  onClose: () => void;
}

const ProfileForm = ({ defaultValues, onSubmit, onClose }: ProfileFormProps) => {
  const [copied, setCopied] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    defaultValues,
  });
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(defaultValues.walletAddress);
    setCopied(true);
    
    toast({
      title: 'Copied!',
      description: 'Wallet address copied to clipboard',
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleSubmit = (data: ProfileFormValues) => {
    onSubmit(data);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormDescription>
                Your email will not be shared publicly.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Wallet Information</h3>
          
          <FormField
            control={form.control}
            name="walletAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wallet Address</FormLabel>
                <div className="flex">
                  <FormControl>
                    <div className="relative w-full">
                      <Input {...field} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={copyToClipboard}
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </Button>
                    </div>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="coinType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coin Type</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
