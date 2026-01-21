export default function TestMediaPage() {
  return (
    <div className="p-8 space-y-4">
      <h1>Media Test Page</h1>
      
      <div>
        <h2>Test Image URLs:</h2>
        <div className="space-y-2">
          <img 
            src="https://zrbmptifkuelqemzmxbm.supabase.co/storage/v1/object/public/media/web/nyce days family-178.thumb.webp"
            alt="Test 1"
            className="w-32 h-auto border"
            onError={(e) => console.error('Image 1 failed to load')}
            onLoad={() => console.log('Image 1 loaded successfully')}
          />
          <img 
            src="https://zrbmptifkuelqemzmxbm.supabase.co/storage/v1/object/public/media/web/nyce days family-150.thumb.webp"
            alt="Test 2" 
            className="w-32 h-auto border"
            onError={(e) => console.error('Image 2 failed to load')}
            onLoad={() => console.log('Image 2 loaded successfully')}
          />
        </div>
      </div>
      
      <div>
        <h2>Manifest Test:</h2>
        <button 
          onClick={async () => {
            try {
              const response = await fetch('/manifest.json')
              const data = await response.json()
              console.log('Manifest loaded:', data.items?.length, 'items')
              console.log('First item:', data.items[0])
            } catch (error) {
              console.error('Manifest error:', error)
            }
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Test Manifest Load
        </button>
      </div>
    </div>
  )
}