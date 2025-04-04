"use client"

import type React from "react"

import { useState, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Clock,
  PenToolIcon as Tool,
  Cog,
  Code2,
  Binary,
  Laptop2,
  TestTube2,
  FlaskRoundIcon as Flask,
  Microscope,
  Gauge,
  Zap,
  Cpu,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"

type Phase = {
  name: string
  progress: number
}

type Status = "completed" | "in-progress" | "pending"

interface StatusCardProps {
  icon: React.ElementType
  text: string
  animationIcons: React.ElementType[]
  status?: Status
}

interface UnderConstructionProps {
  stopAtPhase?: string
  title?: string
  description?: string
}

function StatusCard({ icon: Icon, text, animationIcons, status = "in-progress" }: StatusCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const statusColors: Record<Status, string> = {
    completed: "bg-green-50/80 text-green-600",
    "in-progress": "bg-indigo-50/80 text-indigo-600",
    pending: "bg-slate-50/80 text-slate-600",
  }

  const StatusIcon = {
    completed: CheckCircle2,
    "in-progress": Clock,
    pending: AlertCircle,
  }[status]

  return (
    <motion.div
      className={`relative flex flex-col items-center p-6 rounded-xl 
        bg-white/50 backdrop-blur shadow-lg group hover:shadow-xl
        transition-shadow duration-300 border border-slate-100`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className={`absolute inset-0 ${statusColors[status]} backdrop-blur-sm 
              rounded-xl p-4 flex items-center justify-center overflow-hidden`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {animationIcons.map((AnimIcon, index) => (
                <motion.div
                  key={index}
                  className="absolute"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: [0.4, 1, 0.4],
                    scale: [0.8, 1.2, 0.8],
                    y: [0, -15, 0],
                    x: [(index - 1) * 30, (index - 1) * 35, (index - 1) * 30],
                  }}
                  transition={{
                    duration: 2,
                    delay: index * 0.3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <AnimIcon className="w-6 h-6" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-3 right-3">
        <StatusIcon className="w-5 h-5" />
      </div>

      <Icon className={`w-10 h-10 mb-4 transition-transform duration-300 ${isHovered ? "scale-110" : ""}`} />

      <p className="text-slate-700 font-medium text-center relative z-10">{text}</p>
    </motion.div>
  )
}

export default function UnderConstruction({
  stopAtPhase = "Tests",
  title = "En cours de construction",
  description = "Cette fonctionnalité est en cours de développement pour vous offrir une expérience exceptionnelle.",
}: UnderConstructionProps) {
  const [progress, setProgress] = useState(0)
  const [currentPhase, setCurrentPhase] = useState(0)
  const currentPhaseRef = useRef(currentPhase)
  const [shouldStop, setShouldStop] = useState(false)
  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)

  // Stabilisation du tableau des phases
  const phases: Phase[] = useMemo(
    () => [
      { name: "Analyse", progress: 100 },
      { name: "Développement", progress: 45 },
      { name: "Tests", progress: 70 },
      { name: "Optimisation", progress: 90 },
    ],
    [],
  )

  // On trouve l'indice de la phase où arrêter
  const stopPhaseIndex = useMemo(() => {
    if (!stopAtPhase) return -1
    return phases.findIndex((phase) => phase.name === stopAtPhase)
  }, [stopAtPhase, phases])

  // Mise à jour de la référence currentPhase
  useEffect(() => {
    currentPhaseRef.current = currentPhase
  }, [currentPhase])

  // Vérifier si on doit s'arrêter à cette phase
  useEffect(() => {
    if (stopPhaseIndex !== -1 && currentPhase === stopPhaseIndex) {
      setShouldStop(true)
    } else {
      setShouldStop(false)
    }
  }, [currentPhase, stopPhaseIndex])

  // Animation fluide comme de l'eau
  const animateProgress = (timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp
    const deltaTime = timestamp - lastTimeRef.current
    lastTimeRef.current = timestamp

    setProgress((prev) => {
      const phase = phases[currentPhaseRef.current]
      if (!phase) return prev

      // Si on doit s'arrêter à cette phase et qu'on a atteint la progression cible
      if (shouldStop && prev >= phase.progress) {
        return phase.progress
      }

      // Calcul de la vitesse d'animation (plus fluide)
      const speed = 0.05 * deltaTime

      if (prev < phase.progress) {
        return Math.min(prev + speed, phase.progress)
      } else {
        // On a atteint la progression cible pour cette phase
        if (shouldStop) {
          return phase.progress
        }

        if (currentPhaseRef.current < phases.length - 1) {
          // Passer à la phase suivante
          setCurrentPhase(currentPhaseRef.current + 1)
          return 0
        } else {
          // On a terminé toutes les phases
          return phase.progress
        }
      }
    })

    // Continuer l'animation
    animationRef.current = requestAnimationFrame(animateProgress)
  }

  // Démarrer/arrêter l'animation
  useEffect(() => {
    // Démarrer l'animation
    animationRef.current = requestAnimationFrame(animateProgress)

    // Nettoyer l'animation
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [shouldStop]) // Redémarrer l'animation quand shouldStop change

  return (
    <div className="relative  from-indigo-50 px-[400px] via-slate-50 to-purple-50 flex items-center justify-center p-6 overflow-hidden rounded-lg">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10 pointer-events-none">
        {[...Array(144)].map((_, i) => (
          <motion.div
            key={i}
            className="border border-indigo-200"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              delay: i * 0.05,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <motion.div
        className="relative z-9 max-w-5xl mx-auto w-full"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Main Content */}
        <motion.div
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-950 mb-2 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {title}
          </motion.h1>

          <motion.div
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-xl text-slate-600 text-center max-w-2xl mx-auto">
              {description} Nous travaillons actuellement sur la phase{" "}
              <span className="font-semibold text-indigo-600">{phases[currentPhase]?.name ?? "Initialisation"}</span>.
            </p>

            {/* Progress Indicator */}
            <div className="relative">
              <div className="flex justify-between mb-2 text-sm text-slate-500">
                {phases.map((phase, index) => (
                  <div key={index} className={`${index <= currentPhase ? "text-indigo-600 font-medium" : ""}`}>
                    {phase.name}
                  </div>
                ))}
              </div>

              {/* Barre de progression fluide comme de l'eau */}
              <div className="relative h-5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                {/* Fond de la barre avec effet d'eau */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-200 to-slate-100"></div>

                {/* Effet d'eau animé */}
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-r-full"
                  style={{ width: `${progress}%` }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
                >
                  {/* Vagues animées */}
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <motion.path
                        id="wave1"
                        d="M 0 20 Q 20 15, 40 20 T 80 20 T 120 20 T 160 20 T 200 20"
                        animate={{
                          d: [
                            "M 0 20 Q 20 15, 40 20 T 80 20 T 120 20 T 160 20 T 200 20",
                            "M 0 20 Q 20 25, 40 20 T 80 20 T 120 20 T 160 20 T 200 20",
                            "M 0 20 Q 20 15, 40 20 T 80 20 T 120 20 T 160 20 T 200 20",
                          ],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                    </defs>
                    <g>
                      <use href="#wave1" fill="rgba(255, 255, 255, 0.2)" />
                    </g>
                  </svg>

                  {/* Bulles animées */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full bg-white/30"
                      style={{
                        width: `${4 + Math.random() * 6}px`,
                        height: `${4 + Math.random() * 6}px`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [0, -20],
                        opacity: [0, 0.8, 0],
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: Math.random() * 2,
                      }}
                    />
                  ))}

                  {/* Pourcentage */}
                  <div className="absolute right-2 inset-y-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white drop-shadow-md">{Math.round(progress)}%</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Status Updates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <StatusCard
                icon={Code2}
                text="Développement actif"
                animationIcons={[Binary, Laptop2, Tool]}
                status={currentPhase >= 1 ? "completed" : currentPhase === 0 ? "in-progress" : "pending"}
              />
              <StatusCard
                icon={TestTube2}
                text="Tests approfondis"
                animationIcons={[Flask, Microscope, Gauge]}
                status={currentPhase >= 2 ? "completed" : currentPhase === 1 ? "in-progress" : "pending"}
              />
              <StatusCard
                icon={Cog}
                text="Optimisation continue"
                animationIcons={[Zap, Cpu, Tool]}
                status={currentPhase >= 3 ? "completed" : currentPhase === 2 ? "in-progress" : "pending"}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full pointer-events-none"
          style={{
            background: `rgba(${Math.random() * 100 + 79}, ${Math.random() * 50 + 70}, ${Math.random() * 255}, 0.2)`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -150, 0],
            x: [0, Math.random() * 100 - 50, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 2.5, 1],
          }}
          transition={{
            duration: 8 + i,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: i * 0.7,
          }}
        />
      ))}
    </div>
  )
}

