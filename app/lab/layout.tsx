import { LabBar } from '@/components/lab/LabBar';

export default function LabLayout({ children }: LayoutProps<'/lab'>) {
  return (
    <>
      <LabBar />
      {children}
    </>
  );
}
