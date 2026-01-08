"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, Plus, Phone, Calendar, Star, Award, DollarSign } from "lucide-react"
import { BlurPanel } from "./blur-panel"

interface QuickLookModalProps {
  product: any
  isOpen: boolean
  onClose: () => void
  isInstructor?: boolean
}

export function QuickLookModal({ product, isOpen, onClose, isInstructor = false }: QuickLookModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedSwatch, setSelectedSwatch] = useState(0)

  if (!product) return null

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.quickLookImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.quickLookImages.length) % product.quickLookImages.length)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <BlurPanel className="bg-white/95 backdrop-blur-md">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                {/* Image Gallery */}
                <div className="relative">
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
                    <Image
                      src={product.quickLookImages[currentImageIndex] || "/placeholder.svg"}
                      alt={`${product.name} - Image ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />

                    {/* Navigation Arrows */}
                    {product.quickLookImages.length > 1 && (
                      <>
                        <button
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-200"
                          onClick={prevImage}
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-200"
                          onClick={nextImage}
                        >
                          <ChevronRight size={20} />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Image Thumbnails */}
                  {product.quickLookImages.length > 1 && (
                    <div className="flex gap-2">
                      {product.quickLookImages.map((image: string, index: number) => (
                        <button
                          key={index}
                          className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                            currentImageIndex === index ? "border-neutral-900" : "border-neutral-200"
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`${product.name} thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {isInstructor ? (
                  // Instructor Details
                  <div className="flex flex-col max-h-[70vh]">
                    <div className="flex items-start justify-between mb-6 flex-shrink-0">
                      <div>
                        <h2 className="text-3xl font-bold text-neutral-900 mb-2">{product.name}</h2>
                        <p className="text-lg text-neutral-600">{product.role}</p>
                      </div>
                      <button
                        className="p-2 hover:bg-neutral-100 rounded-full transition-colors duration-200"
                        onClick={onClose}
                      >
                        <X size={24} />
                      </button>
                    </div>

                    <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-neutral-100">
                      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-4 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm opacity-90 mb-1">Valor da Aula</p>
                            <p className="text-3xl font-bold">R$ {product.hourlyRate}</p>
                            <p className="text-sm opacity-90">por hora</p>
                          </div>
                          <DollarSign className="w-12 h-12 opacity-30" />
                        </div>
                      </div>

                      {/* Experience & Rating */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                          <span className="text-lg font-semibold">{product.rating}</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-600">
                          <Award className="w-4 h-4" />
                          <span className="text-sm">{product.experience}</span>
                        </div>
                      </div>

                      {/* Students Count */}
                      <div>
                        <p className="text-lg font-medium text-green-600">{product.students}</p>
                      </div>

                      {/* Bio */}
                      <div>
                        <h4 className="text-sm font-medium text-neutral-900 mb-2">SOBRE</h4>
                        <p className="text-neutral-600 leading-relaxed">{product.bio}</p>
                      </div>

                      {/* Specialties */}
                      <div>
                        <h4 className="text-sm font-medium text-neutral-900 mb-3">ESPECIALIDADES</h4>
                        <div className="flex flex-wrap gap-2">
                          {product.specialties.map((specialty: string, index: number) => (
                            <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Availability */}
                      <div>
                        <h4 className="text-sm font-medium text-neutral-900 mb-2">DISPONIBILIDADE</h4>
                        <div className="flex items-center gap-2 text-neutral-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{product.availability}</span>
                        </div>
                      </div>

                      {/* Contact */}
                      <div>
                        <h4 className="text-sm font-medium text-neutral-900 mb-2">CONTATO</h4>
                        <div className="flex items-center gap-2 text-neutral-600">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{product.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Schedule Button */}
                    <motion.button
                      className="w-full bg-green-600 text-white py-4 rounded-full font-medium text-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2 mt-6 flex-shrink-0"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Calendar size={20} />
                      Agendar Aula
                    </motion.button>
                  </div>
                ) : (
                  // Original Product Details
                  <div className="flex flex-col">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-3xl font-bold text-neutral-900 mb-2">{product.name}</h2>
                        <p className="text-lg text-neutral-600">{product.materials?.join(", ")}</p>
                      </div>
                      <button
                        className="p-2 hover:bg-neutral-100 rounded-full transition-colors duration-200"
                        onClick={onClose}
                      >
                        <X size={24} />
                      </button>
                    </div>

                    <div className="space-y-6 flex-1">
                      <div className="text-2xl font-bold text-neutral-900">{product.price}</div>

                      <div>
                        <h4 className="text-sm font-medium text-neutral-900 mb-2">DIMENSIONS</h4>
                        <p className="text-neutral-600">{product.dimensions}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-neutral-900 mb-3">FINISH</h4>
                        <div className="flex gap-3">
                          {product.swatches?.map((swatch: any, index: number) => (
                            <button
                              key={index}
                              className={`w-8 h-8 rounded-full border-2 transition-all duration-200 relative group ${
                                selectedSwatch === index ? "border-neutral-900 scale-110" : "border-neutral-300"
                              }`}
                              style={{ backgroundColor: swatch.color }}
                              onClick={() => setSelectedSwatch(index)}
                            >
                              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-neutral-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                                {swatch.name}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-neutral-900 mb-3">FEATURES</h4>
                        <ul className="space-y-2 text-sm text-neutral-600">
                          <li>• Sustainably sourced materials</li>
                          <li>• Hand-finished edges</li>
                          <li>• Made to order in Belgium</li>
                          <li>• Lifetime repair program</li>
                        </ul>
                      </div>
                    </div>

                    <motion.button
                      className="w-full bg-neutral-900 text-white py-4 rounded-full font-medium text-lg hover:bg-neutral-800 transition-colors duration-200 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus size={20} />
                      Add to Cart
                    </motion.button>
                  </div>
                )}
              </div>
            </BlurPanel>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
