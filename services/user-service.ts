
 export const fetchUSStates = async (): Promise<string[]> => {
  try {
    const response = await fetch(`https://backend-dreametrix.com/utilities/us-states/`);
    if (!response.ok) throw new Error('Failed to fetch states');
    return await response.json();
  } catch (error) {
    console.error('Error fetching states:', error);
    throw error;
  }
};


export const fetchCitiesByState = async (state: string): Promise<string[]> => {
  try {
    const response = await fetch(
      `https://backend-dreametrix.com/utilities/us-cities-by-state/${encodeURIComponent(state)}/`
    );
    console.log(`Fetching cities for state: ${state}`);
    if (!response.ok) throw new Error('Failed to fetch cities');
    return await response.json();
    
  } catch (error) {
    console.error(`Error fetching cities for state ${state}:`, error);
    throw error;
  }
};