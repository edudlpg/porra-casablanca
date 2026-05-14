import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

type BackLinkProps = {
  href: string;
  label?: string;
};

export function BackLink({ href, label = "Volver" }: BackLinkProps) {
  return (
    <Button asChild variant="secondary" size="sm">
      <Link href={href}>
        <ArrowLeft className="size-4" />
        {label}
      </Link>
    </Button>
  );
}
