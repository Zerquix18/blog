// this is claude's garbage that im not going to care about
// it works

export function parsePostDate(dateString: string): Date {
  // Handle timezone format: "YYYY-MM-DD HH:MM TZ"
  const timezoneRegex = /^(.+)\s+([A-Z]{3,4})$/;
  const match = dateString.match(timezoneRegex);
  
  if (match) {
    const [, datePart, timezone] = match;
    
    // Timezone offset mapping (hours from UTC)
    const timezoneOffsets: { [key: string]: number } = {
      'AST': -4,    // Atlantic Standard Time
      'EST': -5,    // Eastern Standard Time
      'CST': -6,    // Central Standard Time
      'MST': -7,    // Mountain Standard Time
      'PST': -8,    // Pacific Standard Time
      'EDT': -4,    // Eastern Daylight Time
      'CDT': -5,    // Central Daylight Time
      'MDT': -6,    // Mountain Daylight Time
      'PDT': -7,    // Pacific Daylight Time
      'GMT': 0,     // Greenwich Mean Time
      'UTC': 0,     // Coordinated Universal Time
      'JST': 9,     // Japan Standard Time
      'CET': 1,     // Central European Time
      'EET': 2,     // Eastern European Time
    };
    
    const offset = timezoneOffsets[timezone];
    if (offset !== undefined) {
      // Parse the date parts manually to avoid timezone issues
      const [datePortion, timePortion = '00:00'] = datePart.split(' ');
      const [year, month, day] = datePortion.split('-').map(Number);
      const [hours, minutes] = timePortion.split(':').map(Number);
      
      // Create date in UTC, then subtract the timezone offset to get the correct UTC time
      const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
      date.setUTCHours(date.getUTCHours() - offset);
      return date;
    }
    
    // If timezone not found in mapping, assume local time
    return new Date(datePart);
  }
  
  // Fallback to standard Date parsing for any legacy formats
  return new Date(dateString);
}