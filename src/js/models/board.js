const path = require('path')
const util = require('../utils/index')

const boardFileImageSize = boardFileData =>
  (boardFileData.aspectRatio >= 1)
    ? [900 * boardFileData.aspectRatio, 900]
    : [900, 900 / boardFileData.aspectRatio]

const boardFilenameForExport = (board, index, basenameWithoutExt) =>
  `${basenameWithoutExt}-board-` + util.zeroFill(5, index + 1) + '.png'

const boardFilenameForThumbnail = board =>
  board.url.replace('.png', '-thumbnail.png')

const boardFilenameForLink = board =>
  board.url.replace('.png', '.psd')

// array of fixed size, ordered positions
const boardOrderedLayerFilenames = board => {
  let indices = []
  let filenames = []

  // reference
  if (board.layers && board.layers.reference &&
      board.layers.reference.url && board.layers.reference.url.length) { // silently ignore blank urls
    indices.push(0)
    filenames.push(board.layers.reference.url)
  }

  // main
  indices.push(1)
  filenames.push(board.url)

  // notes
  if (board.layers && board.layers.notes &&
      board.layers.notes.url && board.layers.notes.url.length) { // silently ignore blank urls
    indices.push(3)
    filenames.push(board.layers.notes.url)
  }
  
  return { indices, filenames }
}

// TODO clean data on load, instead of converting string-to-number here
const boardDuration = (scene, board) =>
  board.duration != null
    ? Number(board.duration)
    : Number(scene.defaultBoardTiming)

const boardDurationWithAudio = (scene, board) =>
  Math.max(
    board.audio && board.audio.duration ? board.audio.duration : 0,
    boardDuration(scene, board)
  )

const assignUid = board => {
  board.uid = util.uidGen(5)
  return board
}

const setup = board => {
  board.layers = board.layers || {} // TODO is this necessary?

  // set some basic data for the new board
  board.newShot = board.newShot || false
  board.lastEdited = Date.now()

  return board
}

const updateUrlsFromIndex = (board, index) => {
  board.url = 'board-' + (index + 1) + '-' + board.uid + '.png'

  if (board.layers.reference) {
    board.layers.reference.url = board.url.replace('.png', '-reference.png')
  }

  if (board.layers.notes) {
    board.layers.notes.url = board.url.replace('.png', '-notes.png')
  }

  return board
}

// calculate link filename from url filename, preserving link extension
const getUpdatedLinkFilename = board => {
  return path.basename(board.url, path.extname(board.url)) + path.extname(board.link)
}

module.exports = {
  boardFileImageSize,
  boardFilenameForExport,
  boardFilenameForThumbnail,
  boardFilenameForLink,
  boardOrderedLayerFilenames,
  boardDuration,
  boardDurationWithAudio,

  getUpdatedLinkFilename,

  assignUid,
  setup,
  updateUrlsFromIndex
}
