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
			fontFamily: {
				'doubao': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
			},
			fontSize: {
				'doubao-xs': ['11px', { lineHeight: '1.4', fontWeight: '400' }],
				'doubao-sm': ['13px', { lineHeight: '1.4', fontWeight: '400' }],
				'doubao-base': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
				'doubao-lg': ['16px', { lineHeight: '1.4', fontWeight: '400' }],
				'doubao-xl': ['18px', { lineHeight: '1.4', fontWeight: '500' }],
				'doubao-2xl': ['20px', { lineHeight: '1.3', fontWeight: '600' }],
			},
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
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				doubao: {
					'primary-blue': 'hsl(var(--doubao-primary-blue))',
					'primary-blue-dark': 'hsl(var(--doubao-primary-blue-dark))',
					'secondary-blue': 'hsl(var(--doubao-secondary-blue))',
					'purple': 'hsl(var(--doubao-purple))',
					'purple-light': 'hsl(var(--doubao-purple-light))',
					'bg-primary': 'hsl(var(--doubao-bg-primary))',
					'bg-secondary': 'hsl(var(--doubao-bg-secondary))',
					'bg-tertiary': 'hsl(var(--doubao-bg-tertiary))',
					'bg-sidebar': 'hsl(var(--doubao-bg-sidebar))',
					'text-primary': 'hsl(var(--doubao-text-primary))',
					'text-secondary': 'hsl(var(--doubao-text-secondary))',
					'text-tertiary': 'hsl(var(--doubao-text-tertiary))',
					'text-muted': 'hsl(var(--doubao-text-muted))',
					'user-bubble': 'hsl(var(--doubao-user-bubble))',
					'user-bubble-dark': 'hsl(var(--doubao-user-bubble-dark))',
					'ai-bubble': 'hsl(var(--doubao-ai-bubble))',
					'ai-bubble-text': 'hsl(var(--doubao-ai-bubble-text))',
					'border-light': 'hsl(var(--doubao-border-light))',
					'border-medium': 'hsl(var(--doubao-border-medium))',
					'border-strong': 'hsl(var(--doubao-border-strong))',
					'hover': 'hsl(var(--doubao-hover))',
					'active': 'hsl(var(--doubao-active))',
					'focus': 'hsl(var(--doubao-focus))'
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
				// Doubao-specific keyframes
				'doubao-fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'doubao-slide-in-left': {
					'0%': {
						opacity: '0',
						transform: 'translateX(-20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'doubao-slide-in-right': {
					'0%': {
						opacity: '0',
						transform: 'translateX(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'doubao-typing-dots': {
					'0%, 60%, 100%': {
						transform: 'translateY(0)'
					},
					'30%': {
						transform: 'translateY(-10px)'
					}
				},
				'doubao-pulse-glow': {
					'0%, 100%': {
						boxShadow: '0 0 0 0 rgba(74, 144, 226, 0.4)'
					},
					'50%': {
						boxShadow: '0 0 0 8px rgba(74, 144, 226, 0)'
					}
				},
				'doubao-scale-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'doubao-shimmer': {
					'0%': {
						backgroundPosition: '-200% 0'
					},
					'100%': {
						backgroundPosition: '200% 0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fadeIn 0.3s ease-out forwards',
				'slide-up': 'slideUp 0.4s ease-out forwards',
				'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				// Doubao-specific animations
				'doubao-fade-in': 'doubao-fade-in 0.3s ease-out forwards',
				'doubao-slide-in-left': 'doubao-slide-in-left 0.2s ease-out forwards',
				'doubao-slide-in-right': 'doubao-slide-in-right 0.2s ease-out forwards',
				'doubao-typing-dots': 'doubao-typing-dots 1.4s infinite ease-in-out',
				'doubao-pulse-glow': 'doubao-pulse-glow 2s infinite',
				'doubao-scale-in': 'doubao-scale-in 0.15s ease-out forwards',
				'doubao-shimmer': 'doubao-shimmer 2s linear infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
