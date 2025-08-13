import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Ayana therapeutic colors
				ayana: {
					primary: 'hsl(var(--ayana-primary))',
					secondary: 'hsl(var(--ayana-secondary))',
					warm: 'hsl(var(--ayana-warm))',
					sage: 'hsl(var(--ayana-sage))',
					text: 'hsl(var(--ayana-text))',
					'text-soft': 'hsl(var(--ayana-text-soft))'
				},
				breathing: {
					primary: 'hsl(var(--breathing-primary))',
					secondary: 'hsl(var(--breathing-secondary))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'breathe': {
					'0%, 100%': {
						transform: 'scale(0.8)',
						opacity: '0.6'
					},
					'50%': {
						transform: 'scale(1.2)',
						opacity: '1'
					}
				},
				'gentle-pulse': {
					'0%, 100%': {
						opacity: '0.8'
					},
					'50%': {
						opacity: '1'
					}
				},
				'typing': {
					'0%': {
						width: '0'
					},
					'100%': {
						width: '100%'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.4s ease-out',
				'breathe': 'breathe 4s ease-in-out infinite',
				'gentle-pulse': 'gentle-pulse 2s ease-in-out infinite',
				'typing': 'typing 1.5s steps(20, end)'
			},
			backgroundImage: {
				'gradient-calming': 'var(--gradient-calming)',
				'gradient-breathing': 'var(--gradient-breathing)'
			},
			boxShadow: {
				'gentle': 'var(--shadow-gentle)',
				'card': 'var(--shadow-card)'
			},
			transitionTimingFunction: {
				'gentle': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'breathing': 'cubic-bezier(0.4, 0, 0.6, 1)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
