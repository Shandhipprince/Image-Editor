/**
 * ============================================================
 * IMPERION STUDIO — Complete Editor Script
 * Fabric.js Canvas, Filters, Crop, Text, Shapes, AI Tools
 * ============================================================
 */

import { auth, onAuthStateChanged, signOut } from './firebase-config.js'

// ============================================================
// 1. AUTHENTICATION
// ============================================================
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = '/index.html'
  } else {
    const emailEl = document.getElementById('userEmail')
    if (emailEl) emailEl.textContent = user.email
    console.log('✅ Authenticated:', user.email)
  }
})

document.getElementById('logoutBtn')?.addEventListener('click', async () => {
  await signOut(auth)
  localStorage.removeItem('user')
  window.location.href = '/index.html'
})

// ============================================================
// 2. DOM REFERENCES
// ============================================================
const $ = (id) => document.getElementById(id)

const fileInput = $('fileInput')
const uploadBtn = $('uploadBtn')
const canvasEmpty = $('canvasEmpty')
const canvasContainer = $('canvasContainer')
const canvasWrapper = $('canvasWrapper')
const mainCanvas = $('mainCanvas')
const canvasArea = $('canvasArea')
const newImageBtn = $('newImageBtn')
const clearCanvasBtn = $('clearCanvasBtn')
const quickCropBtn = $('quickCropBtn')
const quickDownloadBtn = $('quickDownloadBtn')
const zoomLevel = $('zoomLevel')
const fileNameDisplay = $('fileNameDisplay')
const undoBtn = $('undoBtn')
const redoBtn = $('redoBtn')
const zoomInBtn = $('zoomInBtn')
const zoomOutBtn = $('zoomOutBtn')
const cropBtn = $('cropBtn')
const downloadBtn = $('downloadBtn')
const exportFormat = $('exportFormat')
const resetAllBtn = $('resetAllBtn')
const resizeBtn = $('resizeBtn')
const deleteSelectedBtn = $('deleteSelectedBtn')

// Modals
const cropModal = $('cropModal')
const cropImage = $('cropImage')
const closeCropBtn = $('closeCropBtn')
const cancelCropBtn = $('cancelCropBtn')
const applyCropBtn = $('applyCropBtn')
const resizeModal = $('resizeModal')
const closeResizeBtn = $('closeResizeBtn')
const cancelResizeBtn = $('cancelResizeBtn')
const applyResizeBtn = $('applyResizeBtn')
const resizeWidth = $('resizeWidth')
const resizeHeight = $('resizeHeight')
const maintainAspect = $('maintainAspect')

// ============================================================
// 3. FABRIC CANVAS SETUP
// ============================================================
let fabricCanvas = null
let currentImage = null
let historyStack = []
let historyIndex = -1
let isDrawingMode = false
let currentFileName = 'Untitled Project'
let canvasZoom = 1

function initFabricCanvas() {
  if (fabricCanvas) {
    fabricCanvas.dispose()
    fabricCanvas = null
  }

  fabricCanvas = new fabric.Canvas('mainCanvas', {
    backgroundColor: 'transparent',
    preserveObjectStacking: true,
    selection: true
  })

  fabricCanvas.on('object:modified', () => saveHistoryState())
  fabricCanvas.on('object:added', (e) => {
    if (e.target && e.target !== currentImage) saveHistoryState()
  })

  fabricCanvas.on('selection:created', () => {
    if (deleteSelectedBtn) deleteSelectedBtn.style.opacity = '1'
  })

  fabricCanvas.on('selection:cleared', () => {
    if (deleteSelectedBtn) deleteSelectedBtn.style.opacity = '0.4'
  })

  console.log('✅ Fabric canvas initialized')
}

