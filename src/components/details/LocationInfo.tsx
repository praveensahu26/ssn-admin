interface LocationInfoProps {
  location?: string;
}

export function LocationInfo({ location }: LocationInfoProps) {
  if (!location) return null;

  return (
    <div>
      <div className="flex items-center gap-2 text-md-custom font-medium leading-5 text-text-primary">
        <img src="/icons/profile/map.svg" alt="" className="h-5 w-5 object-contain" />
        <span>Location</span>
      </div>
      <p className="mt-1 pl-7 text-sm-custom font-medium leading-5 text-text-secondary">{location}</p>
    </div>
  );
}

export default LocationInfo;
