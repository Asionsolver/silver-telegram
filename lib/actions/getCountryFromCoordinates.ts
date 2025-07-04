interface GeocodeResult {
  country: string;
  formattedAddress: string;
}

export async function getCountryFromCoordinates(
  lat: number,
  lng: number
): Promise<GeocodeResult> {
  // Simulate an API call
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("Google Maps API key is not configured.");
  }
  const response = await fetch(
    `https://maps.gomaps.pro/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
  );
  const data = await response.json();
  if (data.status !== "OK") {
    throw new Error("Failed to retrieve geocode information.");
  }

  const result = data.results[0];
  // console.log(result);

  const countryComponent = result.address_components.find((component: any) =>
    component.types.includes("country")
  );
  return {
    country: countryComponent ? countryComponent.long_name : "Unknown Country",
    formattedAddress: result.formatted_address,
  };
}
