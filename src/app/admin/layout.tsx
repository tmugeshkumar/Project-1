import { ReactNode } from "react";

export const metadata = {
  title: "Admin Portal | COMPANY_NAME",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-surface-950 text-surface-50">{children}</div>;
}
