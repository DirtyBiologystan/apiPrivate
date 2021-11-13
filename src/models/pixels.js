module.exports = async (mongoose) => {
  const Schema = mongoose.Schema;

  const model = mongoose.model(
    "Pixels",
    new Schema({
      x: { type: Number, index: true },
      y: { type: Number, index: true },
      indexInFlag: { type: Number, unique: true },
      index: { type: Number, unique: true },
      hexColor: { type: String, index: true },
      author: { type: String, index: true },
      pseudo: { type: String, index: true },
      discord: {
        pseudo: { type: String, index: true },
        id: { type: String, index: { unique: true, sparse: true } },
      },
    })
  );
  await model.syncIndexes();
  return model;
};
