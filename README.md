# Links
	Prototype: https://codepen.io/empireoflight/pen/eYYgGjL
	Github: https://github.com/field2/schemarama
	Figma Developer Resources: https://www.figma.com/plugin-docs/intro/

# Description
	Choose a base color from a native hue from 12 core colors and a color scheme. Depending on the color scheme, additional base colors are be generated.
	Each base color is rendered horizontally into 13 swatches, ranging from a dark tone to the native hue to a light tint, with the native hue centered at slot 7. 

	The user can now take a screenshot and copy/paste it into the graphic editor of choice.

# Goal
	Create a Figma plugin that will replicate the basic functionality. "Take a screnshot" step will be replaced by "Generate Swatches" button. Pressing button will create the same pattern, but as rectangles in the Figma UI.

# Enhancements
1.	Allow the user to choose more colors, from a full color wheel
Allow the user to type in a hex value instead of picking a color
2.	Build a wider range of swatches, to include saturation levels. In this model, the row of 13 will be duplicated 13x vertically, with each new row showing a 100/13 percent reduction in saturation. 
3. Allow the user to build a color scheme out of a selection's fill