// Set up dimensions and margins
const margin = { top: 40, right: 30, bottom: 50, left: 70 };
const width = 800; // Total width of the chart
const height = 400; // Total height of the chart
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

let innerChartS; // Will hold the inner chart group (g) element

const tooltipWidth = 65; // Width of the tooltip\
const tooltipHeight = 32; // Height of the tooltip
/* Make the colours accessible globally */
/****************************************/
const barColor = "#606464";
const bodyBackgroundColor = "#fffaf0";

// Set up the scales
const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();
const xScaleS = d3.scaleLinear();
const yScaleS = d3.scaleLinear();
const colorScale = d3.scaleOrdinal()

// T06-1 Step 6.2 Create a bin generator using d3.bin
const binGenerator = d3.bin()
    .value(d => d.energyConsumption);

// T06-1 Step 7.2 Make the filter options accessible globally
// id matches the screenTech value in the CSV ("all" shows every TV)
const filters_screen = [
    { id: "all", label: "All", isActive: true },
    { id: "LED", label: "LED", isActive: false },
    { id: "LCD", label: "LCD", isActive: false },
    { id: "OLED", label: "OLED", isActive: false }
];

// T06-2 Step 1.4 Set up shared constant
// Declared once here, then assigned inside drawHistogram / drawScatterplot.
// Use let (not const): const must get its value at declaration and can't be assigned later.
let innerChart;   // histogram inner group (used by updateHistogram)

// T06-2 Step 3.3 Add tooltipWidth and tooltipHeight