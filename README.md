# RDLC Report Viewer

A modern Next.js application for displaying RDLC Reports with pagination and export functionality. Download reports in PDF, CSV, and XML formats.

## Features

- 📊 Display reports in a paginated table view
- 📄 Export reports to PDF format
- 📋 Export reports to CSV format
- 📁 Export reports to XML format
- 🔄 Dynamic pagination with customizable page sizes
- 🎨 Modern UI built with Tailwind CSS
- ⚡ Server-side API routes for report data and export
- 🔒 Type-safe with TypeScript

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── reports/
│   │       ├── data/               # Report data endpoint
│   │       ├── export-pdf/         # PDF export endpoint
│   │       ├── export-csv/         # CSV export endpoint
│   │       └── export-xml/         # XML export endpoint
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Main page
│   └── globals.css                 # Global styles
├── components/
│   ├── ExportButtons.tsx           # Export buttons component
│   ├── Pagination.tsx              # Pagination component
│   └── ReportTable.tsx             # Report table display
├── types/
│   └── report.ts                   # Report types and interfaces
├── utils/
│   └── export.ts                   # Export utilities
└── lib/                            # Utility libraries
```

## Getting Started

### Prerequisites

- Node.js 18+ (or 20+ for latest features)
- npm or yarn package manager

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Build the project (optional):
   ```bash
   npm run build
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production

Build and start the production server:

```bash
npm run build
npm start
```

## Usage

### Displaying Reports

The main page (`src/app/page.tsx`) fetches report data from the API and displays it in a paginated table.

- Select records per page using the dropdown
- Navigate between pages using the pagination controls
- View report summary statistics at the top

### Exporting Reports

Click any of the export buttons to download the entire report in your preferred format:

- **PDF**: Professional formatted PDF document
- **CSV**: Comma-separated values for spreadsheet applications
- **XML**: Structured XML format for data integration

### API Endpoints

#### Get Report Data

```
GET /api/reports/data?pageNumber=1&pageSize=5
```

Response:

```json
{
  "success": true,
  "data": {
    "report": {
      /* report metadata */
    },
    "pageNumber": 1,
    "pageSize": 5,
    "totalPages": 3,
    "currentPageData": [
      /* paginated records */
    ]
  }
}
```

#### Export to PDF

```
POST /api/reports/export-pdf
```

Body:

```json
{
  "reportData": [
    /* array of records */
  ],
  "fileName": "report.pdf"
}
```

#### Export to CSV

```
POST /api/reports/export-csv
```

Body:

```json
{
  "reportData": [
    /* array of records */
  ],
  "fileName": "report.csv"
}
```

#### Export to XML

```
POST /api/reports/export-xml
```

Body:

```json
{
  "report": {
    /* report metadata */
  },
  "reportData": [
    /* array of records */
  ],
  "fileName": "report.xml"
}
```

## Configuration

### Tailwind CSS

Configuration file: `tailwind.config.ts`

Customize colors, fonts, and responsive breakpoints as needed.

### TypeScript

Configuration file: `tsconfig.json`

Adjust compiler options and path aliases.

### Next.js

Configuration file: `next.config.js`

Modify Next.js build and runtime behavior.

## Integration with RDLC Reports

To integrate with your RDLC Report service:

1. Update `src/app/api/reports/data/route.ts` to fetch data from your RDLC service
2. Replace the mock data with actual API calls to your backend
3. Adjust the data transformation as needed for your report format

Example:

```typescript
// Replace mock data with your RDLC service call
const response = await fetch("YOUR_RDLC_SERVICE_URL", {
  method: "POST",
  body: JSON.stringify(/* your parameters */),
});
```

## Technologies Used

- **Next.js 15**: React framework with server-side rendering
- **React 19**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **PDFKit**: PDF generation
- **xml2js**: XML processing
- **csv-stringify**: CSV generation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Tips

- Implement server-side filtering and pagination for large datasets
- Use Next.js Image optimization for any images
- Enable compression in production
- Consider implementing caching for report data

## Troubleshooting

### PDF Export Not Working

- Ensure the server has permission to generate files
- Check that PDFKit is properly installed

### Large Datasets Performance

- Reduce page size or implement virtual scrolling
- Consider server-side filtering and aggregation

### CORS Issues

- Ensure your RDLC service allows requests from this origin
- Configure CORS headers in your API route

## Future Enhancements

- [ ] Advanced filtering and search
- [ ] Custom report templates
- [ ] Email export functionality
- [ ] Report scheduling
- [ ] Real-time data updates with WebSockets
- [ ] Multi-format export (Excel, JSON)
- [ ] User preferences and saved views

## License

ISC

## Support

For issues or questions, please check the documentation or create an issue in your repository.
