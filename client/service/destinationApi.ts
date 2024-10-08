interface Destination {
  user_id: string;
  location: string;
  country: string;
  description: string;
  date_start: string;
  date_end: string;
  image: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

/**
 * Create a new destination
 * @param destination
 * @returns
 */
export async function createDestination(destination: Destination): Promise<ApiResponse> {
  try {
    console.log(destination, 'in api');
    const response = await fetch('http://localhost:8080/api/v1/destination', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(destination),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.message || 'Failed to create destination' };
    }

    return await response.json();
  } catch (e) {
    console.error(e);
    return { success: false, message: String(e) };
  }
}

/**
 * Update an existing destination
 * @param destinationId
 * @param updatedData
 * @returns
 */
export async function updateDestination(
  destinationId: string,
  updatedData: Partial<Destination>,
): Promise<ApiResponse> {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/destination/${destinationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData.message || 'Failed to update destination' };
    }

    return await response.json();
  } catch (e) {
    console.error(e);
    return { success: false, message: String(e) };
  }
}
