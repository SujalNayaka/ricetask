import React, { useState } from 'react';
import { FiDownload, FiPrinter } from 'react-icons/fi';
import './reports.css';

const Reports = () => {
  const [activeReport, setActiveReport] = useState('sales');
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const reportTypes = [
    { id: 'sales', name: 'Sales Report' },
    { id: 'inventory', name: 'Inventory Report' },
    { id: 'customer', name: 'Customer Report' },
    { id: 'financial', name: 'Financial Report' }
  ];

  const handleGenerateReport = () => {
    console.log(`Generating ${activeReport} report for ${dateRange.start} to ${dateRange.end}`);
    // Actual API call would go here
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2>Reports</h2>
        <div className="report-actions">
          <button className="download-btn">
            <FiDownload /> Download
          </button>
          <button className="print-btn">
            <FiPrinter /> Print
          </button>
        </div>
      </div>

      <div className="report-controls">
        <div className="report-type-selector">
          {reportTypes.map(report => (
            <button
              key={report.id}
              className={`report-type-btn ${activeReport === report.id ? 'active' : ''}`}
              onClick={() => setActiveReport(report.id)}
            >
              {report.name}
            </button>
          ))}
        </div>

        <div className="date-range-selector">
          <label>From:</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
          />
          <label>To:</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
          />
          <button className="generate-btn" onClick={handleGenerateReport}>
            Generate Report
          </button>
        </div>
      </div>

      <div className="report-preview">
        <div className="report-placeholder">
          <h3>{reportTypes.find(r => r.id === activeReport).name}</h3>
          <p>Date Range: {dateRange.start} to {dateRange.end}</p>
          <div className="chart-placeholder">
            [Chart visualization would appear here]
          </div>
          <div className="data-table-placeholder">
            [Detailed data table would appear here]
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;