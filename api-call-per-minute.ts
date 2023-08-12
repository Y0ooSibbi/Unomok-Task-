import * as fs from 'fs';
import * as path from 'path';

// Define the path to the folder containing log files
const logFolderPath = './logs/'; // Change this to the path where your log files are stored

// Interface to define the structure of a log entry
interface LogEntry {
  timestamp: string;
  statusCode: number;
  endpoint: string;
  method: string;
}

// Function to read log files and extract log entries
const readLogFiles = async (): Promise<LogEntry[]> => {
  // Get a list of log files in the specified folder
  const logFiles = fs.readdirSync(logFolderPath);

  // Array to store all log entries
  const allLogEntries: LogEntry[] = [];

  // Loop through each log file
  for (const logFile of logFiles) {
    // Create the full path to the log file
    const logFilePath = path.join(logFolderPath, logFile);

    // Read the contents of the log file
    const logContents = fs.readFileSync(logFilePath, 'utf-8');

    // Split log contents into individual lines
    const logLines = logContents.split('\n');

    // Loop through each line in the log file
    for (const line of logLines) {
      // Use regex to match the log entry components
      const match = line.match(/\[.*?\] "(\w+)\s+([^\s?]+)\s+HTTP\/\d\.\d"\s+(\d{3})/);
      if (match) {
        // Extract relevant components
        const method = match[1];
        const endpoint = match[2];
        const statusCode = parseInt(match[3], 10);
        const timestamp = line.substr(0, 24);

        // Create a log entry and add it to the array
        allLogEntries.push({ timestamp, statusCode, endpoint, method });
      }
    }
  }

  // Return all the extracted log entries
  return allLogEntries;
};

// Function to analyze log entries and display per-minute counts
const analyzeLogs = async () => {
  try {
    // Read log files and extract log entries
    const logEntries = await readLogFiles();

    // Create a map to store per-minute counts
    const perMinuteCounts = new Map<string, number>();

    // Count the occurrences of each minute
    for (const entry of logEntries) {
      const minute = entry.timestamp.substring(0, 16); // Extracting the minute portion of timestamp
      if (perMinuteCounts.has(minute)) {
        perMinuteCounts.set(minute, perMinuteCounts.get(minute)! + 1);
      } else {
        perMinuteCounts.set(minute, 1);
      }
    }

    // Convert the map to an array and format for console.table
    const tableData = Array.from(perMinuteCounts.entries()).map(([minute, count]) => ({
      minute,
      count,
    }));

    // Display the table of per-minute counts
    console.table(tableData);

  } catch (error) {
    console.error('An error occurred:', error);
  }
};

// Call the function to analyze logs
analyzeLogs();