// ============================================================
// 4. HISTORY (UNDO/REDO)
// ============================================================
function saveHistoryState() {
  if (!fabricCanvas) return

  historyStack = historyStack.slice(0, historyIndex + 1)
  const state = JSON.stringify(fabricCanvas.toJSON())
  
  if (historyStack[historyIndex] !== state) {
    historyStack.push(state)
    historyIndex++
    if (historyStack.length > 100) {
      historyStack.shift()
      historyIndex--
    }
  }
  
  updateUndoRedoButtons()
}

function undo() {
  if (historyIndex <= 0) return
  historyIndex--
  loadHistoryState(historyStack[historyIndex])
}

function redo() {
  if (historyIndex >= historyStack.length - 1) return
  historyIndex++
  loadHistoryState(historyStack[historyIndex])
}

function loadHistoryState(state) {
  if (!fabricCanvas) return
  fabricCanvas.loadFromJSON(state, () => {
    fabricCanvas.renderAll()
    updateUndoRedoButtons()
  })
}

function updateUndoRedoButtons() {
  if (undoBtn) undoBtn.disabled = historyIndex <= 0
  if (redoBtn) redoBtn.disabled = historyIndex >= historyStack.length - 1
}

// ============================================================
// 5. IMAGE LOADING
// ============================================================
function loadImage(file) {
  if (!file || !file.type.startsWith('image/')) {
    showToast('Please select a valid image file', 'error')
    return
  }

  if (file.size > 50 * 1024 * 1024) {
    showToast('File size must be under 50MB', 'error')
    return
  }

  currentFileName = file.name
  if (fileNameDisplay) fileNameDisplay.textContent = file.name

  const reader = new FileReader()
  
  reader.onload = (e) => {
    initFabricCanvas()

    fabric.Image.fromURL(e.target.result, (img) => {
      const maxWidth = canvasArea.clientWidth * 0.9
      const maxHeight = canvasArea.clientHeight * 0.85
      const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1)

      fabricCanvas.setWidth(img.width * scale)
      fabricCanvas.setHeight(img.height * scale)

      img.set({
        scaleX: scale,
        scaleY: scale,
        left: 0,
        top: 0,
        selectable: false,
        evented: false,
        excludeFromExport: false
      })

      currentImage = img
      canvasZoom = scale
      
      fabricCanvas.add(img)
      fabricCanvas.sendToBack(img)
      fabricCanvas.renderAll()

      if (zoomLevel) zoomLevel.textContent = Math.round(scale * 100) + '%'
      canvasEmpty.style.display = 'none'
      canvasContainer.style.display = 'flex'

      saveHistoryState()
      resetSliders()
      showToast('Image loaded successfully! 🎉', 'success')
      console.log('✅ Image loaded:', file.name)
    }, { crossOrigin: 'anonymous' })
  }

  reader.onerror = () => {
    showToast('Failed to read file. Please try again.', 'error')
  }

  reader.readAsDataURL(file)
}

// ============================================================
// 6. FILE UPLOAD HANDLERS
// ============================================================
uploadBtn?.addEventListener('click', () => fileInput?.click())
newImageBtn?.addEventListener('click', () => fileInput?.click())

fileInput?.addEventListener('change', (e) => {
  const file = e.target.files[0]
  if (file) {
    loadImage(file)
    fileInput.value = ''
  }
})

// Drag and drop
canvasArea?.addEventListener('dragover', (e) => {
  e.preventDefault()
  e.stopPropagation()
  canvasArea.style.background = 'rgba(99, 102, 241, 0.03)'
})

canvasArea?.addEventListener('dragleave', (e) => {
  e.preventDefault()
  e.stopPropagation()
  canvasArea.style.background = ''
})

canvasArea?.addEventListener('drop', (e) => {
  e.preventDefault()
  e.stopPropagation()
  canvasArea.style.background = ''
  const file = e.dataTransfer.files[0]
  if (file) loadImage(file)
})

// Paste from clipboard
document.addEventListener('paste', (e) => {
  const items = e.clipboardData?.items
  if (!items) return

  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) loadImage(file)
      break
    }
  }
})

