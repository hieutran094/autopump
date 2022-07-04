import { Setting } from '../models/index.js'

const getOne = async () => {
  return await Setting.findOne()
}

const updateOne = async (settingEntry) => {
  await Setting.updateOne({}, settingEntry)
  return await Setting.findOne()
}

const createOne = async (settingEntry) => {
  let setting = await Setting.findOne()
  if (!setting) setting = await Setting.create(settingEntry)
  return setting
}

export { getOne, createOne, updateOne }
