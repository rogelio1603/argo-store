"use client"

import React, { createContext, useContext, useState } from 'react'
import { getCategoryConfig, getSubcategories, getSubcategoryBySlug } from '@/lib/categories'

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
    getSubcategoriesList
  }

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  )
} 