// ============================================================
// 7. CLEAR CANVAS
// ============================================================
clearCanvasBtn?.addEventListener('click', () => {
  if (!currentImage && !fabricCanvas?.getObjects()?.length) return

  if (confirm('Clear the canvas? This cannot be undone.')) {
    resetCanvas()
    showToast('Canvas cleared', 'info')
  }
})

function resetCanvas() {
  if (fabricCanvas) {
    fabricCanvas.clear()
    fabricCanvas.dispose()
    fabricCanvas = null
  }
  currentImage = null
  historyStack = []
  historyIndex = -1
  canvasZoom = 1
  currentFileName = 'Untitled Project'

  if (fileNameDisplay) fileNameDisplay.textContent = currentFileName
  if (zoomLevel) zoomLevel.textContent = '100%'
  
  canvasEmpty.style.display = 'flex'
  canvasContainer.style.display = 'none'
  
  updateUndoRedoButtons()
  resetSliders()
}

// ============================================================
// 8. SLIDER CONTROLS
// ============================================================
const brightnessSlider = $('brightness')
const contrastSlider = $('contrast')
const saturationSlider = $('saturation')
const blurSlider = $('blur')
const opacitySlider = $('opacity')

const brightnessValue = $('brightnessValue')
const contrastValue = $('contrastValue')
const saturationValue = $('saturationValue')
const blurValue = $('blurValue')
const opacityValue = $('opacityValue')

function applyImageFilters() {
  if (!currentImage || !fabricCanvas) return

  const brightness = parseInt(brightnessSlider?.value || 0) / 100
  const contrast = parseInt(contrastSlider?.value || 0) / 100
  const saturation = parseInt(saturationSlider?.value || 0) / 100
  const blur = parseFloat(blurSlider?.value || 0)
  const opacity = parseInt(opacitySlider?.value || 100) / 100

  const filters = []

  if (brightness !== 0) {
    filters.push(new fabric.Image.filters.Brightness({ brightness }))
  }
  if (contrast !== 0) {
    filters.push(new fabric.Image.filters.Contrast({ contrast }))
  }
  if (saturation !== 0) {
    filters.push(new fabric.Image.filters.Saturation({ saturation }))
  }
  if (blur > 0) {
    filters.push(new fabric.Image.filters.Blur({ blur }))
  }

  currentImage.filters = filters
  currentImage.set('opacity', opacity)
  currentImage.applyFilters()
  fabricCanvas.renderAll()
}

function resetSliders() {
  if (brightnessSlider) brightnessSlider.value = 0
  if (contrastSlider) contrastSlider.value = 0
  if (saturationSlider) saturationSlider.value = 0
  if (blurSlider) blurSlider.value = 0
  if (opacitySlider) opacitySlider.value = 100

  if (brightnessValue) brightnessValue.textContent = '0'
  if (contrastValue) contrastValue.textContent = '0'
  if (saturationValue) saturationValue.textContent = '0'
  if (blurValue) blurValue.textContent = '0'
  if (opacityValue) opacityValue.textContent = '100%'
}

// Slider event listeners
const sliders = [
  { slider: brightnessSlider, value: brightnessValue, unit: '' },
  { slider: contrastSlider, value: contrastValue, unit: '' },
  { slider: saturationSlider, value: saturationValue, unit: '' },
  { slider: blurSlider, value: blurValue, unit: '' },
  { slider: opacitySlider, value: opacityValue, unit: '%' }
]

sliders.forEach(({ slider, value, unit }) => {
  slider?.addEventListener('input', () => {
    if (value) value.textContent = slider.value + unit
    applyImageFilters()
  })
})

// ============================================================
// 9. TRANSFORM CONTROLS
// ============================================================
$('rotateLeftBtn')?.addEventListener('click', () => {
  if (!currentImage) return showToast('Upload an image first', 'error')
  currentImage.rotate((currentImage.angle || 0) - 90)
  fabricCanvas.renderAll()
  saveHistoryState()
})

