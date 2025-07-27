"use client"

import { useState } from "react"
import { formatPrice, formatPriceWithCurrency, formatDiscount } from "@/lib/price-utils"

export default function TestPriceFormatPage() {
  const [testPrice, setTestPrice] = useState(1234.56)
  
  // Test cases for price formatting
  const testCases = [
    { price: 100, description: "Basic price" },
    { price: 1000, description: "Thousands" },
    { price: 1234.56, description: "Decimal price" },
    { price: 12345.67, description: "Five digits with decimals" },
    { price: 100000, description: "Six digits" },
    { price: 1234567.89, description: "Seven digits with decimals" },
    { price: 50.00, description: "Even dollars" },
    { price: 99.99, description: "Price ending in .99" }
  ]
  
  // Test cases for discounts
  const discountTestCases = [
    { original: 100, discounted: 80, description: "20% discount" },
    { original: 1250, discounted: 1000, description: "20% on larger amount" },
    { original: 999.99, discounted: 799.99, description: "Discount on .99 price" },
    { original: 5000, discounted: 3500, description: "30% discount" }
  ]
  
  const calculateDiscount = (original, discounted) => {
    return ((original - discounted) / original) * 100
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Test Price Formatting</h1>
        
        {/* Interactive Test */}
        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Interactive Price Test</h2>
          <div className="flex items-center space-x-4 mb-4">
            <label className="font-medium">Enter a price:</label>
            <input 
              type="number"
              step="0.01"
              value={testPrice}
              onChange={(e) => setTestPrice(parseFloat(e.target.value) || 0)}
              className="border border-gray-300 rounded px-3 py-2 w-32"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Before (without formatting):</h3>
              <p className="text-lg">${testPrice}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded">
              <h3 className="font-semibold mb-2 text-green-800">After (with formatting):</h3>
              <p className="text-lg text-green-700">{formatPriceWithCurrency(testPrice)}</p>
            </div>
          </div>
        </div>
        
        {/* Predefined Test Cases */}
        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Price Formatting Test Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testCases.map((testCase, index) => (
              <div key={index} className="border border-gray-200 rounded p-4">
                <h3 className="font-semibold text-blue-800 mb-2">{testCase.description}</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Original:</p>
                    <p className="text-lg">${testCase.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Formatted:</p>
                    <p className="text-lg text-green-700 font-semibold">
                      {formatPriceWithCurrency(testCase.price)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Discount Test Cases */}
        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Discount Formatting Test Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {discountTestCases.map((testCase, index) => {
              const discountPercentage = calculateDiscount(testCase.original, testCase.discounted)
              
              return (
                <div key={index} className="border border-gray-200 rounded p-6">
                  <h3 className="font-semibold text-blue-800 mb-4">{testCase.description}</h3>
                  
                  {/* Price Display */}
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPriceWithCurrency(testCase.discounted)}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      {formatPriceWithCurrency(testCase.original)}
                    </span>
                    <span className="text-lg text-red-500 font-semibold">
                      {formatDiscount(discountPercentage)}
                    </span>
                  </div>
                  
                  {/* Calculation Details */}
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Original:</strong> {formatPriceWithCurrency(testCase.original)}</p>
                    <p><strong>Discounted:</strong> {formatPriceWithCurrency(testCase.discounted)}</p>
                    <p><strong>Savings:</strong> {formatPriceWithCurrency(testCase.original - testCase.discounted)}</p>
                    <p><strong>Discount:</strong> {discountPercentage.toFixed(1)}%</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Cart Total Simulation */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Cart Total Simulation</h2>
          <div className="space-y-4">
            
            {/* Desktop Cart Style */}
            <div className="border p-4 rounded">
              <h3 className="font-semibold mb-2">Desktop Cart Style:</h3>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">Total:</span>
                <span className="text-lg font-bold text-red-600">
                  {formatPriceWithCurrency(2500.75)}
                </span>
              </div>
            </div>
            
            {/* Mobile Cart Style */}
            <div className="border p-4 rounded">
              <h3 className="font-semibold mb-2">Mobile Cart Style:</h3>
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-red-600">
                  {formatPriceWithCurrency(2500.75)}
                </span>
              </div>
            </div>
            
            {/* Product Card Style */}
            <div className="border p-4 rounded">
              <h3 className="font-semibold mb-2">Product Card Style:</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-gray-900">
                  {formatPriceWithCurrency(1250.00)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatPriceWithCurrency(1500.00)}
                </span>
                <span className="text-sm text-red-500 font-semibold">
                  -17%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 