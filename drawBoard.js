class DrawBoard {

  constructor(option) {
    this.init(option)
  }

  init(option) {
    this.width = option.width
    this.height = option.height
    this.mouseDown = false
    this.sourcePoint = null
    this.lastPoint = null
    this.brushType = 'line'
    this.brushColor = '#000'
    this.plugins = []
    this.imageData = null
    this.createCanvas()
    this.initListener(['mousedown', 'mousemove', 'mouseup'])
    this.initListener(['touchstart', 'touchmove', 'touchend'])

  }
  createCanvas() {
    var canvas = document.createElement('canvas')
    canvas.width = this.width
    canvas.height = this.height
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
  }
  getPosition(e) {
    var x = 0, y = 0
    if (['mouseup', 'mousedown', 'mousemove'].includes(e.type)) {
      x = e.layerX
      y = e.layerY
    } else {
      var rect = this.canvas.getBoundingClientRect()
      if (e.type === 'touchend') {
        x = e.changedTouches[0].pageX - rect.left
        y = e.changedTouches[0].pageY - rect.top
      } else {
        x = e.targetTouches[0].pageX - rect.left
        y = e.targetTouches[0].pageY - rect.top
      }
    }
    return { x, y }
  }
  initListener(events) {
    this.canvas.addEventListener(events[0], e => {
      this.mouseDown = true
      var point = this.getPosition(e)
      this.sourcePoint = point
      this.lastPoint = point
      this.onMouseDown(point)
    })
    this.canvas.addEventListener(events[1], e => {
      var point = this.getPosition(e)
      this.onMouseMove(point)
      this.lastPoint = point
    })
    document.addEventListener(events[2], e => {
      this.mouseDown = false
      var point = this.getPosition(e)
      this.onMouseUp(point)
    })
    this.canvas.addEventListener('contextmenu', e => {
      e.preventDefault()
    })
  }

  onMouseDown(point) {
    if (this.brushType) {
      if (this.brushType === 'line') {
        this.drawDot(point)
      }
      else if (['circle', 'rect'].includes(this.brushType)) {
        this.saveCtx()
      }
      else if (this.brushType === 'clear') {
        this.ctx.clearRect(point.x - 50, point.y - 50, 100, 100)
        this.saveCtx()
        this.drawRemoveRect(point)
      }
    }
  }

  onMouseMove(point) {
    if (this.mouseDown) {
      if (this.brushType === 'line') {
        this.drawLine(point)
      }
      else if (this.brushType === 'circle') {
        this.drawCircle(point)
      }
      else if (this.brushType === 'rect') {
        this.drawRect(point)
      }
    }

    if (this.brushType === 'clear') {
      this.drawRemoveRect(point)
      if (this.mouseDown) {
        this.ctx.clearRect(point.x - 50, point.y - 50, 100, 100)
        this.saveCtx()
        this.drawRemoveRect(point)
      }
    }
  }
  onMouseUp(point) {

  }

  drawDot(point) {
    var ctx = this.ctx
    ctx.beginPath()
    ctx.fillStyle = this.brushColor
    ctx.fillRect(point.x, point.y, 1, 1)
  }
  drawLine(point) {
    var ctx = this.ctx
    ctx.strokeStyle = this.brushColor
    ctx.lineWidth = 1
    ctx.beginPath()
    if (this.lastPoint) {
      ctx.moveTo(this.lastPoint.x, this.lastPoint.y)
      ctx.lineTo(point.x, point.y)
      ctx.stroke()
    }
  }
  drawCircle(point) {
    var vx = point.x - this.sourcePoint.x
    var vy = point.y - this.sourcePoint.y
    var r = Math.sqrt(vx * vx + vy * vy)
    var ctx = this.ctx
    this.resoreCtx()
    ctx.beginPath()
    ctx.strokeStyle = this.brushColor
    ctx.arc(this.sourcePoint.x, this.sourcePoint.y, r, 0, 2 * Math.PI)
    ctx.stroke()
  }
  drawRect(point) {
    var vx = point.x - this.sourcePoint.x
    var vy = point.y - this.sourcePoint.y
    var ctx = this.ctx
    this.resoreCtx()
    ctx.beginPath()
    ctx.strokeStyle = this.brushColor
    ctx.rect(this.sourcePoint.x, this.sourcePoint.y, vx, vy)
    ctx.stroke()
  }
  drawRemoveRect(point) {
    var vx = point.x - 50
    var vy = point.y - 50
    var ctx = this.ctx
    this.resoreCtx()
    ctx.beginPath()
    ctx.fillStyle = 'rgba(200,200,200,0.5)'
    ctx.fillRect(vx, vy, 100, 100)
  }
  drawImage(image) {
    this.ctx.drawImage(image, 0, 0, image.width, image.height)
  }
  setBrush(option) {
    if (this.brushType === 'clear' && option.type !== 'clear') {
      this.resoreCtx()
    }
    this.brushType = option.type || this.brushType
    this.brushColor = option.color || this.brushColor
    if (this.brushType === 'clear') {
      this.saveCtx()
    }
  }
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }
  saveCtx() {
    this.imageData = this.ctx.getImageData(0, 0, this.width, this.height)
  }
  resoreCtx() {
    if (this.imageData) {
      this.ctx.putImageData(this.imageData, 0, 0)
    }
  }
  getImageData() {
    return this.ctx.getImageData(0, 0, this.width, this.height)
  }
  getMapRect() {
    return { width: this.width, height: this.height }
  }
  getCanvas() {
    return this.canvas
  }
  getCtx() {
    return this.ctx
  }
  use(plugin) {
    this.plugins.push(plugin)
  }
}