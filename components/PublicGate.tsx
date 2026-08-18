import { ComingSoon } from "@/components/ComingSoon";

type PublicGateProps = {
  isPublic: boolean;
  nameA: string;
  nameB: string;
  children: React.ReactNode;
};

export function PublicGate({ isPublic, nameA, nameB, children }: PublicGateProps) {
  if (!isPublic) {
    return <ComingSoon nameA={nameA} nameB={nameB} />;
  }

  return children;
}
