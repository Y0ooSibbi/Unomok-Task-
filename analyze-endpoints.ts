import * as fs from 'fs';
import * as path from 'path';

// Set the path to the folder containing log files
const logFolderPath = './logs/';

// Define the structure of each log entry
interface LogEntry {
  timestamp: string;
  statusCode: number;
  endpoint: string;
  method: string;
}

// Function to read log files and extract log entries
const readLogFiles = async (): Promise<LogEntry[]> => {
  // Read the list of log files in the specified folder
  const logFiles = fs.readdirSync(logFolderPath);

  const allLogEntries: LogEntry[] = [];

  // Loop through each log file
  for (const logFile of logFiles) {
    // Create the full path to the log file
    const logFilePath = path.join(logFolderPath, logFile);
    // Read the contents of the log file
    const logContents = fs.readFileSync(logFilePath, 'utf-8');

    // Split the log contents into individual lines
    const logLines = logContents.split('\n');

    // Loop through each line in the log file
    for (const line of logLines) {
      // Use regular expressions to extract relevant information
      const match = line.match(/\[.*?\] "(\w+)\s+([^\s?]+)\s+HTTP\/\d\.\d"\s+(\d{3})/);
      if (match) {
        const method = match[1];
        const endpoint = match[2];
        const statusCode = parseInt(match[3], 10);
        // Create a log entry object and add it to the array
        allLogEntries.push({ timestamp: line.substr(0, 24), method, statusCode, endpoint });
      }
    }
  }

  return allLogEntries;
};

// Function to analyze log entries and display endpoint counts
const analyzeLogs = async () => {
  try {
    // Read log files and get log entries
    const logEntries = await readLogFiles();

    // Use a map to store counts for each endpoint
    const endpointCounts = new Map<string, number>();

    // Loop through each log entry
    for (const entry of logEntries) {
      // Create a unique key for each endpoint and method combination
      const key = `${entry.method} ${entry.endpoint}`;
      
      // Increment the count for the endpoint if it exists, otherwise set it to 1
      if (endpointCounts.has(key)) {
        endpointCounts.set(key, endpointCounts.get(key)! + 1);
      } else {
        endpointCounts.set(key, 1);
      }
    }

    // Format data for table and display it
    const tableData = Array.from(endpointCounts.entries()).map(([endpoint, count]) => ({
      endpoint,
      count,
    }));
    
    console.table(tableData, ['endpoint', 'count']);
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

// Call the analyzeLogs function to start the analysis
analyzeLogs();
