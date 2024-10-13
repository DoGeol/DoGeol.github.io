import React, { useEffect, useRef, useState } from 'react'
import { Image as KonvaImage, Layer, Rect, Stage, Text } from 'react-konva'
import html2canvas from 'html2canvas'

interface TextObject {
  id: number
  content: string
  position: { x: number; y: number }
  fontSize: number
  fontColor: string
  fontFamily: string
}

const ImageEditor: React.FC = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [texts, setTexts] = useState<TextObject[]>([])
  const [fontSize, setFontSize] = useState<number>(20)
  const [fontColor, setFontColor] = useState<string>('#000000')
  const [fontFamily, setFontFamily] = useState<string>('Arial')
  const [opacity, setOpacity] = useState<number>(0.5)
  const [isEditingId, setIsEditingId] = useState<number | null>(null)
  const stageRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const editableDivRef = useRef<HTMLDivElement>(null) // Reference for the editable div
  const [fileFormat, setFileFormat] = useState<string>('png')

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const img = new Image()
      img.src = URL.createObjectURL(event.target.files[0])
      img.onload = () => {
        setImage(img)
      }
    }
  }

  const handleTextDragEnd = (e: any, id: number) => {
    const newPos = e.target.position()
    setTexts((prevTexts) =>
      prevTexts.map((text) =>
        text.id === id ? { ...text, position: { x: newPos.x, y: newPos.y } } : text,
      ),
    )
  }

  const downloadImage = async () => {
    if (stageRef.current) {
      const canvas = await html2canvas(stageRef.current.container())
      const link = document.createElement('a')
      link.href = canvas.toDataURL(`image/${fileFormat}`) // 선택한 형식에 따라 데이터 URL 생성
      link.download = `edited-image.${fileFormat}` // 파일 이름
      link.click()
    }
  }

  const addText = () => {
    const newText: TextObject = {
      id: Date.now(),
      content: 'New Text',
      position: { x: 100, y: 100 },
      fontSize,
      fontColor,
      fontFamily,
    }
    setTexts((prev) => [...prev, newText])
  }

  const handleTextClick = (id: number) => {
    setIsEditingId(id)
    setTimeout(() => {
      editableDivRef.current?.focus() // Focus the editable div when editing starts
    }, 0)
  }

  const handleBlur = () => {
    if (isEditingId !== null && editableDivRef.current) {
      setTexts((prevTexts) =>
        prevTexts.map((text) =>
          text.id === isEditingId
            ? { ...text, content: editableDivRef?.current?.innerText || '' }
            : text,
        ),
      )
    }
    setIsEditingId(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault() // 기본 Enter 동작 방지
      const selection = window.getSelection()
      const range = selection?.getRangeAt(0)

      if (range) {
        const br = document.createElement('br')
        range.insertNode(br) // <br> 요소를 현재 커서 위치에 삽입
        range.setStartAfter(br) // 커서를 <br> 다음으로 이동
        range.collapse(true)
        selection?.removeAllRanges()
        selection?.addRange(range) // 커서 위치 업데이트
      }
    }
  }

  const handleFontColorChange = (newColor: string) => {
    setFontColor(newColor)
    setTexts((prevTexts) => prevTexts.map((text) => ({ ...text, fontColor: newColor })))
  }

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        const height = containerRef.current.offsetHeight
        stageRef.current.width(width)
        stageRef.current.height(height)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Set initial size

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="flex flex-col items-center">
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <div className="mt-4 flex space-x-2">
        <input
          type="color"
          value={fontColor}
          onChange={(e) => handleFontColorChange(e.target.value)}
        />

        <input
          type="number"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-16 border p-2"
          placeholder="Font size"
        />
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="border p-2"
        >
          <option value="Arial">Arial</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Verdana">Verdana</option>
        </select>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))}
          className="w-32"
        />
        <select
          value={fileFormat}
          onChange={(e) => setFileFormat(e.target.value)}
          className="border p-2"
        >
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
          <option value="webp">WEBP</option>
        </select>
        <button onClick={downloadImage} className="bg-blue-500 p-2 text-white">
          Download
        </button>
        <button onClick={addText} className="bg-green-500 p-2 text-white">
          Add Text
        </button>
      </div>
      <div className="relative mt-4 w-full border" ref={containerRef} style={{ height: '600px' }}>
        <Stage ref={stageRef} width={800} height={600}>
          <Layer>
            {image && (
              <>
                <KonvaImage image={image} width={800} height={600} />
                {/* Dimming effect */}
                <Rect x={0} y={0} width={800} height={600} fill="black" opacity={opacity} />
                {texts.map((text) => (
                  <React.Fragment key={text.id}>
                    {isEditingId !== text.id && ( // Only render text when not editing
                      <Text
                        text={text.content}
                        fontSize={text.fontSize}
                        fill={text.fontColor}
                        fontFamily={text.fontFamily}
                        x={text.position.x}
                        y={text.position.y}
                        draggable
                        onDragEnd={(e) => handleTextDragEnd(e, text.id)}
                        onClick={() => handleTextClick(text.id)} // Enable text editing on click
                      />
                    )}
                  </React.Fragment>
                ))}
              </>
            )}
          </Layer>
        </Stage>
        {/* Content editable div for inline text editing */}
        {isEditingId !== null && (
          <div
            ref={editableDivRef} // Reference for the editable div
            contentEditable
            className="absolute left-0 border border-gray-300 p-1"
            style={{
              left: texts.find((t) => t.id === isEditingId)?.position.x || 0,
              top: texts.find((t) => t.id === isEditingId)?.position.y || 0,
              fontSize: fontSize,
              color: fontColor,
              fontFamily: fontFamily,
              minWidth: '50px', // Minimum width to start editing
              textAlign: 'left', // Left alignment
              whiteSpace: 'pre-wrap', // Preserve whitespace and enable wrapping
              overflowWrap: 'break-word', // Break long words onto the next line
              zIndex: 1, // Ensure it appears above other elements
              backgroundColor: 'rgba(255, 255, 255, 0)', // Transparent background
              height: 'auto', // Allow height to grow with text
              minHeight: '20px', // Minimum height for visibility
            }}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            suppressContentEditableWarning={true} // Prevent React warning for editable div
          >
            {texts.find((t) => t.id === isEditingId)?.content}
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageEditor
