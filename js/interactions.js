// Build the screen-technology buttons and connect them to histogram filtering.
const populateFilters = (data) => {
    // Step 7.3 Set up buttons and event listeners
    // One button per filter object; the CSS styles .filter and .filter.active
    d3.select("#filters_screen")
        .selectAll(".filter")
        .data(filters_screen)
        .join("button")
            .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
            .text(d => d.label)
            .on("click", (e, d) => {
                // Ignore clicks on the button that is already active
                if (d.isActive) return;

                // Only the clicked filter becomes active
                filters_screen.forEach(filter => {
                    filter.isActive = filter.id === d.id;
                });

                // Toggle the active class to match the data
                d3.selectAll("#filters_screen .filter")
                    .classed("active", filter => filter.isActive);

                // Redraw the bars with the chosen screen type
                updateHistogram(d.id, data);
            });
};

const updateHistogram = (filterId, data) => {
    // 1. "all" skips the filter; otherwise keep only that screen type
    const updatedData = filterId === "all"
        ? data
        : data.filter(tv => tv.screenTech === filterId);

    // 2. Re-bin the filtered data with the shared binGenerator
    const updatedBins = binGenerator(updatedData);

    // 3. Redraw the bars with a transition
    innerChart
        .selectAll("rect")
        .data(updatedBins)
        .transition()
        .duration(500)
        .ease(d3.easeCubicInOut)
            .attr("y", d => yScale(d.length))
            .attr("height", d => innerHeight - yScale(d.length));
};

// T06-2 Step 3: Creating a tooltip and adding function call to load-data.js
const createTooltip = () => {
    // Step 3.2 Append (a hidden) tooltip to innerChart
    const tooltip = innerChartS
        .append("g")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("pointer-events", "none"); // don't block hover on circles below
    // Step 3.3 Append tooltip background rectangle
    const tooltipRect = tooltip.append("rect")
        .attr("width", tooltipWidth)
        .attr("height", tooltipHeight)
        .attr("fill", barColor)
        .attr("fill-opacity", 0.75)
        .attr("rx", 3) // Rounded corners
        .attr("ry", 3);
    // Step 3.4 Apped tooltip text
    // handleMouseEvents() fills this text on hover
    tooltip.append("text")
        .attr("x", tooltipWidth / 2)   // centre horizontally in the box
        .attr("y", tooltipHeight / 2)  // centre vertically in the box
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "white")
        .style("font-size", "13px")
        .text("");

};

// T06-2 Step 3.5 Add functions to react to mouse events
const handleMouseEvents = () => {
    const tooltip = innerChartS.select(".tooltip");

    // Step 3.6 Select all circles in scatter plot
    // Step 3.7 Attach event listeners to mouseenter and mouseleave events
    innerChartS.selectAll("circle")
    .on("mouseenter", (e, d) => {
            console.log("Mouse entered circle:", d);
            tooltip.select("text")
                .text(`${d.screenSize} inches`);
            // Get the hovered circle's position
            const cx = e.target.getAttribute("cx");
            const cy = e.target.getAttribute("cy");


            // Centre the tooltip above the circle
            tooltip
                .interrupt()
                .attr(
                    "transform",
                    `translate(${cx - 0.5 * tooltipWidth},
                               ${cy - 1.5 * tooltipHeight})`
                )
                .transition()
                .duration(200)
                .style("opacity", 1);
        })
        .on("mouseleave", () => {
            tooltip
                .interrupt()
                .style("opacity", 0)
                .attr("transform", "translate(0, 500)");
        });
};