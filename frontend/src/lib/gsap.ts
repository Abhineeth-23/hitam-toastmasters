import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP)

CustomEase.create('curtain', 'M0,0 C0.7,0 0.15,1 1,1')
CustomEase.create('expo', '0.16, 1, 0.3, 1')
CustomEase.create('swing', 'M0,0 C0.25,0 0.2,1.12 0.6,1.04 0.8,1 0.9,1 1,1')

gsap.defaults({ ease: 'expo', duration: 1 })

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches

export { gsap, ScrollTrigger, SplitText, useGSAP }