$('rotateRightBtn')?.addEventListener('click', () => {
  if (!currentImage) return showToast('Upload an image first', 'error')
  currentImage.rotate((currentImage.angle || 0) + 90)
  fabricCanvas.renderAll()
  saveHistoryState()
})

$('flipHBtn')?.addEventListener('click', () => {
  if (!currentImage) return showToast('Upload an image first', 'error')
  currentImage.set('flipX', !currentImage.flipX)
  fabricCanvas.renderAll()
  saveHistoryState()
})

$('flipVBtn')?.addEventListener('click', () => {
  if (!currentImage) return showToast('Upload an image first', 'error')
  currentImage.set('flipY', !currentImage.flipY)
  fabricCanvas.renderAll()
  saveHistoryState()
})

// ============================================================
// 10. ZOOM CONTROLS
// ============================================================
zoomInBtn?.addEventListener('click', () => {
  if (!fabricCanvas || !currentImage) return
  const newZoom = Math.min(canvasZoom * 1.2, 5)
  const scale = newZoom / canvasZoom
  canvasZoom = newZoom
  fabricCanvas.setZoom(canvasZoom)
  fabricCanvas.setWidth(currentImage.width * currentImage.scaleX * canvasZoom)
  fabricCanvas.setHeight(currentImage.height * currentImage.scaleY * canvasZoom)
  fabricCanvas.renderAll()
  if (zoomLevel) zoomLevel.textContent = Math.round(canvasZoom * 100) + '%'
})

zoomOutBtn?.addEventListener('click', () => {
  if (!fabricCanvas || !currentImage) return
  const newZoom = Math.max(canvasZoom / 1.2, 0.1)
  const scale = newZoom / canvasZoom
  canvasZoom = newZoom
  fabricCanvas.setZoom(canvasZoom)
  fabricCanvas.setWidth(currentImage.width * currentImage.scaleX * canvasZoom)
  fabricCanvas.setHeight(currentImage.height * currentImage.scaleY * canvasZoom)
  fabricCanvas.renderAll()
  if (zoomLevel) zoomLevel.textContent = Math.round(canvasZoom * 100) + '%'
})

// ============================================================
// 11. CROP FUNCTIONALITY
// ============================================================
let cropperInstance = null

cropBtn?.addEventListener('click', openCropModal)
quickCropBtn?.addEventListener('click', openCropModal)

function openCropModal() {
  if (!currentImage || !fabricCanvas) {
    return showToast('Upload an image first', 'error')
  }

  const dataURL = fabricCanvas.toDataURL({ format: 'png', multiplier: 2 })
  cropImage.src = dataURL
  cropModal.classList.add('active')
}

cropImage.addEventListener('load', () => {
  if (cropperInstance) cropperInstance.destroy()

  cropperInstance = new Cropper(cropImage, {
    viewMode: 1,
    autoCropArea: 0.85,
    responsive: true,
    background: false,
    modal: true,
    guides: true,
    center: true,
    highlight: true,
    cropBoxMovable: true,
    cropBoxResizable: true,
    dragMode: 'move'
  })
})

function closeCropModal() {
  cropModal.classList.remove('active')
  if (cropperInstance) {
    cropperInstance.destroy()
    cropperInstance = null
  }
}

closeCropBtn?.addEventListener('click', closeCropModal)
cancelCropBtn?.addEventListener('click', closeCropModal)

cropModal?.addEventListener('click', (e) => {
  if (e.target === cropModal) closeCropModal()
})

