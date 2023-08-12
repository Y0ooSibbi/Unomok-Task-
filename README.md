# Log Analyzer CLI

This is a Node.js CLI tool for analyzing log files to gather insights on API endpoint calls, per minute call counts, and API call status codes.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [How to Run](#how-to-run)
- [Additional Notes](#additional-notes)

## Requirements

- Node.js (Version X.X.X)
- Log files in the specified format.

## Installation

1. Clone this repository to your local machine.
2. Open a terminal and navigate to the repository folder.
3. Run the following command to install the required dependencies:

```bash npm install ```

Usage
This CLI tool provides three functionalities:

Endpoint Analysis: Count how many times each API endpoint was called.

Per Minute Call Analysis: Count the number of API calls made per minute.

# Status Code Analysis: 

Count the total number of API calls for each HTTP status code.

# Endpoint Analysis

To analyze how many times each API endpoint was called, run the following command:

``` bash node endpoint-analysis.js  ```

# Per Minute Call Analysis

To analyze the number of API calls made per minute, run the following command:

```bash node per-minute-analysis.js```

Status Code Analysis
To analyze the total number of API calls for each HTTP status code, run the following command:

```bash node status-code-analysis.js```
# Additional Notes
- Make sure to place your log files in the 'logs' folder before running the analysis.
- The output will be displayed in a formatted table.
- The 'analyzeLogs' function in each script reads log files from the 'logs' folder and processes them.
- Comments have been added to the code to explain its functionality.
- Replace `Version X.X.X` with your actual Node.js version.
