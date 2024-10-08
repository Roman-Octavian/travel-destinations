export async function fetchCountries(): Promise<string[]> {
  try {
    const response = await fetch('http://localhost:8080/api/v1/countries');

    if (!response.ok) {
      throw new Error('Failed to fetch countries');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