applyCropBtn?.addEventListener('click', () => {
  if (!cropperInstance) return

  const croppedCanvas = cropperInstance.getCroppedCanvas()
  const croppedDataURL = croppedCanvas.toDataURL('image/png')

  fabric.Image.fromURL(croppedDataURL, (img) => {
    if (!fabricCanvas) initFabricCanvas()

    const maxWidth = canvasArea.clientWidth * 0.9
    const maxHeight = canvasArea.clientHeight * 0.85
    const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1)

    fabricCanvas.clear()
    fabricCanvas.setWidth(img.width * scale)
    fabricCanvas.setHeight(img.height * scale)

    img.set({
      scaleX: scale,
      scaleY: scale,
      left: 0,
      top: 0,
      selectable: false,
      evented: false
    })

    currentImage = img
    canvasZoom = scale
    fabricCanvas.add(img)
    fabricCanvas.renderAll()

    if (zoomLevel) zoomLevel.textContent = Math.round(scale * 100) + '%'
    saveHistoryState()
    closeCropModal()
    showToast('Image cropped! ✂️', 'success')
  })
})

// ============================================================
// 12. RESIZE FUNCTIONALITY
// ============================================================
resizeBtn?.addEventListener('click', () => {
  if (!currentImage) return showToast('Upload an image first', 'error')

  const width = Math.round(currentImage.width * currentImage.scaleX)
  const height = Math.round(currentImage.height * currentImage.scaleY)
  
  resizeWidth.value = width
  resizeHeight.value = height
  resizeModal.classList.add('active')
})

closeResizeBtn?.addEventListener('click', () => resizeModal.classList.remove('active'))
cancelResizeBtn?.addEventListener('click', () => resizeModal.classList.remove('active'))

resizeModal?.addEventListener('click', (e) => {
  if (e.target === resizeModal) resizeModal.classList.remove('active')
})

resizeWidth?.addEventListener('input', () => {
  if (maintainAspect?.checked && currentImage) {
    const ratio = currentImage.height / currentImage.width
    resizeHeight.value = Math.round(parseInt(resizeWidth.value) * ratio)
  }
})

resizeHeight?.addEventListener('input', () => {
  if (maintainAspect?.checked && currentImage) {
    const ratio = currentImage.width / currentImage.height
    resizeWidth.value = Math.round(parseInt(resizeHeight.value) * ratio)
  }
})

applyResizeBtn?.addEventListener('click', () => {
  if (!currentImage || !fabricCanvas) return

  const newWidth = parseInt(resizeWidth.value)
  const newHeight = parseInt(resizeHeight.value)

  if (newWidth < 1 || newHeight < 1) {
    return showToast('Invalid dimensions', 'error')
  }

  const scaleX = newWidth / (currentImage.width * currentImage.scaleX)
  const scaleY = newHeight / (currentImage.height * currentImage.scaleY)

  currentImage.scaleX *= scaleX
  currentImage.scaleY *= scaleY
  fabricCanvas.setWidth(newWidth)
  fabricCanvas.setHeight(newHeight)
  fabricCanvas.renderAll()
  saveHistoryState()
  resizeModal.classList.remove('active')
  showToast('Image resized! 📐', 'success')
})

// ============================================================
// 13. SHAPES
// ============================================================
document.querySelectorAll('.shape-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!fabricCanvas) {
      return showToast('Upload an image first', 'error')
    }

    const shape = btn.dataset.shape
    let obj

    switch (shape) {
      case 'rect':
        obj = new fabric.Rect({
          width: 150,
          height: 100,
          fill: '#6366f1',
          rx: 8,
          ry: 8,
          left: 100,
          top: 100
        })
        break
      case 'circle':
        obj = new fabric.Circle({
          radius: 60,
          fill: '#ec4899',
          left: 100,
          top: 100
        })
        break
      case 'triangle':
        obj = new fabric.Triangle({
          width: 120,
          height: 120,
          fill: '#a855f7',
          left: 100,
          top: 100
        })
        break
      case 'line':
        obj = new fabric.Line([50, 100, 250, 100], {
          stroke: '#6366f1',
          strokeWidth: 4,
          strokeLineCap: 'round'
        })
        break
    }

    if (obj) {
      fabricCanvas.add(obj)
      fabricCanvas.setActiveObject(obj)
      fabricCanvas.renderAll()
      saveHistoryState()
    }
  })
})

