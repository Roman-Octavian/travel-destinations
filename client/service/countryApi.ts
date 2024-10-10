export async function fetchCountries(): Promise<string[]> {
  try {
    const response = await fetch('http://localhost:8080/api/v1/countries', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch countries');
    }

    return await response.json();
  } catch (e) {
    console.error('Error fetching countries:', e);
    throw e;
  }
}
