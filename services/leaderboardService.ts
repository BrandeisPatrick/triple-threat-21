
import type { LeaderboardEntry } from '../types';

const BIN_ID = '6897f7c2d0ea881f40558c65';
const API_KEY = '$2a$10$/EG4dmZkRd090FMXHMAcqOPtmQHJzwDHMWYmur0Go/FAB0nf77fCa';
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const headers = {
  'Content-Type': 'application/json',
  'X-Master-Key': API_KEY,
};

export const fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  try {
    const response = await fetch(`${BASE_URL}/latest`, {
      method: 'GET',
      headers: { 'X-Master-Key': API_KEY },
    });
    if (!response.ok) {
      if (response.status === 404) return []; // Bin is empty or doesn't exist, return empty array
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data.record) ? data.record : [];
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

export const updateLeaderboard = async (data: LeaderboardEntry[]): Promise<void> => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error updating leaderboard:', error);
  }
};
