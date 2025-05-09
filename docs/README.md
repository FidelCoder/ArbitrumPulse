# Arbitrum Pulse Slide Deck

This is a 20-slide presentation for Arbitrum Pulse Bootcamps, covering Arbitrum, Stylus, and Orbit Chains, designed for educational workshops across Africa.

## Contents

The deck includes:
- Introduction to the bootcamp and team
- Why blockchain matters in Africa
- Arbitrum Layer 2 technology and benefits
- Stylus Rust-based smart contracts
- Orbit Chains (Layer 3) customizable solutions
- Local African use cases for each technology
- Workshop instructions and next steps

## Logos

The presentation uses the following logos from the `Logos` folder:
- `arbitrummain.png` - Main Arbitrum logo
- `arbitrumOrbit.png` - Arbitrum Orbit logo
- `stylus.png` - Stylus logo
- `UmojaverseLogo.png` - Umojaverse logo

## Render with Marp

To generate a presentation from this markdown file:

1. Install Marp CLI:
```bash
npm install -g @marp-team/marp-cli
```

2. Generate a PDF:
```bash
marp arbitrum_pulse_deck.md -o arbitrum_pulse_deck.pdf
```

3. Generate a PowerPoint file:
```bash
marp arbitrum_pulse_deck.md -o arbitrum_pulse_deck.pptx
```

4. Generate HTML slides:
```bash
marp arbitrum_pulse_deck.md -o arbitrum_pulse_deck.html
```

## Presentation Mode

For presenting, you can use Marp CLI server mode:

```bash
marp -s arbitrum_pulse_deck.md
```

This will start a local server where you can view the presentation in your browser.

## Customization

The presentation uses Arbitrum's blue color scheme (#007bff) with a clean, minimalistic design. You can customize:

- Font sizes in the CSS section
- Color scheme
- Slide transitions (by modifying the Marp directives)
- Images (replace the logos in the Logos folder)

## Usage

This slide deck is designed for use in the Arbitrum Pulse Bootcamps (May 15 - June 2, 2025) across Ethiopia, Kenya, South Africa, Uganda, and Rwanda. 