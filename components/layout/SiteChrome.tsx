import { PublicNav } from "@/components/layout/PublicNav";

type SiteChromeProps = {
  overlay?: boolean;
  hideNav?: boolean;
  children: React.ReactNode;
};

export function SiteChrome({ overlay = false, hideNav = false, children }: SiteChromeProps) {
  return (
    <div className="min-h-screen">
      {hideNav ? null : <PublicNav overlay={overlay} />}
      {children}
    </div>
  );
}
