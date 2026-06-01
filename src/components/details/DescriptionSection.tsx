interface DescriptionSectionProps {
  children: string;
}

export function DescriptionSection({ children }: DescriptionSectionProps) {
  return (
    <div>
      <h2 className="text-md-custom font-medium leading-5 text-text-primary">Description</h2>
      <p className="mt-1 text-sm-custom font-medium leading-5 text-text-secondary">{children}</p>
    </div>
  );
}

export default DescriptionSection;
