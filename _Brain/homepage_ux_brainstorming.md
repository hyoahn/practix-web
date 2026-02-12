# Brainstorming: Homepage & Mobile UX Evolution

## Current Objectives
- **Zero Focal Blockage**: Ensure all HUD elements (score, streak, cards) never overlap primary subjects in imagery across any responsive viewport.
- **Micro-Interaction Polish**: Transition HUD elements from static positions to subtle floating animations to enhance the "Engine" aesthetic.
- **Deep Hub Integration**: Link the homepage "Start Training" CTA more directly into the mastery tracking logic.

## Future Considerations
- **Dynamic Masking**: Consider using CSS masks or SVG overlays that respond to image focal points to automatically position HUD labels.
- **Theme-Aware HUDs**: Adjust badge colors and rings based on the underlying image contrast for maximum legibility.
- **Standardization Purity**: Continue purging inline JS and legacy IDs as we move toward a fully componentized V4 structure.

## Strict Operational Rules
- **No Unprompted Changes**: ABSOLUTELY NO moving UI elements or altering the creative layout without a direct user command. The AI must respect the fixed positions established by the designer.
