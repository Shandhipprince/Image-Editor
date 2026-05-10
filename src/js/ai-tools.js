// ====================== AI TOOLS MODULE ======================

// 1. BACKGROUND REMOVAL (using @imgly/background-removal - runs locally!)
export async function removeBackground(imageUrl) {
  try {
    const { removeBackground } = await import('@imgly/background-removal')
    const blob = await removeBackground(imageUrl)
    return URL.createObjectURL(blob)
  } catch (error) {
    console.error('Background removal failed:', error)
    throw new Error('Background removal failed. Please try again.')
  }
}

// 2. AI IMAGE GENERATION (using Replicate API)
export async function generateImage(prompt, apiToken) {
  try {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
        input: {
          prompt: prompt,
          negative_prompt: "ugly, blurry, low quality",
          width: 512,
          height: 512,
          num_outputs: 1
        }
      })
    })
    
    const prediction = await response.json()
    
    // Poll for result
    let result = prediction
    while (result.status !== 'succeeded' && result.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const pollResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        { headers: { 'Authorization': `Token ${apiToken}` } }
      )
      result = await pollResponse.json()
    }
    
    if (result.status === 'succeeded') {
      return result.output[0]
    } else {
      throw new Error('Image generation failed')
    }
  } catch (error) {
    console.error('Image generation failed:', error)
    throw error
  }
}

// 3. AI IMAGE UPSCALING (4x resolution)
export async function upscaleImage(imageUrl, apiToken) {
  try {
    // Convert image to base64
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    const base64 = await blobToBase64(blob)
    
    const apiResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: "42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
        input: {
          image: base64,
          scale: 4,
          face_enhance: true
        }
      })
    })
    
    const prediction = await apiResponse.json()
    
    let result = prediction
    while (result.status !== 'succeeded' && result.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 2000))
      const pollResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        { headers: { 'Authorization': `Token ${apiToken}` } }
      )
      result = await pollResponse.json()
    }
    
    if (result.status === 'succeeded') {
      return result.output
    } else {
      throw new Error('Upscaling failed')
    }
  } catch (error) {
    console.error('Upscaling failed:', error)
    throw error
  }
}

// 4. AI STYLE TRANSFER
export async function applyArtisticStyle(imageUrl, style, apiToken) {
  try {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    const base64 = await blobToBase64(blob)
    
    const styles = {
      'anime': 'prompt: anime style illustration, vibrant colors',
      'oil-painting': 'prompt: oil painting style, textured brushstrokes',
      'watercolor': 'prompt: watercolor painting style, soft edges',
      'pencil-sketch': 'prompt: pencil sketch, detailed linework',
      'cyberpunk': 'prompt: cyberpunk style, neon lights, futuristic',
      'pixel-art': 'prompt: pixel art style, retro game graphics'
    }
    
    const apiResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: "8ebdb28f094cb1a42a4373be85aef65acb381db8e0fdec494c54e68e9f32d4f5",
        input: {
          image: base64,
          prompt: styles[style] || styles['anime'],
          strength: 0.7
        }
      })
    })
    
    const prediction = await apiResponse.json()
    
    let result = prediction
    while (result.status !== 'succeeded' && result.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 2000))
      const pollResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        { headers: { 'Authorization': `Token ${apiToken}` } }
      )
      result = await pollResponse.json()
    }
    
    if (result.status === 'succeeded') {
      return result.output
    } else {
      throw new Error('Style transfer failed')
    }
  } catch (error) {
    console.error('Style transfer failed:', error)
    throw error
  }
}

// 5. AI AUTO ENHANCE (local)
export function autoEnhance(imageElement) {
  // Create a canvas for processing
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = imageElement.width
  canvas.height = imageElement.height
  
  // Apply enhancement filters
  ctx.filter = 'contrast(1.1) saturate(1.2) brightness(1.05)'
  ctx.drawImage(imageElement, 0, 0)
  
  // Apply sharpening
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data
  
  // Simple sharpening kernel
  for (let i = 4; i < data.length - 4; i += 4) {
    data[i] = Math.min(255, data[i] * 1.1 - (data[i-4] + data[i+4]) * 0.05)
    data[i+1] = Math.min(255, data[i+1] * 1.1 - (data[i-3] + data[i+5]) * 0.05)
    data[i+2] = Math.min(255, data[i+2] * 1.1 - (data[i-2] + data[i+6]) * 0.05)
  }
  
  ctx.putImageData(imageData, 0, 0)
  ctx.filter = 'none'
  
  return canvas.toDataURL()
}

// 6. AI COLORIZE (for B&W photos)
export async function colorizeImage(imageUrl, apiToken) {
  try {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    const base64 = await blobToBase64(blob)
    
    const apiResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: "0da600af0ed6a6f1de79c1e20e9ccf8f3b034c60e83518ee79d0b9f14da38b37",
        input: {
          image: base64
        }
      })
    })
    
    const prediction = await apiResponse.json()
    
    let result = prediction
    while (result.status !== 'succeeded' && result.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 2000))
      const pollResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        { headers: { 'Authorization': `Token ${apiToken}` } }
      )
      result = await pollResponse.json()
    }
    
    if (result.status === 'succeeded') {
      return result.output
    } else {
      throw new Error('Colorization failed')
    }
  } catch (error) {
    console.error('Colorization failed:', error)
    throw error
  }
}

// 7. AI FACE DETECTION & ENHANCEMENT
export async function enhanceFaces(imageUrl, apiToken) {
  try {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    const base64 = await blobToBase64(blob)
    
    const apiResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: "7de2ea26c616d5bf2245ad0d5e24f0ff9a6204578a5c876db53142edd9d2cd56",
        input: {
          image: base64,
          upscale: 2,
          face_enhance: true
        }
      })
    })
    
    const prediction = await apiResponse.json()
    
    let result = prediction
    while (result.status !== 'succeeded' && result.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 2000))
      const pollResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        { headers: { 'Authorization': `Token ${apiToken}` } }
      )
      result = await pollResponse.json()
    }
    
    if (result.status === 'succeeded') {
      return result.output
    } else {
      throw new Error('Face enhancement failed')
    }
  } catch (error) {
    console.error('Face enhancement failed:', error)
    throw error
  }
}

// Helper: Convert blob to base64
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// Helper: Show loading toast
export function showLoading(message = 'Processing...') {
  const toast = document.createElement('div')
  toast.className = 'ai-loading-toast'
  toast.innerHTML = `
    <div class="ai-spinner"></div>
    <span>${message}</span>
  `
  document.body.appendChild(toast)
  return toast
}

// Helper: Remove loading toast
export function hideLoading(toast) {
  if (toast && toast.parentNode) {
    toast.remove()
  }
}