"use client"

export function ReloadButton() {
  return (
    <button 
      onClick={() => window.location.reload()}
      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
    >
      Intentar de nuevo
    </button>
  )
} 