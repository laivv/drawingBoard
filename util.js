
/**
 * 创建input来选取一个文件
 */
var selectFile = function () {
  var input = null
  var _callback = null
  return function (callback) {
    _callback = callback
    if (input === null) {
      input = document.createElement('input')
      input.type = "file"
      Object.assign(input.style, {
        display: 'none',
        height: '1px'
      })

      input.onchange = function () {
        if (input.value) {
          var file = input.files[0]
          input.value = ''
          _callback(file)
        }
      }
      document.body.appendChild(input)
    }
    input.click()
  }
}()
/**
 * 打开文件选择框，选取一个文件
 */
var openFilePicker = function () {
  if (window.showOpenFilePicker) {
    return new Promise(async (resolve, reject) => {
      try {
        var handle = await showOpenFilePicker()
        var file = await handle[0].getFile()
        resolve(file)
      } catch (e) {
        reject(e)
      }
    })
  } else {
    return new Promise((resolve) => {
      selectFile(resolve)
    })
  }
}

/**
 * 从buffer创建二进制文件
 */
var createBinaryFilefromBuffer = function (buffer) {
  return new Blob([buffer], { type: 'application/octet-stream' })
}

/**
 * 将文件读取为Image
 */
var readFileAsImage = function (file) {
  return new Promise((resolve, reject) => {
    var fr = new FileReader()
    fr.readAsDataURL(file)
    fr.onload = function () {
      var image = new Image()
      image.src = this.result
      image.onload = () => {
        resolve(image)
      }
    }
    fr.onerror = () => {
      reject()
    }
  })
}
/**
 * 将文件读取为buffer
 */
var readFileAsBuffer = function (file) {
  return new Promise((resolve, reject) => {
    var fr = new FileReader()
    fr.readAsArrayBuffer(file)
    fr.onload = function () {
      resolve(fr.result)
    }
    fr.onerror = reject
  })
}
/**
 * 将十进制数的每一位转为二进制数字符
 */
var toComplexBinaryNumberString = function (n, digit = 8) {
  return n.toString(10).split("").map(v => Number(v).toString(2).padStart(digit, '0')).join("")
}
/**
 * 将0-255以内的十进制数转为二进制数字符
 */
var toBinaryNumberString = function (n, digit = 8) {
  return n.toString(2).padStart(digit, '0')
}
/**
 * 从数组创建一个buffer
 */
var createBufferFromArray = function (array) {
  var buffer = new ArrayBuffer(array.length)
  var i8 = new Uint8Array(buffer)
  array.forEach((v, i) => {
    i8[i] = v
  })
  return buffer
}
/**
 * 从二进制文本数据创建buffer
 */
var createBufferFromBinaryString = function (str) {
  var ret = []
  for (var i = 0, len = str.length; i < len; i += 8) {
    ret.push(Number('0b' + str.substr(i, 8)))
  }
  return createBufferFromArray(ret)
}

/**
 * 将十六进制颜色转成rgb数组
 */
var getRgbFromHexString = function (str) {
  var r = Number('0x' + e.target.value.slice(1, 3))
  var g = Number('0x' + e.target.value.slice(3, 5))
  var b = Number('0x' + e.target.value.slice(5, 7))
  return [r, g, b]
}

/**
 * 从buffer下载文件
 */
var downloadFileFromBuffer = function (buffer, fileName) {
  var a = document.createElement('a')
  a.href = window.URL.createObjectURL(createBinaryFilefromBuffer(buffer))
  a.download = fileName
  a.click()
}

/**
 * 将图片绘制到canvas
 */
var drawImage = function (ctx, image) {
  ctx.drawImage(image, 0, 0, image.width, image.height)
}

/**
 * 遍历imageData
 */
var eachImageData = function (imageData, callback) {
  var width = imageData.width
  var height = imageData.height
  var data = imageData.data
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var i = y * width + x
      var r = data[4 * i + 0], g = data[4 * i + 1], b = data[4 * i + 2]
      callback(x, y, r, g, b)
    }
  }
}







