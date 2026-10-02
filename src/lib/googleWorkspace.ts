import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { AppointmentDetails } from '../types';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.addScope('https://www.googleapis.com/auth/chat.spaces.readonly');
provider.addScope('https://www.googleapis.com/auth/chat.messages.create');
provider.addScope('https://www.googleapis.com/auth/chat.messages.readonly');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initWorkspaceAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to retrieve Google OAuth access token');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getCachedAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const workspaceLogout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// ==========================================
// GOOGLE SHEETS API UTILITIES
// ==========================================

export async function createClinicSpreadsheet(accessToken: string, title: string = "Dr. Ayesha Awan Clinic Records") {
  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title
      },
      sheets: [
        {
          properties: {
            title: "Appointments"
          },
          data: [
            {
              startRow: 0,
              startColumn: 0,
              rowData: [
                {
                  values: [
                    { userEnteredValue: { stringValue: "ID" } },
                    { userEnteredValue: { stringValue: "Full Name" } },
                    { userEnteredValue: { stringValue: "Phone Number" } },
                    { userEnteredValue: { stringValue: "Clinic" } },
                    { userEnteredValue: { stringValue: "Date" } },
                    { userEnteredValue: { stringValue: "Time" } },
                    { userEnteredValue: { stringValue: "City" } },
                    { userEnteredValue: { stringValue: "Symptoms" } },
                    { userEnteredValue: { stringValue: "Status" } },
                    { userEnteredValue: { stringValue: "Created At" } }
                  ]
                }
              ]
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Failed to create Google Sheet');
  }

  const data = await response.json();
  return data.spreadsheetId;
}

export async function fetchSpreadsheetRows(accessToken: string, spreadsheetId: string, range: string = 'Appointments!A1:Z100') {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Failed to read Google Sheet rows');
  }

  const data = await response.json();
  return data.values || [];
}

export async function appendAppointmentToSheet(accessToken: string, spreadsheetId: string, app: AppointmentDetails) {
  const values = [
    [
      app.id,
      app.fullName,
      app.phoneNumber,
      app.preferredClinic,
      app.preferredDate,
      app.preferredTime,
      app.city,
      app.problemSymptoms,
      app.status || 'Confirmed',
      app.createdAt || new Date().toISOString()
    ]
  ];

  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Appointments!A1:append?valueInputOption=USER_ENTERED`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      range: 'Appointments!A1',
      majorDimension: 'ROWS',
      values
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Failed to append row to Google Sheet');
  }

  return await response.json();
}

// ==========================================
// GOOGLE CHAT API UTILITIES
// ==========================================

export async function listChatSpaces(accessToken: string) {
  const response = await fetch('https://chat.googleapis.com/v1/spaces', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Failed to fetch Google Chat Spaces');
  }

  const data = await response.json();
  return data.spaces || [];
}

export async function sendChatMessage(accessToken: string, spaceName: string, messageText: string) {
  const response = await fetch(`https://chat.googleapis.com/v1/${spaceName}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: messageText
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Failed to post message to Google Chat');
  }

  return await response.json();
}

export async function listChatMessages(accessToken: string, spaceName: string) {
  const response = await fetch(`https://chat.googleapis.com/v1/${spaceName}/messages?pageSize=20`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Failed to fetch messages from Google Chat');
  }

  const data = await response.json();
  return data.messages || [];
}