// ============================================================
// 14. STICKERS
// ============================================================
document.querySelectorAll('.sticker-item').forEach(sticker => {
  sticker.addEventListener('click', () => {
    if (!fabricCanvas) {
      return showToast('Upload an image first', 'error')
    }

    const emoji = sticker.textContent.trim()
    const text = new fabric.Text(emoji, {
      fontSize: 60,
      left: 150,
      top: 150,
      selectable: true,
      fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif'
    })

    fabricCanvas.add(text)
    fabricCanvas.setActiveObject(text)
    fabricCanvas.renderAll()
    saveHistoryState()
  })
})

// ============================================================
// 15. DRAWING MODE
// ============================================================
const drawModeBtn = $('drawModeBtn')
const brushColor = $('brushColor')
const brushSize = $('brushSize')
const brushSizeValue = $('brushSizeValue')

brushColor?.addEventListener('change', () => {
  if (fabricCanvas?.freeDrawingBrush) {
    fabricCanvas.freeDrawingBrush.color = brushColor.value
  }
})

brushSize?.addEventListener('input', () => {
  if (brushSizeValue) brushSizeValue.textContent = brushSize.value
  if (fabricCanvas?.freeDrawingBrush) {
    fabricCanvas.freeDrawingBrush.width = parseInt(brushSize.value)
  }
})

drawModeBtn?.addEventListener('click', () => {
  if (!fabricCanvas) {
    return showToast('Upload an image first', 'error')
  }

  isDrawingMode = !isDrawingMode
  fabricCanvas.isDrawingMode = isDrawingMode

  if (isDrawingMode) {
    fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas)
    fabricCanvas.freeDrawingBrush.color = brushColor?.value || '#6366f1'
    fabricCanvas.freeDrawingBrush.width = parseInt(brushSize?.value || 5)
    drawModeBtn.style.background = 'var(--ed-gradient-primary)'
    drawModeBtn.style.color = 'white'
    drawModeBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><line x1="6" y1="3" x2="6" y2="21"/><line x1="18" y1="3" x2="18" y2="21"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      Drawing Mode Active
    `
    showToast('Drawing mode enabled ✏️', 'info')
  } else {
    drawModeBtn.style.background = ''
    drawModeBtn.style.color = ''
    drawModeBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
      Toggle Drawing Mode
    `
  }
})

// ============================================================
// 16. TEXT TOOL
// ============================================================
$('addTextBtn')?.addEventListener('click', () => {
  if (!fabricCanvas) {
    return showToast('Upload an image first', 'error')
  }

  const textContent = $('textContent')?.value || 'Your Text'
  const fontFamily = $('fontFamily')?.value || 'Arial'
  const fontSize = parseInt($('fontSize')?.value || 40)
  const textColor = $('textColor')?.value || '#ffffff'

  const text = new fabric.Text(textContent, {
    fontFamily,
    fontSize,
    fill: textColor,
    left: 150,
    top: 150,
    selectable: true,
    fontWeight: 'normal',
    fontStyle: 'normal',
    underline: false
  })

  fabricCanvas.add(text)
  fabricCanvas.setActiveObject(text)
  fabricCanvas.renderAll()
  saveHistoryState()
  showToast('Text added! ✏️', 'success')
})

$('textBoldBtn')?.addEventListener('click', () => {
  const obj = fabricCanvas?.getActiveObject()
  if (obj && obj.type === 'text') {
    obj.set('fontWeight', obj.fontWeight === 'bold' ? 'normal' : 'bold')
    fabricCanvas.renderAll()
    saveHistoryState()
  }
})

$('textItalicBtn')?.addEventListener('click', () => {
  const obj = fabricCanvas?.getActiveObject()
  if (obj && obj.type === 'text') {
    obj.set('fontStyle', obj.fontStyle === 'italic' ? 'normal' : 'italic')
    fabricCanvas.renderAll()
    saveHistoryState()
  }
})

