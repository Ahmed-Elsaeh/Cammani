import { Star, StarHalf } from "lucide-react";

interface Props { value: number; size?: number; }

export default function StarRating({ value, size = 14 }: Props) {
  const full  = Math.floor(value);
  const half  = value % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <span className="stars" aria-label={`Rating: ${value} out of 5`}>
      {Array.from({ length: full  }).map((_, i) => <Star key={`f${i}`} size={size} fill="currentColor" strokeWidth={0} />)}
      {half && <StarHalf size={size} fill="currentColor" strokeWidth={0} />}
      {Array.from({ length: empty }).map((_, i) => <Star key={`e${i}`} size={size} strokeWidth={1.5} style={{ opacity: 0.3 }} />)}
    </span>
  );
}
