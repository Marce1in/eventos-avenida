"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import FullScreenLoading from "./fullScreenLoading";

interface RedirectComponentProps {
  path: string;
  message?: string;
}

export default function RedirectComponent(props: RedirectComponentProps) {
  const { path, message } = props;
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current) {
      return;
    }
    hasRedirected.current = true;

    router.push(path);
    if (message) {
      toast.error(message);
    }
  }, []);

  return <FullScreenLoading />;
}