$('textUnderlineBtn')?.addEventListener('click', () => {
  const obj = fabricCanvas?.getActiveObject()
  if (obj && obj.type === 'text') {
    obj.set('underline', !obj.underline)
    fabricCanvas.renderAll()
    saveHistoryState()
  }
})

// ============================================================
// 17. FILTER PRESETS
// ============================================================
document.querySelectorAll('.filter-preset').forEach(preset => {
  preset.addEventListener('click', () => {
    if (!currentImage) return showToast('Upload an image first', 'error')

    const filterType = preset.dataset.filter

    // Remove active class from all
    document.querySelectorAll('.filter-preset').forEach(p => p.classList.remove('active'))
    preset.classList.add('active')

    // Reset sliders
    resetSliders()

    // Apply preset filters
    currentImage.filters = []

    switch (filterType) {
      case 'none':
        break
      case 'grayscale':
        currentImage.filters.push(new fabric.Image.filters.Grayscale())
        break
      case 'sepia':
        currentImage.filters.push(new fabric.Image.filters.Sepia())
        break
      case 'vintage':
        currentImage.filters.push(new fabric.Image.filters.Sepia())
        currentImage.filters.push(new fabric.Image.filters.Brightness({ brightness: -0.08 }))
        currentImage.filters.push(new fabric.Image.filters.Contrast({ contrast: 0.15 }))
        break
      case 'cool':
        currentImage.filters.push(new fabric.Image.filters.HueRotation({ rotation: 0.4 }))
        currentImage.filters.push(new fabric.Image.filters.Saturation({ saturation: 0.3 }))
        break
      case 'warm':
        currentImage.filters.push(new fabric.Image.filters.HueRotation({ rotation: -0.08 }))
        currentImage.filters.push(new fabric.Image.filters.Saturation({ saturation: 0.2 }))
        break
      case 'dramatic':
        currentImage.filters.push(new fabric.Image.filters.Contrast({ contrast: 0.4 }))
        currentImage.filters.push(new fabric.Image.filters.Brightness({ brightness: -0.1 }))
        break
      case 'soft':
        currentImage.filters.push(new fabric.Image.filters.Brightness({ brightness: 0.1 }))
        currentImage.filters.push(new fabric.Image.filters.Saturation({ saturation: -0.15 }))
        break
      case 'noir':
        currentImage.filters.push(new fabric.Image.filters.Grayscale())
        currentImage.filters.push(new fabric.Image.filters.Contrast({ contrast: 0.3 }))
        currentImage.filters.push(new fabric.Image.filters.Brightness({ brightness: -0.15 }))
        break
    }

    currentImage.applyFilters()
    fabricCanvas.renderAll()
    saveHistoryState()
    showToast(`Filter applied: ${filterType}`, 'success')
  })
})

// ============================================================
// 18. DOWNLOAD
// ============================================================
downloadBtn?.addEventListener('click', downloadImage)
quickDownloadBtn?.addEventListener('click', downloadImage)

function downloadImage() {
  if (!fabricCanvas) {
    return showToast('Nothing to download', 'error')
  }

  const format = exportFormat?.value || 'png'
  let dataURL
  let extension = format

  switch (format) {
    case 'jpeg':
      dataURL = fabricCanvas.toDataURL({ format: 'jpeg', quality: 0.95 })
      extension = 'jpg'
      break
    case 'webp':
      dataURL = fabricCanvas.toDataURL({ format: 'webp', quality: 0.95 })
      break
    default:
      dataURL = fabricCanvas.toDataURL({ format: 'png', multiplier: 2 })
  }

  const link = document.createElement('a')
  const baseName = currentFileName.replace(/\.[^/.]+$/, '')
  link.download = `${baseName || 'imperion-edit'}.${extension}`
  link.href = dataURL
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(dataURL)

  showToast('Image downloaded! 💾', 'success')
}

