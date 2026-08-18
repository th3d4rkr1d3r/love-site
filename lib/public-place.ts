import type { Place } from "@prisma/client";

/** Remove o endereço interno antes de qualquer resposta pública. */
export function toPublicPlace<T extends Pick<Place, "address">>(place: T) {
  const { address, ...publicPlace } = place;
  void address;
  return publicPlace;
}

export function toPublicPlaces<T extends Pick<Place, "address" | "isPrivate">>(
  places: T[],
) {
  return places.filter((place) => !place.isPrivate).map(toPublicPlace);
}
