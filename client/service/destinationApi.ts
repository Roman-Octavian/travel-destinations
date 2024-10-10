interface Destination {
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

export async function createDestination(destination: Destination): Promise<ApiResponse> {
  try {
    const response = await fetch('http://localhost:8080/api/v1/destination', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(destination),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401) {
        return { success: false, message: 'Unauthorized: Please log in' };
      }
      return { success: false, message: errorData.message || 'Failed to create destination' };
    }

    return await response.json();
  } catch (e) {
    console.error(e);
    return { success: false, message: String(e) };
  }
}

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
      credentials: 'include',
      body: JSON.stringify(updatedData),
    });

    const responseData = await response.json();

    if (!response.ok || !responseData.success) {
      return { success: false, message: responseData.message || 'Failed to update destination' };
    }

    return { success: true, message: responseData.message };
  } catch (e) {
    console.error(e);
    return { success: false, message: String(e) };
  }
}

export async function getDestinationById(destinationId: string): Promise<Destination | null> {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/destination/${destinationId}`, {
      credentials: 'include',
    });

    const responseData = await response.json();

    if (!response.ok || !responseData.success) {
      console.error(responseData.message);
      return null;
    }

    return responseData.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}