// ============================================================
// 19. DELETE SELECTED
// ============================================================
deleteSelectedBtn?.addEventListener('click', () => {
  const obj = fabricCanvas?.getActiveObject()
  if (obj) {
    fabricCanvas.remove(obj)
    fabricCanvas.discardActiveObject()
    fabricCanvas.renderAll()
    saveHistoryState()
    showToast('Object deleted', 'info')
  }
})

// ============================================================
// 20. RESET ALL
// ============================================================
resetAllBtn?.addEventListener('click', () => {
  if (!currentImage) return
  currentImage.set({
    angle: 0,
    flipX: false,
    flipY: false,
    opacity: 1
  })
  currentImage.filters = []
  currentImage.applyFilters()
  resetSliders()

  document.querySelectorAll('.filter-preset').forEach(p => p.classList.remove('active'))
  document.querySelector('.filter-preset[data-filter="none"]')?.classList.add('active')

  fabricCanvas.renderAll()
  saveHistoryState()
  showToast('All adjustments reset', 'info')
})

// ============================================================
// 21. TAB SWITCHING
// ============================================================
document.querySelectorAll('.sidebar__tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const panelId = 'panel-' + tab.dataset.panel

    document.querySelectorAll('.sidebar__tab').forEach(t => {
      t.classList.remove('active')
      t.setAttribute('aria-selected', 'false')
    })
    document.querySelectorAll('.sidebar__panel').forEach(p => p.classList.remove('active'))

    tab.classList.add('active')
    tab.setAttribute('aria-selected', 'true')
    document.getElementById(panelId)?.classList.add('active')
  })
})

// ============================================================
// 22. KEYBOARD SHORTCUTS
// ============================================================
document.addEventListener('keydown', (e) => {
  const isCtrl = e.ctrlKey || e.metaKey

  if (isCtrl && e.key === 'z') {
    e.preventDefault()
    undo()
  }

  if (isCtrl && e.key === 'y') {
    e.preventDefault()
    redo()
  }

  if (isCtrl && e.key === 'n') {
    e.preventDefault()
    fileInput?.click()
  }

  if (isCtrl && e.key === 's') {
    e.preventDefault()
    downloadImage()
  }

  if (e.key === 'Delete' || e.key === 'Backspace') {
    const obj = fabricCanvas?.getActiveObject()
    if (obj && document.activeElement === document.body) {
      e.preventDefault()
      fabricCanvas.remove(obj)
      fabricCanvas.discardActiveObject()
      fabricCanvas.renderAll()
      saveHistoryState()
    }
  }

  if (e.key === 'Escape') {
    if (cropModal.classList.contains('active')) closeCropModal()
    if (resizeModal.classList.contains('active')) resizeModal.classList.remove('active')
    if (isDrawingMode) {
      drawModeBtn?.click()
    }
  }
})

// ============================================================
// 23. TOAST SYSTEM
// ============================================================
function showToast(message, type = 'info') {
  const container = $('toastContainer')
  if (!container) return

  const toast = document.createElement('div')
  toast.classList.add('toast', `toast--${type}`)
  toast.textContent = message
  container.appendChild(toast)

  setTimeout(() => {
    toast.style.opacity = '0'
    toast.style.transform = 'translateY(16px)'
    toast.style.transition = 'all 0.3s ease'
    setTimeout(() => toast.remove(), 300)
  }, 2500)
}

// ============================================================
// 24. INITIALIZATION
// ============================================================
function init() {
  console.log('🚀 Imperion Studio initializing...')

  canvasEmpty.style.display = 'flex'
  canvasContainer.style.display = 'none'

  if (deleteSelectedBtn) deleteSelectedBtn.style.opacity = '0.4'

  updateUndoRedoButtons()

  console.log('✅ Imperion Studio ready!')
  console.log('   📷 Upload an image to start editing')
  console.log('   ⌨️  Ctrl+N: New image | Ctrl+Z: Undo | Ctrl+Y: Redo | Ctrl+S: Save | Del: Delete object')
}

init()