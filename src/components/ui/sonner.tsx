import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        duration: 4000,
        classNames: {
          toast:
            "group toast group-[.toaster]:min-h-20 group-[.toaster]:w-[430px] group-[.toaster]:rounded-2xl group-[.toaster]:border group-[.toaster]:bg-background group-[.toaster]:px-6 group-[.toaster]:py-5 group-[.toaster]:text-foreground group-[.toaster]:shadow-2xl group-[.toaster]:border-border",
          title:
            "group-[.toast]:text-lg group-[.toast]:font-bold group-[.toast]:leading-6",
          description:
            "group-[.toast]:mt-1.5 group-[.toast]:text-base group-[.toast]:leading-6 group-[.toast]:text-muted-foreground",
          icon:
            "group-[.toast]:h-6 group-[.toast]:w-6",
          actionButton:
            "group-[.toast]:h-10 group-[.toast]:rounded-lg group-[.toast]:bg-primary group-[.toast]:px-5 group-[.toast]:text-base group-[.toast]:font-semibold group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:h-10 group-[.toast]:rounded-lg group-[.toast]:bg-muted group-[.toast]:px-5 group-[.toast]:text-base group-[.toast]:font-semibold group-[.toast]:text-muted-foreground",
          closeButton:
            "group-[.toast]:h-7 group-[.toast]:w-7 group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
