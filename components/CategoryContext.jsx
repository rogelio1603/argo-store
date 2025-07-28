"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { getCategoryConfig, getSubcategories, getSubcategoryBySlug, initializeCategoriesConfig } from '@/lib/categories'

const CategoryContext = createContext()

export const useCategory = () => {
  const context = useContext(CategoryContext)
  if (!context) {
    throw new Error('useCategory must be used within a CategoryProvider')
  }
  return context
}

export const CategoryProvider = ({ children, initialCategory = 'all', initialSubcategory = null }) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory)
  const [isConfigLoaded, setIsConfigLoaded] = useState(false)

  // Initialize dynamic categories config
  useEffect(() => {
    const loadCategoriesConfig = async () => {
      try {
        await initializeCategoriesConfig()
        setIsConfigLoaded(true)
      } catch (error) {
        console.error('Error loading dynamic categories config:', error)
        setIsConfigLoaded(true) // Still set to true to avoid infinite loading
      }
    }

    loadCategoriesConfig()
  }, [])

  const updateCategory = (category, subcategory = null) => {
    setSelectedCategory(category)
    setSelectedSubcategory(subcategory)
  }

  const getCurrentConfig = () => {
    const config = getCategoryConfig(selectedCategory)
    
    // If there's a subcategory, modify the config
    if (selectedSubcategory) {
      const subcategoryData = getSubcategoryBySlug(selectedCategory, selectedSubcategory)
      if (subcategoryData) {
        return {
          ...config,
          title: subcategoryData.name,
          subtitle: subcategoryData.description,
          sectionTitle: subcategoryData.name,
          sectionSubtitle: `Productos específicos de ${subcategoryData.name.toLowerCase()}`
        }
      }
    }
    
    return config
  }

  const getSubcategoriesList = () => {
    return getSubcategories(selectedCategory)
  }

  const value = {
    selectedCategory,
    selectedSubcategory,
    updateCategory,
    getCurrentConfig,
    getSubcategoriesList,
    isConfigLoaded
  }

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  )
} 