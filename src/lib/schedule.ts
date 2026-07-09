export const createMeetSpace = async (accessToken: string) => {
  const response = await fetch('https://meet.googleapis.com/v2/spaces', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      config: {
        accessType: 'OPEN'
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create Meet space: ${errorData.error?.message || response.statusText}`);
  }

  return response.json();
};

export const createInterviewEvent = async (accessToken: string, summary: string, startDateTime: string, endDateTime: string, attendeeEmail: string) => {
  const event = {
    summary,
    description: 'Interview scheduled via the portfolio application.',
    start: { dateTime: startDateTime, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
    end: { dateTime: endDateTime, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
    attendees: [{ email: attendeeEmail }],
    conferenceData: {
      createRequest: {
        requestId: Math.random().toString(36).substring(7),
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    }
  };

  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create calendar event: ${errorData.error?.message || response.statusText}`);
  }

  return response.json();
};

export const logInterviewToSheet = async (accessToken: string, summary: string, date: string, meetLink: string) => {
  // Search for existing file
  const searchRes = await fetch("https://www.googleapis.com/drive/v3/files?q=name='Interview Logs' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  
  if (!searchRes.ok) {
    throw new Error('Failed to search for spreadsheet');
  }
  
  const searchData = await searchRes.json();
  let spreadsheetId;
  let isNew = false;
  
  if (searchData.files && searchData.files.length > 0) {
    spreadsheetId = searchData.files[0].id;
  } else {
    // Create new
    const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: { title: 'Interview Logs' },
        sheets: [{ properties: { title: 'Interviews' } }]
      })
    });
    
    if (!createRes.ok) {
      throw new Error('Failed to create spreadsheet');
    }
    
    const sheetData = await createRes.json();
    spreadsheetId = sheetData.spreadsheetId;
    isNew = true;
  }
  
  const values = isNew ? [
    ['Interview Title', 'Date/Time', 'Meet Link', 'Status'],
    [summary, date, meetLink, 'Scheduled']
  ] : [
    [summary, date, meetLink, 'Scheduled']
  ];
  
  const appendRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Interviews!A1:append?valueInputOption=USER_ENTERED`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ values })
  });
  
  if (!appendRes.ok) {
    throw new Error('Failed to append to spreadsheet');
  }
  
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
};
