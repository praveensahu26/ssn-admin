export interface ColumnConfigForCsv<T> {
  key: string;
  header: string;
  csvValue?: (row: T) => string | number | boolean | null | undefined;
}

/**
 * Escapes a single value for CSV compliance:
 * - Converts null/undefined to empty string.
 * - Converts to string.
 * - Replaces double quotes with two double quotes (" -> "").
 * - Wraps the value in double quotes.
 */
export function escapeCsvValue(val: any): string {
  if (val === null || val === undefined) {
    return '""';
  }
  const strVal = String(val);
  const escaped = strVal.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Generates and downloads a CSV file from data and columns.
 */
export function exportToCsv<T>(
  data: T[],
  columns: ColumnConfigForCsv<T>[],
  filename: string
): void {
  if (!data || data.length === 0) {
    return;
  }

  // Generate headers row
  const headersRow = columns.map(col => escapeCsvValue(col.header)).join(',');

  // Generate data rows
  const dataRows = data.map(row => {
    return columns
      .map(col => {
        let val: any;
        if (col.csvValue) {
          try {
            val = col.csvValue(row);
          } catch (e) {
            val = '';
          }
        } else {
          val = row[col.key as keyof T];
        }

        // Convert boolean values to readable text
        if (typeof val === 'boolean') {
          val = val ? 'Yes' : 'No';
        }

        return escapeCsvValue(val);
      })
      .join(',');
  });

  const csvContent = '\uFEFF' + [headersRow, ...dataRows].join('\n'); // Prepend BOM for Excel compatibility

  // Create Blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
