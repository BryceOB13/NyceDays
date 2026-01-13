"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface TextRevealProps {
  children: string
  className?: string
}

export function TextReveal({ children, className = "" }: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.3"],
  })

  const words = children.split(" ")

  return (
    <div ref={containerRef} className={className}>
      <p className="flex flex-wrap justify-center">
        {words.map((word, i) => {
          const start = i / words.length
          const end = start + 1 / words.length
          return (
            <Word key={i} progress={scrollYProgress} range={[start, end]}>
              {word}
            </Word>
          )
        })}
      </p>
    </div>
  )
}

interface WordProps {
  children: string
  progress: ReturnType<typeof useScroll>["scrollYProgress"]
  range: [number, number]
}

function Word({ children, progress, range }: WordProps) {
  const opacity = useTransform(progress, range, [0.2, 1])
  const y = useTransform(progress, range, [10, 0])

  return (
    <span className="relative mr-2 mt-1">
      <motion.span
        style={{ opacity, y }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </span>
  )
}

interface CharacterRevealProps {
  children: string
  className?: string
  highlightWords?: string[]
}

export function CharacterReveal({ children, className = "", highlightWords = [] }: CharacterRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.25"],
  })

  const words = children.split(" ")

  return (
    <div ref={containerRef} className={className}>
      <p className="flex flex-wrap justify-center leading-tight">
        {words.map((word, wordIndex) => {
          const isHighlight = highlightWords.some(hw => word.toLowerCase().includes(hw.toLowerCase()))
          const chars = word.split("")
          
          return (
            <span key={wordIndex} className="mr-3 inline-flex">
              {chars.map((char, charIndex) => {
                const totalChars = children.replace(/ /g, "").length
                const charPosition = children.slice(0, children.indexOf(word) + charIndex).replace(/ /g, "").length
                const start = charPosition / totalChars
                const end = Math.min(start + 0.1, 1)
                
                return (
                  <Character
                    key={charIndex}
                    progress={scrollYProgress}
                    range={[start, end]}
                    isHighlight={isHighlight}
                  >
                    {char}
                  </Character>
                )
              })}
            </span>
          )
        })}
      </p>
    </div>
  )
}

interface CharacterProps {
  children: string
  progress: ReturnType<typeof useScroll>["scrollYProgress"]
  range: [number, number]
  isHighlight?: boolean
}

function Character({ children, progress, range, isHighlight }: CharacterProps) {
  const opacity = useTransform(progress, range, [0, 1])
  const y = useTransform(progress, range, [50, 0])
  const blur = useTransform(progress, range, [10, 0])

  return (
    <motion.span
      style={{ 
        opacity, 
        y,
        filter: useTransform(blur, (v) => `blur(${v}px)`),
      }}
      className={`inline-block ${isHighlight ? "text-nd-red" : ""}`}
    >
      {children}
    </motion.span>
  )
}
