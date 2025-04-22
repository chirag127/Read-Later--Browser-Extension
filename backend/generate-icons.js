// Script to generate PNG icons from the SVG source using sharp

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Define paths
const svgIconPath = path.join(__dirname, '..', 'extension', 'icons', 'icon.svg');
const outputDir = path.join(__dirname, '..', 'extension', 'icons');

// Define desired PNG sizes
const sizes = [16, 48, 128];

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`Created directory: ${outputDir}`);
}

// Check if SVG file exists
if (!fs.existsSync(svgIconPath)) {
    console.error(`Error: SVG icon not found at ${svgIconPath}`);
    process.exit(1);
}

/**
 * Generates a PNG icon of a specific size from the SVG source.
 * @param {number} size - The width and height of the output PNG.
 */
async function generateIcon(size) {
    const outputPath = path.join(outputDir, `icon${size}.png`);
    try {
        await sharp(svgIconPath)
            .resize(size, size)
            .png()
            .toFile(outputPath);
        console.log(`Successfully generated ${outputPath}`);
    } catch (error) {
        console.error(`Error generating icon${size}.png:`, error);
    }
}

/**
 * Main function to generate all icons.
 */
async function generateAllIcons() {
    console.log('Starting icon generation...');
    // Create promises for each size generation
    const promises = sizes.map(size => generateIcon(size));
    // Wait for all promises to resolve
    await Promise.all(promises);
    console.log('Icon generation complete.');
}

// Run the generation process
generateAllIcons();