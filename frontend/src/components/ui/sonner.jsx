import { Toaster as Sonner } from 'sonner';

export function Toaster() {
  return (
    <Sonner
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: 'rounded-lg',
          description: 'text-muted-foreground'
        }
      }}
    />
  );
}
