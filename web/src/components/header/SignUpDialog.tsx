import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useSignUp from '@/hooks/useSignUp';

type SignUpDialogProps = {
  refetchSession: () => void;
  onClose: () => void;
};

export default function SignUpDialog({
  refetchSession,
  onClose,
}: SignUpDialogProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { signUp, loading } = useSignUp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp({
        username,
        password,
      }).then(() => refetchSession());
      toast.success('Signed up successfully');
      onClose();
    } catch (error) {
      toast.error(`Failed to sign up: ${(error as Error).message}`);
    }
  };

  return (
    <>
      <DialogTitle>Sign Up</DialogTitle>
      <DialogDescription className="mt-2 text-sm text-gray-600">
        Fill in the details below to sign up.
      </DialogDescription>
      <form onSubmit={handleSubmit} className="mt-1 space-y-4">
        <div>
          <Label>Username</Label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter username"
          />
        </div>
        <div>
          <Label>Password</Label>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            placeholder="Enter password"
          />
        </div>
        <Button
          className="ml-auto flex space-x-2"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </Button>
      </form>
    </>
  );
}
