"use server"

export async function fetchLinkedInSkills(profileUrl) {
  try {
    const response = await fetch(`http://localhost:8000/check-profile/?profile_url=${encodeURIComponent(profileUrl)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch skills');
    }

    const data = await response.json();
    return data.skills;
  } catch (error) {
    console.error('Error fetching LinkedIn skills:', error);
    throw error;
  }
}
