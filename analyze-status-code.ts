import * as fs from 'fs';
import * as path from 'path';

// Define the path to the folder containing log files
const logFolderPath = './logs/';

// Interface to define the structure of a log entry
interface LogEntry {
  timestamp: string;
  statusCode: number;
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
      // Use regex to match the HTTP status code
      const match = line.match(/HTTP\/\d\.\d"\s+(\d{3})/);
      if (match) {
        // Extract and parse the status code
        const statusCode = parseInt(match[1], 10);

        // Extract the timestamp from the line (first 24 characters)
        const timestamp = line.substr(0, 24);

        // Create a log entry and add it to the array
        allLogEntries.push({ timestamp, statusCode });
      }
    }
  }

  // Return all the extracted log entries
  return allLogEntries;
};

// Function to analyze log entries and display results
const analyzeLogs = async () => {
  try {
    // Read log files and extract log entries
    const logEntries = await readLogFiles();

    // Create a map to store status code counts
    const statusCodeCounts = new Map<number, number>();

    // Count the occurrences of each status code
    for (const entry of logEntries) {
      if (statusCodeCounts.has(entry.statusCode)) {
        statusCodeCounts.set(entry.statusCode, statusCodeCounts.get(entry.statusCode)! + 1);
      } else {
        statusCodeCounts.set(entry.statusCode, 1);
      }
    }

    // Convert the map to an array and format for console.table
    const tableData = Array.from(statusCodeCounts.entries()).map(([statusCode, count]) => ({
      statusCode,
      count,
    }));

    // Display the table of status code counts
    console.table(tableData, ['statusCode', 'count']);
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

// Call the function to analyze logs
analyzeLogs();
